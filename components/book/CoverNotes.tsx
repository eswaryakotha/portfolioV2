import type { CSSProperties } from "react";
import Image from "next/image";
import { book } from "@/data/content";

const N = book.cover.notes;
const R = N.roundStamp;

/** Two sticky notes on the book's cover: a yellow one with a line about me, and a pink one
    overlapping its lower right corner with my core strengths as pills, and a round stamp
    on the pink note's top right corner. */
export default function CoverNotes() {
  return (
    <div
      className="bk-cnotes"
      style={{ "--note-yellow": N.yellow, "--note-pink": N.pink, "--note-blue": N.blue } as CSSProperties}
    >
      <p className="bk-cnote bk-cnote-blue">
        <span>{N.corner}</span>
      </p>
      <p className="bk-cnote bk-cnote-yellow">{N.tagline}</p>
      <div className="bk-cnote bk-cnote-pink">
        <p className="bk-cnote-head">{N.strengthsHeading}</p>
        <ul className="bk-cnote-pills">
          {N.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      {/* postage stamp over the yellow note's bottom edge */}
      <Image
        className="bk-poststamp"
        src={N.postStamp.src}
        alt=""
        width={N.postStamp.width}
        height={N.postStamp.height}
        sizes="200px"
      />

      {/* stickers */}
      {N.stickers.map((st) => (
        <Image
          key={st.src}
          className="bk-sticker"
          src={st.src}
          alt=""
          width={st.width}
          height={st.height}
          sizes="120px"
          style={{
            left: `${st.leftPct}cqw`,
            top: `${st.topPct}cqw`,
            width: `${st.widthPct}cqw`,
            rotate: `${st.tiltDeg}deg`,
          }}
        />
      ))}

      {/* round rubber stamp, its words around the ring */}
      <svg className="bk-roundstamp" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="bk-roundstamp-ring" d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0" />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <text className="bk-roundstamp-ring">
          <textPath href="#bk-roundstamp-ring" startOffset="0" textLength="214" lengthAdjust="spacing">
            {`${R.ring} • ${R.ring} •`}
          </textPath>
        </text>
        <text className="bk-roundstamp-center" x="50" y="50" textAnchor="middle" dominantBaseline="central">
          {R.center}
        </text>
      </svg>
    </div>
  );
}
