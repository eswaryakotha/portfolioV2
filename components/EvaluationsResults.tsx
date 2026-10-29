"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import FailureDecision from "@/components/FailureDecision";
import { EvalsShaped, LimitsNext } from "@/components/EvalsWrapUp";
import type { AiReliabilitySection, EvaluationsData } from "@/data/content";

// Evaluations and results: a list of sub-sections (so more parts can be added). The
// AI reliability sub-section shows result cards whose percentage and bar width come
// from stored counts; in dev, a percentage that does not match its counts is logged.
// Bars scale in from the left once, when 30% is visible (transform only). The final
// state is the default, so it shows with reduced motion or without JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const ACCENT = "var(--accent)";
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconFor = (name: string): React.ComponentType<any> | null => (LucideIcons as any)[name] ?? null;

function Icon({ name, size, color }: { name: string; size: number; color: string }) {
  const Comp = iconFor(name);
  return Comp ? <Comp aria-hidden="true" size={size} strokeWidth={1.5} color={color} style={{ display: "block", flexShrink: 0 }} /> : null;
}

const srOnly: React.CSSProperties = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 };

type Section = AiReliabilitySection;

function AiReliability({ section }: { section: Section }) {
  const ref = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  const pct = (c: { correct: number; total: number }) => (c.correct / c.total) * 100;

  if (process.env.NODE_ENV !== "production") {
    for (const card of section.cards)
      if (card.counts && `${pct(card.counts).toFixed(1)}%` !== card.expectedPercent)
        console.error(`EvaluationsResults: ${card.counts.correct}/${card.counts.total} is ${pct(card.counts).toFixed(1)}%, but the data says ${card.expectedPercent}`);
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
      { threshold: [0, 0.3] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const barStyle: React.CSSProperties = {
    transformOrigin: "left center",
    ...(phase === "hidden" ? { transform: "scaleX(0)" } : phase === "shown" ? { transform: "scaleX(1)", transition: "transform 700ms ease-out" } : {}),
  };

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{section.subLabel}</p>
      <div style={{ maxWidth: 720 }}>
        {section.intro.map((t, i) => (
          <p key={i} className="text-sm text-gray-800 leading-relaxed" style={{ margin: i === 0 ? 0 : "16px 0 0" }}>
            {t}
          </p>
        ))}
      </div>

      <ul ref={ref} className="grid grid-cols-1 min-[900px]:grid-cols-3 list-none p-0 m-0" style={{ gap: 16, marginTop: 32 }}>
        {section.cards.map((c) => {
          const scored = !!c.counts;
          return (
            <li
              key={c.label}
              style={{ position: "relative", border: scored ? "1px solid #E5E7EB" : "1px dashed #9CA3AF", background: "#fff", borderRadius: 8, padding: 24, boxSizing: "border-box" }}
            >
              {c.pill && (
                <span className="font-mono text-gray-500" style={{ position: "absolute", top: 16, right: 16, fontSize: 11, lineHeight: 1, border: "1px solid #D1D5DB", borderRadius: 999, padding: "4px 8px" }}>
                  {c.pill}
                </span>
              )}
              <Icon name={c.icon} size={32} color={BRIGHT} />
              <p className="font-mono uppercase text-gray-500" style={{ margin: "12px 0 0", fontSize: 12, letterSpacing: "0.08em" }}>
                {c.label}
              </p>
              {scored && c.counts ? (
                <>
                  <p style={{ margin: "8px 0 0", fontSize: 28, lineHeight: 1.1, fontWeight: 700, color: ACCENT }}>{pct(c.counts).toFixed(1)}%</p>
                  <p className="text-sm text-gray-800" style={{ margin: "8px 0 0", lineHeight: 1.5 }}>
                    {c.counts.correct} of {c.counts.total} {c.unit}
                  </p>
                  <span aria-hidden="true" style={{ display: "block", height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden", margin: "12px 0" }}>
                    <span style={{ display: "block", height: "100%", width: `${pct(c.counts)}%`, background: ACCENT, ...barStyle }} />
                  </span>
                  <span style={srOnly}>
                    {c.counts.correct} of {c.counts.total} {c.unit} correct
                  </span>
                  {c.note && (
                    <p className="text-gray-500" style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>
                      {c.note}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.2, fontWeight: 700, color: "#374151" }}>{c.bigText}</p>
                  {c.countText && (
                    <p className="text-sm text-gray-800" style={{ margin: "8px 0 0", lineHeight: 1.5 }}>
                      {c.countText}
                    </p>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-gray-500" style={{ display: "flex", alignItems: "flex-start", gap: 8, maxWidth: 720, margin: "24px 0 0", fontSize: 12, lineHeight: 1.5 }}>
        <Icon name="Info" size={16} color="#6B7280" />
        {section.scopeNote}
      </p>
    </div>
  );
}

export default function EvaluationsResults({ data }: { data: EvaluationsData }) {
  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">{data.heading}</h2>
      <div className="flex flex-col gap-10">
        {data.subSections.map((s) =>
          s.kind === "aiReliability" ? (
            <AiReliability key={s.subLabel} section={s} />
          ) : s.kind === "failureDecision" ? (
            <FailureDecision key={s.subLabel} section={s} />
          ) : s.kind === "evalsShaped" ? (
            <EvalsShaped key={s.subLabel} section={s} />
          ) : (
            <LimitsNext key={s.subLabel} section={s} />
          )
        )}
      </div>
    </section>
  );
}
