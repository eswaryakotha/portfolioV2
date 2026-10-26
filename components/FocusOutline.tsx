"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Decorative hand-drawn rectangle around the visible elements matching `selector`
// inside the parent (which must be position: relative). Elements that are hidden
// (display: none, zero size) are ignored, so one outline can serve two layouts.
export default function FocusOutline({
  selector,
  inset = 8,
}: {
  selector: string;
  inset?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [d, setD] = useState<string | null>(null);

  const measure = useCallback(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const o = parent.getBoundingClientRect();
    const rects = [...parent.querySelectorAll<HTMLElement>(selector)]
      .map((e) => e.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);
    if (rects.length === 0) {
      setD(null);
      return;
    }
    const l = Math.min(...rects.map((r) => r.left)) - o.left - inset;
    const t = Math.min(...rects.map((r) => r.top)) - o.top - inset;
    const r = Math.max(...rects.map((x) => x.right)) - o.left + inset;
    const b = Math.max(...rects.map((x) => x.bottom)) - o.top + inset;
    const w = r - l;
    const h = b - t;
    // one loose pen stroke: slightly bowed sides, uneven corners, overshoot at the close
    setD(
      `M ${l + 6} ${t + 1} ` +
        `C ${l + w * 0.3} ${t - 2}, ${l + w * 0.7} ${t + 2}, ${r - 3} ${t} ` +
        `C ${r + 2} ${t + h * 0.3}, ${r - 2} ${t + h * 0.7}, ${r} ${b - 2} ` +
        `C ${l + w * 0.7} ${b + 2}, ${l + w * 0.3} ${b - 2}, ${l + 2} ${b} ` +
        `C ${l - 2} ${t + h * 0.7}, ${l + 2} ${t + h * 0.3}, ${l + 1} ${t - 6}`
    );
  }, [selector, inset]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {d && (
        <path
          d={d}
          fill="none"
          stroke="var(--accent-bright, var(--accent))"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
