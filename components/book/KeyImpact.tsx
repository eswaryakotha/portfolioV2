import { type CSSProperties } from "react";
import { book, type BookCaseStudySpread } from "@/data/content";
import { richText } from "./richText";

const K = book.settings.keyImpact;

/** The "Key impact" row under the video: a label and paper notes laid flat across the
    spread, the middle one over the fold. The whole row is drawn on each page (spread-wide,
    positioned from that page's edge) and each page only shows its own half, so whatever sits
    across the fold turns with both pages, like print. The right page's copy is hidden from
    screen readers. */
export default function KeyImpact({
  spread,
  side,
}: {
  spread: BookCaseStudySpread;
  side: "l" | "r";
}) {
  const ki = spread.keyImpact;
  if (!ki) return null;
  const n = ki.items.length;
  return (
    <div
      className={`bk-spread-layer bk-spread-layer-${side}`}
      aria-hidden={side === "r" ? true : undefined}
      style={{ "--ink": ki.ink ?? spread.accent } as CSSProperties}
    >
      {/* above the first note, starting at its left edge */}
      <p
        className="bk-ki-label"
        style={{
          top: `${K.labelTopPct}%`,
          left: `${50 - ((n - 1) / 2) * K.noteSpacingPct - K.noteWidthPct / 2}%`,
        }}
      >
        {ki.label}
      </p>
      <ul className="bk-ki-notes" aria-label={ki.label}>
        {ki.items.map((text, i) => {
          // centred on the fold, spaced evenly either side
          const offset = (i - (n - 1) / 2) * K.noteSpacingPct;
          return (
            <li
              key={i}
              className="bk-ki-note"
              style={{
                left: `${50 + offset - K.noteWidthPct / 2}%`,
                top: `${K.notesTopPct}%`,
                width: `${K.noteWidthPct}%`,
                height: `${K.noteHeightPct}%`,
                rotate: `${K.tiltsDeg[i % K.tiltsDeg.length]}deg`,
              }}
            >
              <span>
                {richText(text)}
                {/* the footnote goes in the note whose text carries the * mark */}
                {ki.footnote && text.includes("*", text.lastIndexOf("**") + 2) ? (
                  <small className="bk-ki-footnote">{ki.footnote}</small>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
