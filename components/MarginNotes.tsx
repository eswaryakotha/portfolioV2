"use client";

// Handwritten notes in the side margins of a media frame, each with a small curved
// arrow pointing into the frame. Shared by the VeraAI pilot clips and the MetaMint
// phone video. Wide screens only (the margins are needed); decoration, so hidden
// from assistive tech. Positions are % of the frame, measured in px by the caller.

const BRIGHT = "var(--accent-bright, var(--accent))";

export type MarginNote = {
  text: string;
  side: "left" | "right"; // which margin the note sits in
  target: [number, number]; // [x, y] as % of the frame the arrow points at
  labelY: number; // y as % of the frame where the note starts
  reach?: number; // px: stop the arrow this far from its start, heading toward the target (a short arrow)
};

export default function MarginNotes({ notes, size }: { notes: MarginNote[]; size: { w: number; h: number } }) {
  return (
    <div aria-hidden="true" className="hidden min-[1360px]:block" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {notes.map((n) => {
              const { w, h } = size;
              const right = n.side === "right";
              const sx = right ? w + 10 : -10;
              const sy = (n.labelY / 100) * h;
              let ex = (n.target[0] / 100) * w + (right ? 5 : -5);
              let ey = (n.target[1] / 100) * h;
              const dist = Math.hypot(ex - sx, ey - sy);
              if (n.reach && n.reach < dist) {
                ex = sx + ((ex - sx) * n.reach) / dist;
                ey = sy + ((ey - sy) * n.reach) / dist;
              }
              const cx = (sx + ex) / 2;
              const cy = sy;
              // open arrowhead, oriented along the end of the curve
              const ang = Math.atan2(ey - cy, ex - cx);
              const arm = (d: number) => `${ex - 8 * Math.cos(ang + d)} ${ey - 8 * Math.sin(ang + d)}`;
              return (
                <div key={n.text}>
                  <span
                    style={{
                      position: "absolute",
                      top: sy - 14,
                      ...(right ? { left: w + 16, textAlign: "left" } : { left: -16, transform: "translateX(-100%)", textAlign: "right" }),
                      width: 150,
                      color: BRIGHT,
                      fontFamily: "var(--font-caveat), cursive",
                      fontSize: 19,
                      lineHeight: 1.1,
                    }}
                  >
                    {n.text}
                  </span>
                  <svg
                    width={w}
                    height={h}
                    focusable="false"
                    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
                  >
                    <g fill="none" stroke={BRIGHT} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={`M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`} />
                      <path d={`M ${arm(0.5)} L ${ex} ${ey} L ${arm(-0.5)}`} />
                    </g>
                  </svg>
                </div>
              );
            })}
          </div>
  );
}
