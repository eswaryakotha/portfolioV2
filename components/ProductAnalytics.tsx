"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { ProductAnalyticsData } from "@/data/content";

// Product analytics: rationale, company goal and competitors, who it serves, and how
// success is measured. Each block fades its cards in once, 80ms apart, when 30% is
// visible (opacity and transform only). The final state is the default, so it shows
// with reduced motion or without JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const ACCENT = "var(--accent)";
const TINT = "color-mix(in srgb, var(--accent) 7%, white)";
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Phase = "final" | "hidden" | "shown";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconFor = (name: string): React.ComponentType<any> | null => (LucideIcons as any)[name] ?? null;

function Icon({ name, size, color }: { name: string; size: number; color: string }) {
  const Comp = iconFor(name);
  return Comp ? <Comp aria-hidden="true" size={size} strokeWidth={1.5} color={color} style={{ display: "block", flexShrink: 0 }} /> : null;
}

// a tall block can never show 30% of itself, so a tall one fires once half a screen of it is visible
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
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
  }, []);
  const fx = (i: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : { opacity: 1, transform: "none", transition: `opacity 250ms ease ${i * 80}ms, transform 250ms ease ${i * 80}ms` };
  return { ref, fx };
}

const CARD: React.CSSProperties = { border: "1px solid #E5E7EB", background: "#fff", borderRadius: 4, boxSizing: "border-box" };
const BODY: React.CSSProperties = { margin: 0, fontSize: 13, lineHeight: 1.5, color: "#374151" };

function Label({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "h4" }) {
  return (
    <Tag className="font-mono uppercase text-gray-500" style={{ margin: 0, fontSize: 11, letterSpacing: "0.08em", fontWeight: 400 }}>
      {children}
    </Tag>
  );
}

// "*word*" renders in italic
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>
      )}
    </>
  );
}

const srOnly: React.CSSProperties = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 };

