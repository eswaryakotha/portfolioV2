"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import DecorativeQuote from "@/components/DecorativeQuote";
import type { KeyDecisionData } from "@/data/content";

// One key engineering decision: headline in the decorative quote, the challenge, the
// decision with a two-lane visual (AI interprets, code calculates) and a hand-off
// arrow, and a "why it works" callout. Animates once when 30% is visible (opacity,
// transform, stroke-dashoffset). The final state is the default, so it shows with
// reduced motion or without JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const LINE = "#3A3A3A"; // --board-line
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconFor = (name: string): React.ComponentType<any> | null => (LucideIcons as any)[name] ?? null;

function Icon({ name, size, color }: { name: string; size: number; color: string }) {
  const Comp = iconFor(name);
  return Comp ? <Comp aria-hidden="true" size={size} strokeWidth={1.5} color={color} style={{ display: "block", flexShrink: 0 }} /> : null;
}

const srOnly: React.CSSProperties = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 };

function Label({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "h4" }) {
  return (
    <Tag className="font-mono uppercase text-gray-500" style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", fontWeight: 400 }}>
      {children}
    </Tag>
  );
}

type Lane = KeyDecisionData["decision"]["lanes"]["ai"];

function LaneCard({ lane, look, iconColor, style }: { lane: Lane; look: React.CSSProperties; iconColor: string; style: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 4, padding: 24, boxSizing: "border-box", ...look, ...style }}>
      <Icon name={lane.icon} size={32} color={iconColor} />
      <div style={{ marginTop: 12 }}>
        <Label>{lane.label}</Label>
      </div>
      <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.5, color: "#6B7280" }}>{lane.subtitle}</p>
      <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: 12, marginTop: 16 }}>
        {lane.rows.map((r) => (
          <li key={r.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, lineHeight: 1.5, color: "#374151" }}>
            <Icon name={r.icon} size={20} color={iconColor} />
            {r.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function KeyDecision({ data }: { data: KeyDecisionData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

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
  }, []);

  // lanes: left at 0, right 120ms later; the arrow draws after; chips pop in after the arrow
  const ARROW_AT = 120 + 250;
  const CHIPS_AT = ARROW_AT + 500;
  const lane = (delay: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : { opacity: 1, transform: "none", transition: `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms` };
  const draw: React.CSSProperties =
    phase === "hidden" ? { strokeDashoffset: 1 } : phase === "shown" ? { strokeDashoffset: 0, transition: `stroke-dashoffset 500ms ease-in-out ${ARROW_AT}ms` } : { strokeDashoffset: 0 };
  const noteFx: React.CSSProperties =
    phase === "hidden" ? { opacity: 0 } : phase === "shown" ? { opacity: 1, transition: `opacity 250ms ease ${ARROW_AT}ms` } : {};
  const chip = (i: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "scale(0.9)" }
      : { opacity: 1, transform: "none", transition: `opacity 200ms ease ${CHIPS_AT + i * 120}ms, transform 200ms ease ${CHIPS_AT + i * 120}ms` };

  const { decision, why } = data;
  const arrowProps = { fill: "none", stroke: BRIGHT, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1, strokeDasharray: 1, style: draw } as const;

  return (
    <div ref={ref}>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>

      <div style={{ marginTop: 4 }}>
        <DecorativeQuote text={data.headline} fontSize={22} />
      </div>

      {/* the challenge */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name={data.challenge.icon} size={24} color={BRIGHT} />
          <Label as="h4">{data.challenge.label}</Label>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed" style={{ maxWidth: 720, margin: "8px 0 0" }}>
          {data.challenge.text}
        </p>
      </div>

      {/* the decision */}
      <div style={{ marginTop: 32 }}>
        <Label as="h4">{decision.label}</Label>
        <p className="text-sm text-gray-800 leading-relaxed" style={{ maxWidth: 720, margin: "8px 0 0" }}>
          {decision.text}
        </p>

        <span style={srOnly}>{decision.srText}</span>
        <div className="grid grid-cols-1 min-[800px]:grid-cols-[1fr_136px_1fr] items-stretch" style={{ marginTop: 32 }}>
          <LaneCard
            lane={decision.lanes.ai}
            look={{ border: `1.5px solid ${BRIGHT}`, background: "color-mix(in srgb, var(--accent-bright, var(--accent)) 10%, white)" }}
            iconColor={BRIGHT}
            style={lane(0)}
          />

          {/* hand-off: right arrow between the lanes, down arrow when stacked */}
          <div aria-hidden="true" className="flex flex-col items-center justify-center" style={{ padding: "8px 0", minHeight: 72 }}>
            {decision.handoff.showNote && (
              <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 17, lineHeight: 1, color: BRIGHT, whiteSpace: "nowrap", marginBottom: 4, ...noteFx }}>
                {decision.handoff.note}
              </span>
            )}
            <svg className="hidden min-[800px]:block" width="72" height="28" viewBox="0 0 72 28" focusable="false">
              <path d="M 3,20 Q 34,2 66,14" {...arrowProps} />
              <path d="M 58,6 L 67,14 L 57,20" {...arrowProps} />
            </svg>
            <svg className="block min-[800px]:hidden" width="28" height="48" viewBox="0 0 28 48" focusable="false">
              <path d="M 12,3 Q 24,22 14,42" {...arrowProps} />
              <path d="M 6,34 L 14,43 L 21,33" {...arrowProps} />
            </svg>
          </div>

          <LaneCard
            lane={decision.lanes.code}
            look={{ border: `1px solid ${LINE}`, background: "#fff" }}
            iconColor={LINE}
            style={lane(120)}
          />
        </div>
      </div>

      {/* why it works */}
      <div style={{ marginTop: 40, background: "#F3F4F6", borderLeft: `3px solid ${BRIGHT}`, padding: 20 }}>
        <Label>{why.label}</Label>
        <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: "8px 0 0" }}>
          {why.text}
        </p>
        {why.showChips && (
          <ul className="list-none p-0 m-0 flex flex-wrap" style={{ gap: 8, marginTop: 16 }}>
            {why.chips.map((c, i) => (
              <li
                key={c}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${BRIGHT}`, borderRadius: 4, padding: "4px 10px", fontSize: 14, lineHeight: 1.4, color: "#374151", ...chip(i) }}
              >
                <Icon name="Check" size={14} color={BRIGHT} />
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
