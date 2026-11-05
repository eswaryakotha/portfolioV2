"use client";

import { type CSSProperties } from "react";
import { ArrowUpRight, UserRound } from "lucide-react";
import type { IdCardData, IdCardSettings } from "@/data/content";
import type { IdCardCtl } from "./useIdCard";
import "./idcard.css";

/** The company mark: a rounded square with an upward tick. */
function Mark() {
  return (
    <svg
      className="idc-mark"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6 12.5 L10 7.5 L14 12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Gloss({ on }: { on: boolean }) {
  return on ? <span className="idc-sheen" /> : null;
}

/** The card's face: company, photo, name, and the role along the bottom. */
function CardFace({ data, sheen }: { data: IdCardData; sheen: boolean }) {
  return (
    <div className="idc-face">
      <p className="idc-company">
        <Mark />
        <span>{data.company}</span>
      </p>
      <div className="idc-photo">
        {data.photo ? null : (
          <span className="idc-photo-ph">
            <UserRound aria-hidden="true" />
            <span>{data.photoPlaceholder}</span>
          </span>
        )}
      </div>
      {data.photo ? (
        // the cut-out stands in the frame: clipped inside its sides and bottom, but free at
        // the top, so the head rises over the frame's top edge
        <div className="idc-photo-cut">
          {/* eslint-disable-next-line @next/next/no-img-element -- a transparent cut-out, sized by the card */}
          <img src={data.photo} alt="" />
        </div>
      ) : null}
      <p className="idc-name">{data.name}</p>
      <ArrowUpRight className="idc-arrow" strokeWidth={3} />
      <p className="idc-role">{data.role}</p>
      <Gloss on={sheen} />
    </div>
  );
}

/**
 * An ID card tucked into a paper slot on the page.
 *
 * The card is drawn in one of two places, both the same size and position:
 * - layer "page": the holder and the seated card, inside a page that may clip its contents.
 * - layer "overlay": the card while it lifts, is out, or goes back, in a layer that is not
 *   clipped. Until the card clears the slot it also draws a copy of the slot over the
 *   card, so the card still looks tucked in.
 * - layer "both": the two together, for a place that does not clip (for example /about).
 * One controller (useIdCard) drives both and swaps them with data attributes on a shared
 * ancestor, so the swap happens on a single frame.
 */
export default function IdCardHolder({
  data,
  settings,
  ctl,
  layer,
  cardId,
  hint = false,
}: {
  data: IdCardData;
  settings: IdCardSettings;
  ctl: IdCardCtl;
  layer: "page" | "overlay" | "both";
  cardId: string; // id of the overlay card, which the seated card's button controls
  hint?: boolean;
}) {
  const style = {
    "--card-h": settings.cardHeight,
    "--card-aspect": settings.cardAspect,
    "--seat": settings.seat,
    "--lean": `${settings.restLean}deg`,
    "--idc-card-color": settings.colors.card,
    "--idc-edge-color": settings.colors.edge,
    "--idc-ink": settings.colors.ink,
    "--idc-accent": settings.colors.accent,
    "--idc-accent-ink": settings.colors.accentInk,
  } as CSSProperties;
  const {
    phase,
    toggle,
    setBox,
    setCard,
    setShadow,
    setPageButton,
    onCardPointerMove,
    onCardPointerLeave,
  } = ctl;
  const sr = data.ui.srLine
    .replace("{name}", data.name)
    .replace("{role}", data.role)
    .replace("{company}", data.company);
  const edges = Array.from(
    { length: Math.max(0, Math.round(settings.cardThickness)) },
    (_, k) => k + 1,
  );

  const page = (
    <div
      className="idc-box idc-page"
      style={style}
      data-hint={hint ? "" : undefined}
    >
      <p className="sr-only">{sr}</p>
      <span className="idc-contact-shadow" aria-hidden="true" />
      <div className="idc-card idc-static" aria-hidden="true">
        <CardFace data={data} sheen={settings.sheen} />
      </div>
      <span className="idc-lip idc-part" data-nodrag="" aria-hidden="true" />
      <p className="idc-caption">{data.ui.caption}</p>
      <button
        ref={setPageButton}
        type="button"
        className="idc-hit"
        aria-label={data.ui.takeOut}
        aria-expanded={false}
        aria-controls={cardId}
        onClick={toggle}
      />
      {hint ? (
        <span className="idc-hint" aria-hidden="true">
          <svg viewBox="0 0 48 40" fill="none">
            <path
              d="M44 8 C 30 4, 14 10, 8 28"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M3 20 L8 29 L16 23"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{data.ui.hint}</span>
        </span>
      ) : null}
    </div>
  );

  const overlay = (
    <div className="idc-box idc-overlay" style={style} ref={setBox}>
      <span className="idc-out-shadow" ref={setShadow} aria-hidden="true" />
      <button
        ref={setCard}
        id={cardId}
        type="button"
        className="idc-card idc-live"
        aria-label={data.ui.putBack}
        aria-expanded={phase !== "seated"}
        onClick={toggle}
        onPointerMove={onCardPointerMove}
        onPointerLeave={onCardPointerLeave}
      >
        <span className="idc-card-3d" aria-hidden="true">
          <CardFace data={data} sheen={settings.sheen} />
          {/* the card's thickness, showing at its edges as it tilts */}
          {edges.map((k) => (
            <span
              key={k}
              className="idc-edge"
              style={{ transform: `translateZ(${-k}px)` }}
            />
          ))}
        </span>
      </button>
      {/* the holder's front, drawn over the card until the card has cleared it */}
      <span className="idc-front-copy" aria-hidden="true">
        <span className="idc-lip" />
      </span>
    </div>
  );

  if (layer === "page") return page;
  if (layer === "overlay") return overlay;
  return (
    <div className="idc-both">
      {page}
      {overlay}
    </div>
  );
}
