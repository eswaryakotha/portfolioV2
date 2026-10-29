"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { FailureDecisionCase, FailureDecisionSection } from "@/data/content";

// One failure, one decision: a card per case with the failure, the decision and the
// product implication. Each card animates once when 30% of it is visible (opacity,
// transform, stroke-dashoffset). The final state is the default, so it shows with
// reduced motion or without JavaScript.

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

type Phase = "final" | "hidden" | "shown";

const pct = (c: { correct: number; total: number }) => (c.correct / c.total) * 100;

function useOnceVisible(ref: React.RefObject<HTMLElement | null>): Phase {
  const [phase, setPhase] = useState<Phase>("final");
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    setPhase("hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (e.intersectionRatio < 0.3 && e.intersectionRect.height < window.innerHeight * 0.5) return;
        setPhase("shown");
        io.disconnect();
      },
      { threshold: [0, 0.3] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return phase;
}

// ── visuals ─────────────────────────────────────────────────────

function Runs({ visual, phase, at }: { visual: Extract<FailureDecisionCase["visual"], { kind: "runs" }>; phase: Phase; at: number }) {
  if (process.env.NODE_ENV !== "production") {
    for (const r of visual.rows)
      if (`${pct(r.counts).toFixed(1)}%` !== r.expectedPercent)
        console.error(`FailureDecision: ${r.counts.correct}/${r.counts.total} is ${pct(r.counts).toFixed(1)}%, but the data says ${r.expectedPercent}`);
  }
  const bar = (i: number): React.CSSProperties => ({
    transformOrigin: "left center",
    ...(phase === "hidden" ? { transform: "scaleX(0)" } : phase === "shown" ? { transform: "scaleX(1)", transition: `transform 700ms ease-out ${at + i * 100}ms` } : {}),
  });
  return (
    <div style={{ marginTop: 16 }}>
      <span style={srOnly}>{visual.srText}</span>
      <ul aria-hidden="true" className="list-none p-0 m-0 flex flex-col" style={{ gap: 10 }}>
        {visual.rows.map((r, i) => (
          <li key={r.label}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.3, color: "#6B7280" }}>{r.label}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ flex: 1, height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${pct(r.counts)}%`, background: r.highlight ? ACCENT : "#9CA3AF", ...bar(i) }} />
              </span>
              <span className="font-mono" style={{ fontSize: 11, color: "#4B5563", whiteSpace: "nowrap" }}>
                {pct(r.counts).toFixed(1)}% ({r.counts.correct}/{r.counts.total})
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bubble({ visual, phase, at }: { visual: Extract<FailureDecisionCase["visual"], { kind: "bubble" }>; phase: Phase; at: number }) {
  const curve: React.CSSProperties =
    phase === "hidden" ? { strokeDashoffset: 1 } : phase === "shown" ? { strokeDashoffset: 0, transition: `stroke-dashoffset 500ms ease-in-out ${at}ms` } : { strokeDashoffset: 0 };
  const fade = (delay: number): React.CSSProperties =>
    phase === "hidden" ? { opacity: 0 } : phase === "shown" ? { opacity: 1, transition: `opacity 250ms ease ${delay}ms` } : {};
  const TAG_H = 28;
  const GAP = 8;
  const FROM = 34; // space between the bubble and the first tag
  return (
    <div aria-hidden="true" style={{ marginTop: 16 }}>
      <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", background: "color-mix(in srgb, var(--accent) 15%, white)", borderRadius: 14, padding: "10px 14px" }}>
        <span style={{ position: "absolute", left: -8, top: 12, width: 10, height: 14, background: "color-mix(in srgb, var(--accent) 15%, white)", clipPath: "polygon(100% 0, 100% 100%, 0 45%)" }} />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4, color: "#374151" }}>{visual.text}</p>
      </div>
      <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: GAP, marginTop: FROM, marginLeft: 32 }}>
        {visual.tags.map((t, i) => {
          const drop = FROM + i * (TAG_H + GAP) + TAG_H / 2; // from the bubble's bottom to this tag's middle
          return (
            <li key={t} style={{ position: "relative", height: TAG_H }}>
              <svg width="32" height={drop} viewBox={`0 0 32 ${drop}`} fill="none" style={{ position: "absolute", left: -32, top: TAG_H / 2 - drop, overflow: "visible" }}>
                <path
                  d={`M 6,0 C 6,${drop * 0.7} 14,${drop} 32,${drop}`}
                  stroke="#9CA3AF"
                  strokeWidth="1"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  style={curve}
                />
              </svg>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 6, height: TAG_H, boxSizing: "border-box", padding: "0 10px", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: 12, color: "#6B7280", whiteSpace: "nowrap", ...fade(at + 300 + i * 120) }}
              >
                <Icon name={visual.tagIcon} size={14} color="#6B7280" />
                {t}
              </span>
            </li>
          );
        })}
      </ul>
      {visual.note.show && (
        <p style={{ margin: "12px 0 0", textAlign: "right", fontFamily: "var(--font-caveat), cursive", fontSize: 17, lineHeight: 1, color: BRIGHT, transform: "rotate(-2deg)", transformOrigin: "right center", ...fade(at + 600) }}>
          {visual.note.text}
        </p>
      )}
    </div>
  );
}

// ── card ────────────────────────────────────────────────────────

function Case({ c }: { c: FailureDecisionCase }) {
  const ref = useRef<HTMLLIElement>(null);
  const phase = useOnceVisible(ref);
  const PART_AT = 250; // parts start after the card has faded in
  const PART_STEP = 120;
  const VISUAL_AT = PART_AT + 3 * PART_STEP;

  const fx = (delay: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : { opacity: 1, transform: "none", transition: `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms` };

  return (
    <li ref={ref} style={{ border: "1px solid #E5E7EB", background: "#fff", borderRadius: 8, padding: 24, boxSizing: "border-box", ...fx(0) }}>
      <span className="font-mono" style={{ display: "inline-block", fontSize: 11, lineHeight: 1.4, color: ACCENT, border: `1px solid ${BRIGHT}`, borderRadius: 4, padding: "3px 8px" }}>
        {c.tag}
      </span>
      <h4 style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.3, fontWeight: 700, color: "#1F2937" }}>{c.title}</h4>

      <ul className="grid grid-cols-1 min-[900px]:grid-cols-3 list-none p-0 m-0" style={{ gap: 24, marginTop: 20 }}>
        {c.parts.map((p, i) => (
          <li key={p.label} className="relative" style={fx(PART_AT + i * PART_STEP)}>
            <Icon name={p.icon} size={24} color={BRIGHT} />
            <h5 className="font-mono uppercase text-gray-500" style={{ margin: "12px 0 0", fontSize: 11, letterSpacing: "0.08em", fontWeight: 400 }}>
              {p.label}
            </h5>
            <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5, color: "#374151" }}>{p.text}</p>
            {i === 0 && (c.visual.kind === "runs" ? <Runs visual={c.visual} phase={phase} at={VISUAL_AT} /> : <Bubble visual={c.visual} phase={phase} at={VISUAL_AT} />)}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function FailureDecision({ section }: { section: FailureDecisionSection }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{section.subLabel}</p>
      <ol className="list-none p-0 m-0 flex flex-col" style={{ gap: 32 }}>
        {section.cases.map((c) => (
          <Case key={c.title} c={c} />
        ))}
      </ol>
    </div>
  );
}
