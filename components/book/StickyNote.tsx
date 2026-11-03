import { type CSSProperties } from "react";
import { book, type BookCaseStudySpread } from "@/data/content";

const N = book.settings.stickyNote;

/** A sticky note beside the video on a case-study spread's right page, flat on the page:
    a small label and a handwritten line, in the project's ink on a complementary colour. */
export default function StickyNote({ spread }: { spread: BookCaseStudySpread }) {
  const note = spread.stickyNote;
  if (!note) return null;
  const size = note.textSizePx ?? N.textSizePx;
  return (
    <aside
      className="bk-sticky"
      aria-label={note.label}
      style={
        {
          "--sticky": note.color,
          "--ink": note.ink ?? spread.accent,
          left: `${N.centerXPct - N.widthPct / 2}%`,
          top: `${N.centerYPct}%`,
          width: `${N.widthPct}%`,
          rotate: `${N.tiltDeg}deg`,
          "--sticky-text": `min(${size}px, ${((size / 530) * 100).toFixed(3)}cqw)`,
        } as CSSProperties
      }
    >
      <p className="bk-sticky-label">{note.label}</p>
      <p className="bk-sticky-text">{note.text}</p>
    </aside>
  );
}
