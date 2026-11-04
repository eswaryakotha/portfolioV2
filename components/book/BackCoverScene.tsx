"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { book } from "@/data/content";
import { useBookPage } from "./bookCtx";
import SkyScene, { buildSky } from "./SkyScene";
import { useSky, type Sky } from "./useSky";

const B = book.backCover;

/* Page geometry, in % of the page width (the page is a container, so these are cqw):
   the sketch is 94 wide at the bottom with a bottom margin of 6% of the page height; the sky
   is everything above it, below a 6% top padding. */
const PAGE_H = 200 / book.settings.bookAspect;
const PAD = PAGE_H * 0.06;
const SKETCH_W = 94;
const SKETCH_H = SKETCH_W / (B.sketch.width / B.sketch.height);
const SKY_H = PAGE_H - PAD * 2 - SKETCH_H;
/** sun about 72% across and 24% down the page, moon about 28% across; radius 6.5% of width */
const GEOMETRY = buildSky({
  h: SKY_H,
  sunAt: [72, PAGE_H * 0.24 - PAD],
  moonAt: [28, PAGE_H * 0.24 - PAD],
  radius: 6.5,
  starCount: B.starCount,
  rainCount: B.rainCount,
});

/** The page colour: the sketch's own background when it is that close to the board colour. */
const near = (a: string, b: string, tol: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = p(a);
  const y = p(b);
  return x.every((v, i) => Math.abs(v - y[i]) <= tol);
};
export const BACK_COVER_BG = near(B.sketchBg, book.colors.cover, 8) ? B.sketchBg : book.colors.cover;
const BLEND = BACK_COVER_BG !== B.sketchBg; // too far apart: blend the image in instead

function skyLabel(s: Sky) {
  const sky =
    s.condition === "clear" ? B.label.sky[s.isDay ? "clear-day" : "clear-night"] : B.label.sky[s.condition];
  return B.label.template
    .replace("{landmark}", B.location.landmark)
    .replace("{name}", B.location.name)
    .replace("{sky}", sky);
}

/** The word for the handwritten line: rainy, cloudy, or sunny by day and clear by night. */
function captionWord(s: Sky) {
  const w = B.caption.words;
  if (s.condition === "rain") return w.rainy;
  if (s.condition === "cloudy") return w.cloudy;
  return s.isDay ? w.sunny : w.clear;
}

/** The right page of the last spread: the chalk sketch of Vidhana Soudha under a chalk sky
    that follows the current weather in Bengaluru. */
export default function BackCoverScene({ stop }: { stop: number }) {
  const api = useBookPage();
  const spread = api?.spread ?? 0;
  const current = spread === stop;
  const active = current && !!api?.settled;
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (spread > 0 && !opened) {
      const t = window.setTimeout(() => setOpened(true), 0);
      return () => window.clearTimeout(t);
    }
  }, [spread, opened]);
  // the scene shows only with live weather data; until it arrives, or if it fails, the page
  // is left blank
  const sky = useSky({ opened, current, refreshMinutes: B.refreshMinutes });

  return (
    <div
      className="bk-content bk-backcover"
      style={{ "--chalk": B.chalk, "--backcover-bg": BACK_COVER_BG } as CSSProperties}
    >
      <div
        className="bk-bc-scene"
        data-ready={sky ? "" : undefined}
        role={sky ? "img" : undefined}
        aria-label={sky ? skyLabel(sky) : undefined}
        aria-hidden={sky ? undefined : true}
      >
        {sky ? (
          <SkyScene
            geometry={GEOMETRY}
            condition={sky.condition}
            isDay={sky.isDay}
            active={active}
            chalk={B.chalk}
            fill={BACK_COVER_BG}
            heightCqw={SKY_H}
          />
        ) : null}
        {B.sketch.src ? (
          opened ? (
            <Image
              className={`bk-bc-sketch${BLEND ? " is-blended" : ""}`}
              src={B.sketch.src}
              width={B.sketch.width}
              height={B.sketch.height}
              alt={B.sketch.alt}
              sizes="40vw"
              loading="lazy"
              // served as the original file: the sketch is never re-encoded
              unoptimized
            />
          ) : null
        ) : (
          <div className="bk-bc-sketch bk-dashed bk-bc-ph" aria-hidden="true">
            {B.sketch.placeholder}
          </div>
        )}
      </div>
      {sky ? (
        <p className="bk-bc-caption">
          {B.caption.template.split("{word}")[0]}
          <span className="bk-bc-word">{captionWord(sky)}</span>
          {B.caption.template.split("{word}")[1] ?? ""}
        </p>
      ) : null}
      {sky ? (
        <a className="bk-bc-credit" href={B.credit.href} target="_blank" rel="noopener noreferrer">
          {B.credit.text}
        </a>
      ) : null}
    </div>
  );
}
