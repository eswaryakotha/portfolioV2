"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Plane, Leaf, CheckCheck } from "lucide-react";
import type { BudgetHookData } from "@/data/content";

// MetaMint hero visual: a handwritten budget notebook page next to a chat bubble.
// The total and the overage are derived from the data. Animates once when 30% is
// visible (opacity, transform and stroke-dashoffset only). The final state is the
// default, so it shows with reduced motion or without JavaScript.

const INK = "#2B2B2B";
const RED = "#C8483B";
const PAPER = "#F6F1E4";
const TICK = "var(--accent-bright, var(--accent))";
const ROW = 32; // ruled line spacing; every row sits on the grid

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function money(n: number) {
  return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Loose torn edge along the bottom of the page.
const TORN =
  "polygon(0 0, 100% 0, 100% 97.5%, 97% 99%, 93% 97%, 89% 99.2%, 84% 97.2%, 79% 98.8%, 74% 97%, 69% 99%, 64% 97.4%, 58% 99.2%, 53% 97.2%, 47% 98.8%, 42% 97%, 36% 99%, 31% 97.3%, 25% 99.2%, 19% 97.2%, 14% 98.8%, 8% 97.2%, 3% 99%, 0 97.5%)";

function Tick() {
  return (
    <svg aria-hidden="true" width="20" height="18" viewBox="0 0 20 18" fill="none" style={{ display: "block", overflow: "visible" }}>
      <path d="M2.5 9.5 C4.5 11 6 13 7.2 15.5 C10 9 14 4.5 18 2" stroke={TICK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BudgetHook({ data }: { data: BudgetHookData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  const total = data.items.reduce((sum, it) => sum + it.amount, 0);
  const over = total - data.budget;

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

  const fade = (delay: number, rise = 4): React.CSSProperties => {
    if (phase === "final") return {};
    if (phase === "hidden") return { opacity: 0, transform: `translateY(${rise}px)` };
    return { opacity: 1, transform: "none", transition: `opacity 200ms ease ${delay}ms, transform 200ms ease ${delay}ms` };
  };

  const itemsEnd = data.items.length * 80 + 200;
  const circleDelay = itemsEnd;
  const scribbleDelay = circleDelay + 600;
  const bubbleDelay = scribbleDelay + 250;

  const circleStyle: React.CSSProperties =
    phase === "hidden"
      ? { strokeDashoffset: 1 }
      : phase === "shown"
      ? { strokeDashoffset: 0, transition: `stroke-dashoffset 600ms ease-in-out ${circleDelay}ms` }
      : { strokeDashoffset: 0 };

  const bubbleStyle: React.CSSProperties =
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "scale(0.96)" }
      : { opacity: 1, transform: "scale(1)", transition: `opacity 250ms ease ${bubbleDelay}ms, transform 250ms ease ${bubbleDelay}ms` };

  const label =
    `A notebook page titled ${data.heading} with a ${money(data.budget)} budget and itemized costs totaling ${money(total)}, ` +
    `circled in red, next to a chat message saying you are ${money(over)} over your budget and asking if you want to see where you spent the most.`;

  const hand: React.CSSProperties = { fontFamily: "var(--font-caveat), cursive", color: INK };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="mx-auto w-full max-w-[1000px] min-[768px]:[zoom:0.8] grid grid-cols-1 min-[768px]:grid-cols-[55%_45%] min-[768px]:items-end"
      style={{ overflowX: "clip", padding: "8px 8px 8px" }}
    >
      {/* notebook page; the shadow lives on the wrapper so the torn edge doesn't clip it */}
      <div aria-hidden="true" style={{ transform: "rotate(-2deg)", filter: "drop-shadow(0 6px 14px rgba(60,45,20,0.18))" }}>
        <div
          style={{
            position: "relative",
            background: PAPER,
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW - 1}px, rgba(110,140,175,0.28) ${ROW - 1}px, rgba(110,140,175,0.28) ${ROW}px)`,
            backgroundPositionY: ROW,
            padding: `${ROW}px 40px ${ROW + 12}px 64px`,
            clipPath: TORN,
            ...hand,
          }}
        >
          {/* punched holes */}
          {["18%", "50%", "82%"].map((top) => (
            <span
              key={top}
              style={{ position: "absolute", left: 18, top, width: 16, height: 16, borderRadius: "50%", background: "#f9f9f7", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.22)" }}
            />
          ))}

          {/* heading */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: ROW * 2, fontSize: 40, lineHeight: 1, fontWeight: 700 }}>
            <span>{data.heading}</span>
            <Plane size={28} strokeWidth={1.5} color={INK} style={{ transform: "rotate(-8deg)" }} />
          </div>

          {/* budget */}
          <div style={{ height: ROW, lineHeight: `${ROW}px`, fontSize: 26 }}>
            {data.budgetLabel}{" "}
            <span
              style={{
                background: "color-mix(in srgb, var(--accent) 25%, transparent)",
                padding: "0 8px",
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              {money(data.budget)}
            </span>
          </div>

          {/* line items */}
          <div>
            {data.items.map((it, i) => (
              <div
                key={it.label}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1fr auto 24px",
                  alignItems: "center",
                  columnGap: 10,
                  height: ROW,
                  lineHeight: `${ROW}px`,
                  fontSize: 25,
                  ...fade(i * 80),
                }}
              >
                {it.flag === "question" && (
                  <span
                    style={{
                      position: "absolute",
                      inset: "3px -10px 3px -8px",
                      background: "rgba(242, 201, 196, 0.7)",
                      borderRadius: 3,
                      transform: "rotate(-0.6deg)",
                      zIndex: 0,
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{it.label}</span>
                <span style={{ position: "relative", zIndex: 1, textAlign: "right", fontWeight: 700 }}>{money(it.amount)}</span>
                <span style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
                  {it.flag === "question" ? (
                    <span style={{ fontSize: 26, fontWeight: 700, color: RED, lineHeight: 1 }}>?</span>
                  ) : (
                    <Tick />
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* hand-drawn rule */}
          <svg aria-hidden="true" width="100%" height="10" viewBox="0 0 300 10" preserveAspectRatio="none" style={{ display: "block", marginTop: 4, ...fade(itemsEnd - 120, 0) }}>
            <path d="M2 5 C40 2 70 8 120 5 S220 3 298 6" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* total */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: ROW * 2, color: RED, fontSize: 32, fontWeight: 700 }}>
            <span style={{ color: RED }}>{data.totalLabel}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 14, paddingRight: 34 }}>
              <span style={{ ...fade(scribbleDelay, 0), fontSize: 28, fontWeight: 400, whiteSpace: "nowrap" }}>
                <span style={{ display: "inline-block", transform: "rotate(6deg)", color: RED }}>{data.scribble}</span>
              </span>
              <span style={{ position: "relative", display: "inline-block", padding: "0 6px", color: RED }}>
                {money(total)}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 50"
                  preserveAspectRatio="none"
                  style={{ position: "absolute", left: -16, right: -16, top: -12, bottom: -12, width: "calc(100% + 32px)", height: "calc(100% + 24px)", overflow: "visible" }}
                >
                  <path
                    d="M 34,7 C 70,-1 99,11 96,27 C 93,44 56,51 22,45 C 3,40 -3,24 9,13 C 19,5 46,3 76,5"
                    fill="none"
                    stroke={RED}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    strokeDasharray={1}
                    style={circleStyle}
                  />
                </svg>
                {/* tiny tick marks beside the circle */}
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  style={{ position: "absolute", right: -30, top: -18, ...fade(scribbleDelay, 0) }}
                >
                  <path d="M3 20 L8 14 M10 10 L12 2 M15 14 L21 11" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* chat bubble */}
      <div
        aria-hidden="true"
        className="w-[85%] ml-auto -mt-4 min-[768px]:w-[min(320px,calc(100%-24px))] min-[768px]:ml-0 min-[768px]:mt-0 min-[768px]:justify-self-center min-[768px]:mb-10"
        style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.12))", ...bubbleStyle, transformOrigin: "left bottom" }}
      >
        <div style={{ position: "relative", background: "color-mix(in srgb, var(--accent) 15%, white)", borderRadius: 14, padding: "12px 14px 8px" }}>
          <span
            style={{ position: "absolute", left: -8, top: 14, width: 10, height: 14, background: "color-mix(in srgb, var(--accent) 15%, white)", clipPath: "polygon(100% 0, 100% 100%, 0 45%)" }}
          />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={20} strokeWidth={1.5} color="var(--accent)" />
            </span>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.4, color: "#374151" }}>
              {data.bubble.before}
              {money(over)}
              {data.bubble.after}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "#6B7280" }}>
            <span>{data.bubble.time}</span>
            <CheckCheck size={14} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
