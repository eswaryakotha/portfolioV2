"use client";

import { useEffect, useRef, useState } from "react";
import MarginNotes, { type MarginNote } from "@/components/MarginNotes";

// A phone-shaped frame (dark bezel, rounded screen, side buttons) around a portrait
// video that plays automatically, muted and on a loop, only while it is on screen.
// With reduced motion it does not autoplay and shows the player controls. The
// recording already carries its own status bar and notch, so the frame adds none.

export default function PhoneVideo({
  src,
  poster,
  label,
  ratio = [800, 1646],
  notes,
}: {
  src: string;
  poster?: string;
  label: string; // accessible label
  ratio?: [number, number]; // video width and height
  notes?: MarginNote[]; // handwritten margin notes with an arrow into the phone (wide screens only)
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

  const button = (top: number, height: number, side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top,
    height,
    width: 3,
    [side]: -2,
    background: "#2a2a2d",
    borderRadius: side === "left" ? "2px 0 0 2px" : "0 2px 2px 0",
  });

  return (
    <div ref={wrap} style={{ width: "min(300px, 72vw)", margin: "18px auto 0", position: "relative" }}>
      {/* side buttons */}
      <span aria-hidden="true" style={button(72, 26, "left")} />
      <span aria-hidden="true" style={button(116, 46, "left")} />
      <span aria-hidden="true" style={button(172, 46, "left")} />
      <span aria-hidden="true" style={button(130, 70, "right")} />
      <div
        style={{
          background: "linear-gradient(145deg, #1c1c1f, #060607)",
          borderRadius: 46,
          padding: 9,
          boxShadow: "0 0 0 1px #3a3a3e, 0 18px 40px -16px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ borderRadius: 38, overflow: "hidden", background: "#000", aspectRatio: `${ratio[0]} / ${ratio[1]}` }}>
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
            style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
          />
        </div>
      </div>
      {size && notes && notes.length > 0 && <MarginNotes notes={notes} size={size} />}
    </div>
  );
}
