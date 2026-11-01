"use client";

import { useEffect, useRef, useState } from "react";

// A short clip that plays automatically, muted and on a loop, only while it is on
// screen. With reduced motion it does not autoplay and shows the player controls.
// Optional handwritten notes sit in the side margins with a small curved arrow
// pointing at something in the clip (wide screens only; the clip's own text already
// says the same thing, so the notes are decoration).

const BRIGHT = "var(--accent-bright, var(--accent))";

export type ClipNote = {
  text: string;
  side: "left" | "right"; // which margin the note sits in
  target: [number, number]; // [x, y] as % of the clip frame the arrow points at
  labelY: number; // y as % of the clip frame where the note starts
  reach?: number; // px: stop the arrow this far from its start, heading toward the target (a short arrow)
};

export default function LoopClip({
  src,
  poster,
  label,
  crop,
  notes,
}: {
  src: string;
  poster?: string;
  label: string; // accessible label
  crop?: { width: number; height: number; top: number; bottom?: number }; // blank rows to trim from the top and bottom
  notes?: ClipNote[];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    if (rm || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !notes || notes.length === 0) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [notes]);

  const cropTop = crop && (crop.top > 0 || (crop.bottom ?? 0) > 0) ? crop : undefined;

  return (
    <div ref={wrap} style={{ position: "relative" }}>
      <div
        className="w-full"
        style={{
          background: "#000",
          borderRadius: 4,
          overflow: "hidden",
          aspectRatio: cropTop ? `${cropTop.width} / ${cropTop.height - cropTop.top - (cropTop.bottom ?? 0)}` : "16 / 9",
        }}
      >
        <video
          ref={ref}
          src={src}
          poster={poster || undefined}
          aria-label={label}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          controls={reduced}
          preload="metadata"
          style={
            cropTop
              ? { width: "100%", height: "auto", display: "block", marginTop: `${-(cropTop.top / cropTop.width) * 100}%` }
              : { width: "100%", height: "100%", display: "block" }
          }
        />
      </div>

      {size && notes && notes.length > 0 && (
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
      )}
    </div>
  );
}
