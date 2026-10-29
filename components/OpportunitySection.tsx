"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { OpportunityData } from "@/data/content";

// "The opportunity": body text, a small "shift" visual (a struck-through "not just"
// card, an arrow, and a "but also" card), three outcome chips, and a highlighted
// closing statement. The visual animates once at 30% visible using only opacity,
// transform and stroke-dashoffset; the final state is the default, so it shows with
// reduced motion or without JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const MID_GRAY = "#9CA3AF";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Icon({ name, size, color }: { name: string; size: number; color: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={1.5} color={color} aria-hidden="true" style={{ display: "block", flexShrink: 0 }} />;
}

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

const LABEL: React.CSSProperties = { fontSize: 11, letterSpacing: "0.06em", margin: "0 0 12px" };

export default function OpportunitySection({ data }: { data: OpportunityData }) {
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
        setPhase("shown");
        io.disconnect();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ARROW_DELAY = 250; // after the cards start fading in
  const ARROW_MS = 500;
  const STRIKE_DELAY = ARROW_DELAY + ARROW_MS;
  const STRIKE_MS = 350;
  const CHIPS_DELAY = STRIKE_DELAY + STRIKE_MS;

  const fade = (delay: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : { opacity: 1, transform: "none", transition: `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms` };

  const draw = (delay: number, ms: number): React.CSSProperties =>
    phase === "hidden"
      ? { strokeDashoffset: 1 }
      : phase === "shown"
      ? { strokeDashoffset: 0, transition: `stroke-dashoffset ${ms}ms ease-in-out ${delay}ms` }
      : { strokeDashoffset: 0 };

  const { notJust, butAlso } = data.shift;
  const idx = data.closing.indexOf(data.closingHighlight);

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ maxWidth: 720, margin: 0 }}>
        {data.text}
      </p>

      <div ref={ref} style={{ marginTop: 32 }}>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-[1fr_64px_1fr] items-stretch" style={{ rowGap: 0 }}>
          {/* NOT JUST */}
          <div style={{ position: "relative", border: "1px solid #E5E7EB", background: "#fff", borderRadius: 4, padding: 24, ...fade(0) }}>
            <span style={srOnly}>{notJust.srText}</span>
            <div aria-hidden="true">
              <p className="font-mono uppercase text-gray-400" style={LABEL}>
                {notJust.label}
              </p>
              <div className="flex items-center" style={{ gap: 14 }}>
                <Icon name={notJust.icon} size={36} color={MID_GRAY} />
                <span className="text-gray-500" style={{ position: "relative", display: "inline-block", fontSize: 15, lineHeight: 1.5 }}>
                  {notJust.text}
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    style={{ position: "absolute", left: -4, top: "50%", width: "calc(100% + 8px)", height: 10, marginTop: -5, overflow: "visible", pointerEvents: "none" }}
                  >
                    <path
                      d="M 0,6 C 18,2 38,8 58,4 S 88,6 100,3"
                      fill="none"
                      stroke={MID_GRAY}
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      pathLength={1}
                      strokeDasharray={1}
                      style={draw(STRIKE_DELAY, STRIKE_MS)}
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* connector arrow: right on wide screens, down when stacked */}
          <div aria-hidden="true" className="flex items-center justify-center" style={{ minHeight: 40 }}>
            <svg className="hidden min-[768px]:block" width="52" height="26" viewBox="0 0 52 26" fill="none" style={{ overflow: "visible" }}>
              <path
                d="M 4,18 C 14,4 32,2 46,12 M 39,6.5 L 46.5,12.5 L 37,15.5"
                stroke={BRIGHT}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                style={draw(ARROW_DELAY, ARROW_MS)}
              />
            </svg>
            <svg className="block min-[768px]:hidden" width="26" height="40" viewBox="0 0 26 40" fill="none" style={{ overflow: "visible" }}>
              <path
                d="M 8,4 C 22,12 22,26 14,35 M 8,30 L 14,36 L 20,29"
                stroke={BRIGHT}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                style={draw(ARROW_DELAY, ARROW_MS)}
              />
            </svg>
          </div>

          {/* BUT ALSO */}
          <div
            style={{
              border: `2px solid ${BRIGHT}`,
              background: "color-mix(in srgb, var(--accent) 7%, white)",
              borderRadius: 4,
              padding: 24,
              ...fade(0),
            }}
          >
            <p className="font-mono uppercase text-gray-500" style={LABEL}>
              {butAlso.label}
            </p>
            <div className="flex items-center" style={{ gap: 14 }}>
              <Icon name={butAlso.icon} size={36} color={BRIGHT} />
              <span className="text-gray-800" style={{ fontSize: 15, lineHeight: 1.5 }}>
                {butAlso.text}
              </span>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-1 min-[768px]:grid-cols-3 list-none p-0" style={{ gap: 12, margin: "24px 0 0" }}>
          {data.chips.map((chip, i) => (
            <li
              key={chip.text}
              className="flex items-center"
              style={{ gap: 8, border: `1px solid ${BRIGHT}`, borderRadius: 4, padding: "10px 14px", ...fade(CHIPS_DELAY + i * 120) }}
            >
              <Icon name={chip.icon} size={20} color={BRIGHT} />
              <span className="text-sm text-gray-700">{chip.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-gray-800" style={{ marginTop: 40, fontSize: 14, lineHeight: 1.6 }}>
        {idx === -1 ? (
          data.closing
        ) : (
          <>
            {data.closing.slice(0, idx)}
            <span
              style={{
                background: "color-mix(in srgb, var(--accent) 25%, transparent)",
                padding: "1px 6px",
                borderRadius: "3px 7px 4px 6px",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
              }}
            >
              {data.closingHighlight}
            </span>
            {data.closing.slice(idx + data.closingHighlight.length)}
          </>
        )}
      </p>
    </div>
  );
}
