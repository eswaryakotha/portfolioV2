"use client";

import { useEffect, useRef, useState } from "react";

// Decorative margin arrow from the Solution box to the note under the Results
// box. It finds its anchors inside the parent wrapper via data-sg attributes
// and re-measures on resize, so it stays attached when the layout changes.
// The note's fade-in is driven by data-note-state on the wrapper (see the
// <style> in SummaryGrid); with no JS or reduced motion the final state shows.

type Geometry = { path: string; head: string; box: { w: number; h: number } };

const DRAW_MS = 1000;

export default function NoteArrow() {
  const anchor = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [drawn, setDrawn] = useState(true); // final state by default

  useEffect(() => {
    const wrap = anchor.current?.parentElement;
    if (!wrap) return;

    const measure = () => {
      const q = (k: string) => wrap.querySelector<HTMLElement>(`[data-sg="${k}"]`);
      const solution = q("solution");
      const phrase = q("phrase");
      const note = q("note");
      if (!solution || !phrase || !note) return;
      const w = wrap.getBoundingClientRect();
      const s = solution.getBoundingClientRect();
      const p = phrase.getBoundingClientRect();
      const n = note.getBoundingClientRect();

      const sx = s.left - w.left - 4; // just outside the box border
      const sy = p.top - w.top + p.height / 2; // level with the phrase's line
      const ex = n.left - w.left + 6;
      const ey = n.top - w.top - 10; // just above the note's top left
      const bow = -60;
      const c1 = [bow - 10, sy + 24];
      const c2 = [bow + 10, ey - 36];
      const path = `M ${sx} ${sy} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${ex} ${ey}`;

      // open arrowhead (8px) from the end tangent
      const ang = Math.atan2(ey - c2[1], ex - c2[0]);
      const arm = (a: number) =>
        `${ex - 8 * Math.cos(ang + a)} ${ey - 8 * Math.sin(ang + a)}`;
      const spread = 0.5;
      const head = `M ${arm(spread)} L ${ex} ${ey} L ${arm(-spread)}`;
      setGeo({ path, head, box: { w: w.width, h: w.height } });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    if (!reduce && "IntersectionObserver" in window) {
      setDrawn(false);
      wrap.dataset.noteState = "hidden";
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          setDrawn(true);
          wrap.dataset.noteState = "shown";
          io?.disconnect();
        },
        { threshold: 0.3 }
      );
      io.observe(wrap);
    }
    return () => {
      ro.disconnect();
      io?.disconnect();
    };
  }, []);

  return (
    <svg
      ref={anchor}
      aria-hidden="true"
      focusable="false"
      className="nk-long"
      width={geo?.box.w ?? 0}
      height={geo?.box.h ?? 0}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {geo && (
        <g
          fill="none"
          stroke="var(--accent-bright, var(--accent))"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d={geo.path}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            style={{ transition: `stroke-dashoffset ${DRAW_MS}ms ease-in-out` }}
          />
          <path
            d={geo.head}
            style={{
              opacity: drawn ? 1 : 0,
              transition: `opacity 150ms ease ${drawn ? DRAW_MS - 100 : 0}ms`,
            }}
          />
        </g>
      )}
    </svg>
  );
}
