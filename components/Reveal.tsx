"use client";

import { useEffect, useRef, useState } from "react";

// Fades its children in and slides them up 8px once, when 30% is visible.
// Animates only opacity and transform. The final state is the default, so it shows
// with reduced motion or without JavaScript.
export default function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    setPhase("hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPhase("shown");
        io.disconnect();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        ...(phase === "final"
          ? {}
          : {
              opacity: phase === "hidden" ? 0 : 1,
              transform: phase === "hidden" ? "translateY(8px)" : "translateY(0)",
              transition: phase === "hidden" ? "none" : "opacity 250ms ease, transform 250ms ease",
            }),
      }}
    >
      {children}
    </div>
  );
}
