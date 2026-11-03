import Image from "next/image";
import { type CSSProperties } from "react";
import { book, type BookCaseStudySpread } from "@/data/content";

const P = book.settings.polaroid;

/** An instant photo taped near the top-right corner of a case-study spread's right page,
    flat on the page. Shows a placeholder until an image is set in the data. */
export default function Polaroid({ spread }: { spread: BookCaseStudySpread }) {
  const p = spread.polaroid;
  if (!p) return null;
  return (
    <figure
      className="bk-polaroid"
      style={
        {
          right: `${P.rightPct}%`,
          top: `${P.topPct}%`,
          width: `${P.widthPct}%`,
          rotate: `${P.tiltDeg}deg`,
          "--polaroid-w": P.widthPct,
        } as CSSProperties
      }
    >
      <span className="bk-tape" aria-hidden="true" style={{ rotate: `${P.tapeTiltDeg}deg` }} />
      <div className="bk-polaroid-photo">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.alt ?? ""}
            fill
            sizes="200px"
            style={{
              objectFit: "cover",
              objectPosition: p.position ?? "center",
              scale: p.zoom && p.zoom !== 1 ? String(p.zoom) : undefined,
              transformOrigin: p.position ?? "center",
            }}
          />
        ) : (
          <span className="bk-polaroid-ph" aria-hidden="true">
            {p.placeholder}
          </span>
        )}
      </div>
      {p.caption ? <figcaption className="bk-polaroid-caption">{p.caption}</figcaption> : null}
    </figure>
  );
}
