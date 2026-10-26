"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { LabeledResult, StatTile } from "@/data/content";

// Numbered, verb-labeled Results with optional stat tiles. Each tile's percentage
// and bar width come from its counts; in dev the shown label is checked against them.
// Bars scale in from the left once, when 30% is visible (transform only). The final
// state is the default, so it shows with reduced motion or without JavaScript.

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function pct(t: StatTile) {
  return (t.correct / t.total) * 100;
}

function shown(t: StatTile) {
  return pct(t).toFixed(t.decimals);
}

export default function ResultsLabeled({ items }: { items: LabeledResult[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  if (process.env.NODE_ENV !== "production") {
    for (const it of items)
      for (const t of it.stats ?? [])
        if (`${shown(t)}%` !== t.percentLabel)
          console.error(`ResultsLabeled: ${t.correct}/${t.total} is ${shown(t)}%, but the data says ${t.percentLabel}`);
  }

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
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

  const barStyle: React.CSSProperties = {
    transformOrigin: "left center",
    ...(phase === "hidden"
      ? { transform: "scaleX(0)" }
      : phase === "shown"
      ? { transform: "scaleX(1)", transition: "transform 700ms ease-out" }
      : {}),
  };

  return (
    <ol ref={ref} className="flex flex-col list-none p-0 m-0" style={{ gap: 20 }}>
      {items.map((it, i) => (
        <li key={it.title} className="flex gap-3 text-sm">
          <span className="font-mono text-xs text-gray-400 shrink-0 mt-0.5 w-6">{String(i + 1).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1">
            <p className="font-mono uppercase" style={{ margin: 0, fontSize: 11, letterSpacing: "0.06em", color: "var(--accent)" }}>
              {it.verb}
            </p>
            <p className="font-semibold text-gray-900" style={{ margin: "2px 0 0" }}>
              {it.title}
            </p>
            {it.text && <p className="text-gray-700 leading-relaxed" style={{ margin: "4px 0 0" }}>{it.text}</p>}
            {it.stats && (
              <ul className="grid grid-cols-1 min-[640px]:grid-cols-2 list-none p-0" style={{ gap: 12, margin: "8px 0 0" }}>
                {it.stats.map((t) => (
                  <li key={t.percentLabel} style={{ border: "1px solid #E5E7EB", borderRadius: 4, padding: 16 }}>
                    <span style={{ display: "block", fontSize: 32, lineHeight: 1.1, fontWeight: 600, color: "var(--accent)" }}>
                      {shown(t)}%
                    </span>
                    <span
                      aria-hidden="true"
                      style={{ display: "block", height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden", margin: "8px 0 10px" }}
                    >
                      <span style={{ display: "block", height: "100%", width: `${Number(shown(t))}%`, background: "var(--accent)", ...barStyle }} />
                    </span>
                    <span className="text-gray-700 leading-relaxed" style={{ display: "block" }}>
                      {t.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
