"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { FeatureBoardData } from "@/data/content";

// Feature board: releases as columns of cards, each with a category tag and a priority
// tag. Counts and the summary are computed from the data. Animates once when 30% is
// visible (opacity and transform only); the final state is the default, so it shows
// with reduced motion or without JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const ACCENT = "var(--accent)";
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Release = FeatureBoardData["releases"][number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconFor = (name: string): React.ComponentType<any> | null => (LucideIcons as any)[name] ?? null;

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

const COLUMN = {
  mvp: {
    pill: { background: ACCENT, color: "#fff", border: `1px solid ${ACCENT}` },
    card: { border: `1px solid ${ACCENT}` },
  },
  v02: {
    pill: { background: "transparent", color: ACCENT, border: `1px solid ${BRIGHT}` },
    card: { border: `1px solid ${BRIGHT}` },
  },
  v10: {
    pill: { background: "color-mix(in srgb, var(--accent) 10%, white)", color: ACCENT, border: "1px solid transparent" },
    card: { border: "1px solid color-mix(in srgb, var(--accent-bright, var(--accent)) 40%, white)" },
  },
  out: {
    pill: { background: "#E5E7EB", color: "#4B5563", border: "1px solid #E5E7EB" },
    card: { border: "1px dashed #D1D5DB" },
  },
} as const;

const TAG_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "2px 7px",
  borderRadius: 999,
  fontSize: 12,
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
};

function CategoryTag({ name, icon }: { name: string; icon: string }) {
  const Icon = iconFor(icon);
  return (
    <span style={{ ...TAG_BASE, border: "1px solid #E5E7EB", color: "#374151" }}>
      {Icon && <Icon aria-hidden="true" size={14} strokeWidth={1.5} color="#6B7280" />}
      {name}
    </span>
  );
}

// look per priority, keyed by the order in the data (Must, Should, Could, Won't)
function priorityLook(index: number): React.CSSProperties {
  switch (index) {
    case 0:
      return { background: ACCENT, color: "#fff", border: `1px solid ${ACCENT}` };
    case 1:
      return { background: "transparent", color: ACCENT, border: `1px solid ${BRIGHT}` };
    case 2:
      return { background: "transparent", color: "#6B7280", border: "1px dashed #9CA3AF" };
    default:
      return { background: "#E5E7EB", color: "#4B5563", border: "1px solid #E5E7EB" };
  }
}

function PriorityTag({ name, icon, index }: { name: string; icon: string; index: number }) {
  const Icon = iconFor(icon);
  return (
    <span style={{ ...TAG_BASE, borderRadius: 4, ...priorityLook(index) }}>
      {Icon && <Icon aria-hidden="true" size={14} strokeWidth={1.5} />}
      {name}
    </span>
  );
}

function summarize(releases: Release[]) {
  const counts = releases.map((r) => r.cards.length);
  const total = counts.reduce((a, b) => a + b, 0);
  const shipping = releases.filter((r) => r.style !== "out").length;
  const hasLot = releases.some((r) => r.style === "out");
  const parts = releases.map((r, i) => `${counts[i]} ${r.summaryPhrase}`);
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}` : parts[0];
  const lead = `${total} features across ${NUMBER_WORDS[shipping] ?? shipping} releases${hasLot ? " and a parking lot" : ""}`;
  return `${lead}: ${list}.`;
}

export default function FeatureBoard({ data }: { data: FeatureBoardData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  const allCards = data.releases.flatMap((r) => r.cards);
  const priorityCounts = data.priorityOrder.map((p) => `${allCards.filter((c) => c.priority === p).length} ${p}`);
  const mvp = data.releases.find((r) => r.style === "mvp");
  const showNote = data.showMvpNote && !!mvp && mvp.cards.length > 0 && mvp.cards.every((c) => c.priority === data.priorityOrder[0]);

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

  const colStyle = (ci: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0 }
      : { opacity: 1, transition: `opacity 250ms ease ${ci * 120}ms` };

  const cardStyle = (ci: number, ki: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : {
          opacity: 1,
          transform: "none",
          transition: `opacity 250ms ease ${ci * 120 + 100 + ki * 60}ms, transform 250ms ease ${ci * 120 + 100 + ki * 60}ms`,
        };

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
        {summarize(data.releases)}
      </p>
      <p className="font-mono text-xs text-gray-500" style={{ margin: "4px 0 0" }}>
        {priorityCounts.join(", ")}
      </p>

      {/* the board breaks out of the text column, up to 1100px, centered */}
      <div style={{ position: "relative", left: "50%", width: "min(960px, calc(100vw - 48px))", transform: "translateX(-50%)", marginTop: 24 }}>
        <div ref={ref} style={{ position: "relative", paddingTop: showNote ? 40 : 0 }}>
          {showNote && (
            <div aria-hidden="true" className="hidden min-[1100px]:block" style={{ position: "absolute", top: 0, left: 130, pointerEvents: "none" }}>
              <svg width="34" height="30" viewBox="0 0 34 30" fill="none" stroke={BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: -30, top: 8 }}>
                <path d="M 31,4 Q 14,2 6,22 M 2,15 L 6,23 L 13,18" />
              </svg>
              <span style={{ color: BRIGHT, fontFamily: "var(--font-caveat), cursive", fontSize: 19, lineHeight: 1, whiteSpace: "nowrap", display: "inline-block", transform: "rotate(-2deg)" }}>
                {data.mvpNote}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4 items-start" style={{ gap: 16 }}>
            {data.releases.map((release, ci) => {
              const look = COLUMN[release.style];
              const id = `board-${ci}`;
              const dim = release.style === "out";
              return (
                <section key={release.name} aria-labelledby={id} style={colStyle(ci)}>
                  <div
                    className="max-[699px]:sticky max-[699px]:top-0 max-[699px]:z-10 max-[699px]:bg-white"
                    style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingBottom: 12, paddingTop: 4 }}
                  >
                    <h4 id={id} style={{ margin: 0 }}>
                      <span style={{ display: "inline-block", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600, lineHeight: 1.3, ...look.pill }}>
                        {release.name}
                      </span>
                    </h4>
                    <span className="font-mono text-gray-500" style={{ fontSize: 12 }}>
                      {release.cards.length}
                      <span className="sr-only"> features</span>
                    </span>
                  </div>
                  <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: 10 }}>
                    {release.cards.map((card, ki) => {
                      const cat = data.categories[card.category];
                      const pi = data.priorityOrder.indexOf(card.priority);
                      return (
                        <li key={card.text} style={cardStyle(ci, ki)}>
                          <div style={{ background: "#fff", borderRadius: 8, padding: 12, opacity: dim ? 0.8 : 1, ...look.card }}>
                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#374151" }}>{card.text}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                              <CategoryTag name={card.category} icon={cat?.icon ?? ""} />
                              <PriorityTag name={card.priority} icon={data.priorities[card.priority]?.icon ?? ""} index={pi < 0 ? 3 : pi} />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

        {/* legend */}
        <ul className="list-none p-0 m-0 flex flex-wrap text-gray-500" style={{ gap: 8, marginTop: 24, fontSize: 12 }}>
          {data.priorityOrder.map((p, i) => (
            <li key={p}>
              <PriorityTag name={p} icon={data.priorities[p]?.icon ?? ""} index={i} />
            </li>
          ))}
          {Object.entries(data.categories).map(([name, c]) => (
            <li key={name}>
              <CategoryTag name={name} icon={c.icon} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
