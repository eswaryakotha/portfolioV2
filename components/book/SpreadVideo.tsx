"use client";

import { type CSSProperties } from "react";
import { book, type BookCaseStudySpread } from "@/data/content";
import { useBookPage } from "./bookCtx";
import { playsOnce, VIDEO_START } from "@/lib/video";

/** One printed half of a case-study spread's video. The left half sits on the left page and
    the right half on the right page, so each half turns with its page. These are only what
    you see while pages turn: once the spread settles, the raised card (SpreadCard) covers
    them with one unsplit copy and they are hidden (data-covered). The card sets their frame
    before they show again, so the hand over is invisible. */
export default function VideoHalf({
  spread,
  stop,
  side,
}: {
  spread: BookCaseStudySpread;
  stop: number;
  side: "l" | "r";
}) {
  const api = useBookPage();
  const near = api ? Math.abs(api.spread - stop) <= 1 : false;
  const hero = spread.heroVideo;
  // MetaMint and Dolby show their real frame at VIDEO_START, never the poster, once loaded
  const startAt = playsOnce(spread.slug);

  return (
    <div
      className={`bk-vhalf bk-vhalf-${side}`}
      data-media-for={spread.id}
      data-side={side}
      aria-hidden="true"
      style={{ "--accent-tab": spread.accent } as CSSProperties}
    >
      {side === "r" && (
        // the tab as printed on the page; the one you pull is on the raised card
        <div className="bk-tab-slot">
          <span className="bk-tab">
            <span className="bk-tab-grip" />
            <span className="bk-tab-text">{book.ui.tabText}</span>
          </span>
        </div>
      )}
      {hero?.src ? (
        <div className="bk-vclip">
          <video
            src={near ? hero.src : undefined}
            poster={hero.poster || undefined}
            muted
            loop
            playsInline
            preload={near ? "auto" : "none"}
            tabIndex={-1}
            onLoadedData={startAt ? (e) => {
              // jump past the opening frame: this also swaps the poster for the real frame
              const v = e.currentTarget;
              if (v.currentTime < VIDEO_START) v.currentTime = VIDEO_START;
            } : undefined}
          />
        </div>
      ) : (
        <div className="bk-vclip bk-dashed bk-video-ph" />
      )}
    </div>
  );
}