function RationaleAndGoal({ data }: { data: ProductAnalyticsData }) {
  const { ref, fx } = useReveal();
  const { goal, competitors } = data;
  const steps = goal.lifecycle.steps;
  return (
    <div ref={ref}>
      <Label as="h4">{data.rationale.label}</Label>
      <ul className="grid grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4 list-none p-0 m-0" style={{ gap: 16, marginTop: 12 }}>
        {data.rationale.items.map((it, i) => (
          <li key={it.text} style={{ ...CARD, padding: 20, display: "flex", flexDirection: "column", gap: 16, ...fx(i) }}>
            <Icon name={it.icon} size={32} color={BRIGHT} />
            <p style={BODY}>{it.text}</p>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 min-[1100px]:grid-cols-[62fr_38fr]" style={{ gap: 16, marginTop: 16 }}>
        <div style={{ ...CARD, padding: 20, ...fx(4) }}>
          <Label>{goal.label}</Label>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, background: ACCENT, color: "#fff", borderRadius: 4, padding: "5px 10px", fontSize: 14, lineHeight: 1.3 }}
          >
            <Icon name={goal.tag.icon} size={18} color="#fff" />
            {goal.tag.text}
          </span>
          <p style={{ ...BODY, marginTop: 12 }}>
            <Rich text={goal.text} />
          </p>

          <div style={{ marginTop: 20 }}>
            <Label>{goal.lifecycle.label}</Label>
            <ol className="grid grid-cols-2 min-[700px]:grid-cols-4 list-none p-0 m-0" style={{ gap: 12, marginTop: 24 }}>
              {steps.map((step, i) => {
                const on = step === goal.lifecycle.focus;
                return (
                  <li key={step} aria-current={on ? "true" : undefined} style={{ position: "relative" }}>
                    {i > 0 && (
                      <span aria-hidden="true" className="hidden min-[700px]:block" style={{ position: "absolute", right: "100%", top: "50%", width: 12, height: 1, background: "#D1D5DB" }} />
                    )}
                    {on && (
                      <span
                        className="font-mono"
                        style={{ position: "absolute", left: 0, bottom: "100%", marginBottom: 4, fontSize: 11, lineHeight: 1, color: ACCENT, whiteSpace: "nowrap" }}
                      >
                        {goal.lifecycle.focusNote}
                      </span>
                    )}
                    <span
                      style={{
                        display: "block",
                        textAlign: "center",
                        borderRadius: 4,
                        padding: "5px 8px",
                        fontSize: 12,
                        lineHeight: 1.3,
                        ...(on ? { background: ACCENT, color: "#fff", border: `1px solid ${ACCENT}` } : { border: "1px solid #D1D5DB", color: "#6B7280", background: "#fff" }),
                      }}
                    >
                      {on && <span style={srOnly}>{goal.lifecycle.focusSrText} </span>}
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div style={{ ...CARD, padding: 20, ...fx(5) }}>
          <Label>{competitors.label}</Label>
          <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: 12, marginTop: 12 }}>
            {competitors.groups.map((g, gi) => (
              <li key={gi}>
                {g.label && (
                  <p className="font-mono text-gray-500" style={{ margin: "0 0 6px", fontSize: 12 }}>
                    {g.label}
                  </p>
                )}
                <ul className="list-none p-0 m-0 flex flex-wrap" style={{ gap: 8 }}>
                  {g.names.map((n) => (
                    <li key={n} style={{ border: "1px solid #E5E7EB", borderRadius: 4, padding: "3px 8px", fontSize: 12, lineHeight: 1.4, color: "#374151" }}>
                      {n}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function WhoItServes({ data }: { data: ProductAnalyticsData["users"] }) {
  const { ref, fx } = useReveal();
  return (
    <div ref={ref}>
      <Label as="h4">{data.label}</Label>
      <div className="grid grid-cols-1 min-[900px]:grid-cols-2" style={{ gap: 16, marginTop: 12 }}>
        {data.items.map((u, ui) => (
          <div key={u.label} style={{ ...CARD, padding: 24, ...fx(ui) }}>
            <Label>{u.label}</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <Icon name={u.icon} size={32} color={BRIGHT} />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "#1F2937" }}>{u.title}</p>
            </div>

            <div style={{ marginTop: 20 }}>
              <Label>{data.jobLabel}</Label>
              {u.job.length === 1 ? (
                <p style={{ ...BODY, marginTop: 6 }}>{u.job[0]}</p>
              ) : (
                <ul style={{ ...BODY, margin: "6px 0 0", paddingLeft: 20, listStyle: "disc" }}>
                  {u.job.map((j) => (
                    <li key={j}>{j}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <Label>{data.journeyLabel}</Label>
              <ol className="list-none p-0 m-0" style={{ marginTop: 12 }}>
                {u.steps.map((st, si) => (
                  <li key={st.text} style={{ position: "relative", paddingLeft: 40, paddingBottom: si < u.steps.length - 1 ? 16 : 0 }}>
                    <span
                      aria-hidden="true"
                      className="font-mono"
                      style={{ position: "absolute", left: 0, top: 0, width: 24, height: 24, boxSizing: "border-box", borderRadius: "50%", border: `1px solid ${BRIGHT}`, background: "#fff", color: "#6B7280", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {si + 1}
                    </span>
                    {si < u.steps.length - 1 && (
                      <span aria-hidden="true" style={{ position: "absolute", left: 11.5, top: 24, bottom: 0, width: 1, background: "#D1D5DB" }} />
                    )}
                    <span style={{ ...BODY, display: "block", lineHeight: "24px", fontSize: 13 }}>
                      {st.text}
                      {st.metamint && (
                        <>
                          {" "}
                          <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                            <Icon name="Leaf" size={16} color={BRIGHT} />
                          </span>
                          <span style={srOnly}>{data.metamintSrText}</span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Measured({ data }: { data: ProductAnalyticsData["metrics"] }) {
  const { ref, fx } = useReveal();
  const ns = data.northStar;
  return (
    <div ref={ref}>
      <Label as="h4">{data.label}</Label>
      <div style={{ border: `2px solid ${ACCENT}`, background: TINT, borderRadius: 4, padding: 28, marginTop: 12, ...fx(0) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Icon name={ns.icon} size={40} color={ACCENT} />
          <div>
            <Label>{ns.label}</Label>
            <p style={{ margin: "4px 0 0", fontSize: 16, lineHeight: 1.2, fontWeight: 700, color: "#1F2937" }}>
              {ns.title}
            </p>
          </div>
        </div>
        <span style={srOnly}>{ns.srText}</span>
        <ul className="list-none p-0 m-0 flex flex-wrap" style={{ gap: 8, marginTop: 16 }}>
          {ns.chips.map((c) => (
            <li
              key={c.text}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${BRIGHT}`, borderRadius: 4, padding: "3px 8px", fontSize: 12, lineHeight: 1.4, color: "#374151" }}
            >
              <Icon name={c.icon} size={14} color={BRIGHT} />
              {c.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-3" style={{ gap: 20, marginTop: 20 }}>
        {data.groups.map((g, gi) => (
          <div
            key={g.label}
            style={{
              ...CARD,
              padding: 24,
              ...(g.focus ? { border: `2px solid ${BRIGHT}`, background: TINT } : {}),
              ...fx(gi + 1),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <Icon name={g.icon} size={32} color={BRIGHT} />
              {g.focus && (
                <span style={{ border: `1px solid ${BRIGHT}`, background: "#fff", color: ACCENT, borderRadius: 999, padding: "2px 10px", fontSize: 12, lineHeight: 1.4, whiteSpace: "nowrap" }}>
                  {data.focusPill}
                </span>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <Label>{g.label}</Label>
            </div>
            <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: 8, marginTop: 12 }}>
              {g.items.map((it) => (
                <li key={it} style={{ ...BODY, position: "relative", paddingLeft: 16 }}>
                  <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 8, width: 6, height: 6, background: BRIGHT }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductAnalytics({ data }: { data: ProductAnalyticsData }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ maxWidth: 720, margin: 0 }}>
        {data.intro}
      </p>
      <div className="flex flex-col" style={{ gap: 40, marginTop: 24 }}>
        <RationaleAndGoal data={data} />
        <WhoItServes data={data.users} />
        <Measured data={data.metrics} />
      </div>
    </div>
  );
}
