"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { type BookExperimentsSpread, type BookPlaygroundVideo } from "@/data/content";
import { useBookPage } from "./bookCtx";
import { Block } from "./BookPages";

/** "My Playground", left page: heading, intro and four small tilted prints with handwritten
    captions (the Play section of the earlier portfolio). */
export function PlaygroundLeft({ spread }: { spread: BookExperimentsSpread }) {
  return (
    <div className="bk-content bk-pg-left">
      <Block
        block={{
          text: spread.heading,
          tag: "h2",
          font: "advercase",
          sizePx: 40,
          color: "var(--bk-ink)",
          offsetYPx: 15,
        }}
      />
      <p className="bk-pg-intro">{spread.intro}</p>
      <ul className="bk-pg-photos">
        {spread.photos.map((p, i) => (
          <li key={p.src} className="bk-pg-photo" data-i={i}>
            <div className="bk-pg-frame">
              <div className="bk-pg-img">
                <Image src={p.src} alt={p.alt} fill sizes="160px" style={{ objectFit: "cover" }} />
              </div>
            </div>
            <p className="bk-pg-caption">{p.caption}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One clip on the right page: loads near the spread, plays only while it is open and still. */
function PlaygroundVideo({
  video,
  active,
  near,
  settled,
}: {
  video: BookPlaygroundVideo;
  active: boolean;
  near: boolean;
  settled: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!(active && settled)) {
      v.pause();
      return;
    }
    // the source may only just have been attached (a direct load at this spread): if it is not
    // ready yet, try again as soon as it can play
    const retry = () => void v.play().catch(() => {});
    v.play().catch(() => v.addEventListener("canplay", retry, { once: true }));
    return () => v.removeEventListener("canplay", retry);
  }, [active, settled, near]);
  return (
    <figure className="bk-pg-video">
      <div className="bk-pg-video-frame">
        <video
          ref={ref}
          src={near ? video.src : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={video.caption}
        />
      </div>
      <figcaption>
        <span className="bk-pg-video-caption">{video.caption}</span>
        <span className="bk-pg-made-with">{video.madeWith}</span>
      </figcaption>
    </figure>
  );
}

/** "My Playground", right page: the two videos with captions and "made with" notes. */
export function PlaygroundRight({
  spread,
  stop,
}: {
  spread: BookExperimentsSpread;
  stop: number;
}) {
  const api = useBookPage();
  const active = api?.spread === stop;
  const near = api ? Math.abs(api.spread - stop) <= 1 : false;
  return (
    <div className="bk-content bk-pg-right">
      {spread.videos.map((v) => (
        <PlaygroundVideo
          key={v.src}
          video={v}
          active={active}
          near={near}
          settled={!!api?.settled}
        />
      ))}
    </div>
  );
}
