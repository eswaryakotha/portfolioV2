"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { EvalsShapedSection, LimitsNextSection } from "@/data/content";

// Last two evaluation sub-sections: how the evals shaped the product (four rows with
// a finding and a decision) and the limits and next steps (two cards). Each block
// fades its cards in once, 80ms apart, when 30% is visible (opacity and transform
// only). The final state is the default, so it shows with reduced motion or without
// JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconFor = (name: string): React.ComponentType<any> | null => (LucideIcons as any)[name] ?? null;

function Icon({ name, size, color, strokeWidth = 1.5 }: { name: string; size: number; color: string; strokeWidth?: number }) {
  const Comp = iconFor(name);
  return Comp ? <Comp aria-hidden="true" size={size} strokeWidth={strokeWidth} color={color} style={{ display: "block", flexShrink: 0 }} /> : null;
}

function useReveal() {
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
  const fx = (i: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : { opacity: 1, transform: "none", transition: `opacity 250ms ease ${i * 80}ms, transform 250ms ease ${i * 80}ms` };
  return { ref, fx };
}

const CARD: React.CSSProperties = { border: "1px solid #E5E7EB", background: "#fff", borderRadius: 8, boxSizing: "border-box" };
const BODY: React.CSSProperties = { margin: 0, fontSize: 14, lineHeight: 1.5, color: "#374151" };

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono uppercase text-gray-500" style={{ margin: 0, fontSize: 11, letterSpacing: "0.08em" }}>
      {children}
    </p>
  );
}

export function EvalsShaped({ section }: { section: EvalsShapedSection }) {
  const { ref, fx } = useReveal();
  return (
    <div ref={ref}>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{section.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
        {section.intro}
      </p>
      <ol className="list-none p-0 m-0 flex flex-col" style={{ gap: 16, marginTop: 16 }}>
        {section.rows.map((r, i) => (
          <li
            key={r.title}
            className="grid grid-cols-1 min-[900px]:grid-cols-[190px_1fr_24px_1fr] items-start"
            style={{ ...CARD, padding: 20, gap: 12, columnGap: 20, ...fx(i) }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name={r.icon} size={24} color={BRIGHT} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: "#1F2937" }}>{r.title}</p>
            </div>
            <div>
              <Label>{section.findingLabel}</Label>
              <p style={{ ...BODY, marginTop: 4 }}>{r.finding}</p>
            </div>
            <div aria-hidden="true" className="flex min-[900px]:justify-center" style={{ paddingTop: 2 }}>
              <svg className="hidden min-[900px]:block" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="#9CA3AF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 14 }}>
                <path d="M 2,6 H 16 M 12,2 L 16.5,6 L 12,10" />
              </svg>
              <svg className="block min-[900px]:hidden" width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#9CA3AF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 6,2 V 16 M 2,12 L 6,16.5 L 10,12" />
              </svg>
            </div>
            <div>
              <Label>{section.decisionLabel}</Label>
              <p style={{ ...BODY, marginTop: 4 }}>{r.decision}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LimitsNext({ section }: { section: LimitsNextSection }) {
  const { ref, fx } = useReveal();
  return (
    <div ref={ref}>
      <style>{`.lim-ol li::marker { color: ${BRIGHT}; }`}</style>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{section.subLabel}</p>
      <div className="grid grid-cols-1 min-[800px]:grid-cols-2" style={{ gap: 16 }}>
        <div style={{ ...CARD, padding: 24, ...fx(0) }}>
          <Label>{section.limits.label}</Label>
          <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: 12, marginTop: 12 }}>
            {section.limits.items.map((t) => (
              <li key={t} style={{ ...BODY, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ marginTop: 3 }}>
                  <Icon name={section.limits.icon} size={16} color="#9CA3AF" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{ ...CARD, padding: 24, border: `1px solid ${BRIGHT}`, background: "color-mix(in srgb, var(--accent) 6%, white)", ...fx(1) }}
        >
          <Label>{section.next.label}</Label>
          <ol className="lim-ol m-0 flex flex-col" style={{ gap: 12, marginTop: 12, paddingLeft: 20, listStyle: "decimal" }}>
            {section.next.items.map((t) => (
              <li key={t} style={BODY}>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: "16px 0 0", ...fx(2) }}>
        {section.closing}
      </p>
    </div>
  );
}
