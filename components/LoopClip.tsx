"use client";

import { useEffect, useRef, useState } from "react";
import MarginNotes, { type MarginNote } from "@/components/MarginNotes";

// A short clip that plays automatically, muted and on a loop, only while it is on
// screen. With reduced motion it does not autoplay and shows the player controls.
// Optional handwritten notes sit in the side margins with a small curved arrow
// pointing at something in the clip (wide screens only; the clip's own text already
// says the same thing, so the notes are decoration).


export default function LoopClip({
  src,
  poster,
  label,
  crop,
  notes,
  restartOnEnter,
}: {
  src: string;
  poster?: string;
  label: string; // accessible label
  crop?: { width: number; height: number; top: number; bottom?: number }; // blank rows to trim from the top and bottom
  notes?: MarginNote[];
  restartOnEnter?: boolean; // start again from the beginning each time it scrolls back into view
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
        if (e.isIntersecting) {
          if (restartOnEnter) v.currentTime = 0;
          v.play().catch(() => {});
        }
        else v.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [restartOnEnter]);

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

      {size && notes && notes.length > 0 && <MarginNotes notes={notes} size={size} />}
    </div>
  );
}
