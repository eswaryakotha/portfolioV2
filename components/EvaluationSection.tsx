"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText, RefreshCw, SlidersHorizontal, Target,
  BookOpen,
} from "lucide-react";
import type { EvaluationData } from "@/data/content";

// ── Design tokens ─────────────────────────────────────────────
const ORANGE = "var(--accent)";
const INK = "#2B2B2B";
const CARD_BORDER = "#e5e7eb";

// Status palette — pair with shape + text label, never color alone
const S_PASS  = "#3A3A3A";   // bar chart pass (dark gray)
const S_FLAKY = ORANGE;
const S_FAIL  = "#d4d4d0";  // bar chart fail (light gray)

// Status icon / dot colors (section 02)
const STATUS_PASS = "#2e9e5c"; // green
const STATUS_FAIL = "#d94545"; // red

const FLAKY_HATCH =
  "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.28) 3px, rgba(255,255,255,0.28) 4px)";
const FAIL_HATCH =
  "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 6px), " +
  "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 6px)";

// ── Shared helpers ────────────────────────────────────────────

function SubLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs tracking-widest text-gray-400 mb-5">
      {children}
    </p>
  );
}

function MonoTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 12,
        color: "#999",
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </span>
  );
}

// ── Status icons ──────────────────────────────────────────────

function StatusIcon({
  status,
  size = 18,
}: {
  status: "PASS" | "FLAKY" | "FAIL";
  size?: number;
}) {
  if (status === "PASS")
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill={STATUS_PASS} />
        <path
          d="M 5.5,9 L 8,11.5 L 12.5,6.5"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (status === "FLAKY")
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
        {/* left half filled — M top A counterclockwise to bottom Z */}
        <path d="M 9,1 A 8,8 0 0 0 9,17 Z" fill={S_FLAKY} />
        <circle cx="9" cy="9" r="8" fill="none" stroke={S_FLAKY} strokeWidth="1.2" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="8" fill="none" stroke={STATUS_FAIL} strokeWidth="1.2" />
      <path
        d="M 6,6 L 12,12 M 12,6 L 6,12"
        stroke={STATUS_FAIL}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RunDot({
  filled,
  color,
  outlineColor,
}: {
  filled: boolean;
  color: string;
  outlineColor?: string; // border color for empty dots (defaults to CARD_BORDER)
}) {
  const borderColor = filled ? color : (outlineColor ?? CARD_BORDER);
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: filled ? color : "transparent",
        border: `1.5px solid ${borderColor}`,
        flexShrink: 0,
      }}
    />
  );
}

// ── 01. How it is tested ──────────────────────────────────────

type ArrowPaths = { p1: string; a1: string; p2: string; a2: string };

function HowItIsTested({ data }: { data: EvaluationData }) {
  const flowNodes = [
    { icon: <FileText size={14} strokeWidth={1.5} color={INK} />, label: "Case" },
    { icon: <RefreshCw size={14} strokeWidth={1.5} color={INK} />, label: "Runs 3 times" },
    { icon: <SlidersHorizontal size={14} strokeWidth={1.5} color={INK} />, label: "Scored two ways" },
    { icon: <Target size={14} strokeWidth={1.5} color={INK} />, label: "Result" },
  ];

  const caseAriaLabel = `18 test cases in four groups: ${data.caseGroups
    .map((g) => `${g.count} ${g.label}`)
    .join(", ")}.`;

  // ── Arrow measurement ────────────────────────────────────────
  // Refs for the shared relative wrapper, the "Scored two ways" node box,
  // and the bordered div of each check card.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scoredRef  = useRef<HTMLDivElement>(null);
  const card0Ref   = useRef<HTMLDivElement>(null);
  const card1Ref   = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState<ArrowPaths | null>(null);

  useEffect(() => {
    function measure() {
      const wrapper = wrapperRef.current;
      const scored  = scoredRef.current;
      const c0      = card0Ref.current;
      const c1      = card1Ref.current;
      if (!wrapper || !scored || !c0 || !c1) return;

      const wR = wrapper.getBoundingClientRect();
      const sR = scored.getBoundingClientRect();
      const r0 = c0.getBoundingClientRect();
      const r1 = c1.getBoundingClientRect();

      // Start: bottom-centre of "Scored two ways" node + 6 px gap
      const sx  = sR.left   - wR.left + sR.width  / 2;
      const sy  = sR.bottom - wR.top  + 6;

      // End points: top-centre of each card − 6 px
      const e1x = r0.left - wR.left + r0.width  / 2;
      const e1y = r0.top  - wR.top  - 6;
      const e2x = r1.left - wR.left + r1.width  / 2;
      const e2y = r1.top  - wR.top  - 6;

      const ah = 7; // arrowhead half-width / depth

      // Cards are stacked into one column when their left edges are within 20 px.
      const stacked = Math.abs(r0.left - r1.left) < 20;

      if (stacked) {
        // Mobile: short centered drop above each card, not tied to the node.
        // Subtle S-curve so it doesn't look like a plain line.
        const drop = 44;
        setArrows({
          p1: `M ${e1x},${e1y - drop} C ${e1x - 4},${e1y - drop + 16} ${e1x + 4},${e1y - 16} ${e1x},${e1y}`,
          a1: `M ${e1x - ah},${e1y - ah} L ${e1x},${e1y} L ${e1x + ah},${e1y - ah}`,
          p2: `M ${e2x},${e2y - drop} C ${e2x + 4},${e2y - drop + 16} ${e2x - 4},${e2y - 16} ${e2x},${e2y}`,
          a2: `M ${e2x - ah},${e2y - ah} L ${e2x},${e2y} L ${e2x + ah},${e2y - ah}`,
        });
      } else {
        // Desktop: cubic Bezier with vertical tangents at both ends.
        // Control points sit directly above the start and end so the curve
        // leaves the node heading straight down, fans sideways in the middle,
        // and arrives at each card heading straight down.
        // t = fraction of dy used for the control-point offset.
        const dy1 = e1y - sy;
        const dy2 = e2y - sy;
        const t   = 0.42;
        setArrows({
          p1: `M ${sx},${sy} C ${sx},${sy + dy1 * t} ${e1x},${e1y - dy1 * t} ${e1x},${e1y}`,
          a1: `M ${e1x - ah},${e1y - ah} L ${e1x},${e1y} L ${e1x + ah},${e1y - ah}`,
          p2: `M ${sx},${sy} C ${sx},${sy + dy2 * t} ${e2x},${e2y - dy2 * t} ${e2x},${e2y}`,
          a2: `M ${e2x - ah},${e2y - ah} L ${e2x},${e2y} L ${e2x + ah},${e2y - ah}`,
        });
      }
    }

    const ro = new ResizeObserver(measure);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    measure(); // run once immediately after mount
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      <SubLabel>{data.label01}</SubLabel>

      {/* Stat strip */}
      <div
        style={{ display: "flex", flexWrap: "wrap" as const, gap: 24, marginBottom: 20 }}
        role="list"
        aria-label="Test suite statistics"
      >
        {data.stats.map((s) => (
          <div key={s.label} role="listitem">
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: ORANGE,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {s.value}
            </span>
            <span
              style={{
                marginLeft: 6,
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 12,
                color: INK,
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Intro */}
      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginBottom: 20 }}>
        {data.intro}
      </p>

      {/* Case groups */}
      <div
        role="img"
        aria-label={caseAriaLabel}
        style={{ display: "flex", flexWrap: "wrap" as const, gap: 20, marginBottom: 20 }}
      >
        {data.caseGroups.map((g) => (
          <div key={g.label}>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 3, marginBottom: 6 }}>
              {Array.from({ length: g.count }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    background: ORANGE,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#666", margin: 0, lineHeight: 1.4 }}>
              <strong style={{ color: INK, fontWeight: 600 }}>{g.count}</strong>{" "}
              {g.label}
            </p>
          </div>
        ))}
      </div>

      {/* Shared relative wrapper — the overlay SVG spans both the flow and the cards */}
      <div ref={wrapperRef} style={{ position: "relative" }}>

        {/* Overlay SVG: computed paths rendered over the wrapper area */}
        {arrows && (
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <path d={arrows.p1} fill="none" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" />
            <path d={arrows.a1} fill="none" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={arrows.p2} fill="none" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" />
            <path d={arrows.a2} fill="none" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}

        {/* Flow diagram */}
        <div style={{ overflowX: "auto", marginBottom: 4 }}>
          <div
            role="img"
            aria-label="Flow: each case runs 3 times, is scored two ways, and gets a PASS, FLAKY or FAIL result."
            style={{ display: "flex", alignItems: "center", minWidth: 380 }}
          >
            {flowNodes.map((node, i) => (
              <div key={node.label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <svg
                    aria-hidden="true"
                    width="28"
                    height="12"
                    viewBox="0 0 28 12"
                    style={{ flexShrink: 0 }}
                  >
                    <line x1="2" y1="6" x2="22" y2="6" stroke={CARD_BORDER} strokeWidth="1" />
                    <path
                      d="M 19,3 L 23,6 L 19,9"
                      fill="none"
                      stroke={CARD_BORDER}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {/* scoredRef attached to the "Scored two ways" node box (index 2) */}
                <div
                  ref={i === 2 ? scoredRef : undefined}
                  style={{
                    border: `1px solid ${CARD_BORDER}`,
                    borderRadius: 4,
                    padding: "8px 10px",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    gap: 5,
                    background: "#fff",
                    minWidth: 72,
                  }}
                >
                  {node.icon}
                  <MonoTag>{node.label}</MonoTag>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards — paddingTop reserves ~62 px for the curves */}
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8, marginBottom: 12 }}>
          {data.checkCards.map((card, i) => (
            <div key={card.title} style={{ paddingTop: 62 }}>
              {/* Ref on the bordered div so getBoundingClientRect gives the card's real top */}
              <div
                ref={i === 0 ? card0Ref : card1Ref}
                style={{
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 4,
                  padding: "10px 14px",
                  background: "#fff",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: INK,
                    margin: "0 0 4px 0",
                    lineHeight: 1.4,
                  }}
                >
                  {card.title}
                </p>
                <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.55 }}>
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>{/* end relative wrapper */}

      {/* Book note */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
        <BookOpen
          size={13}
          strokeWidth={1.5}
          color="#aaa"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.55 }}>
          {data.bookNote}
        </p>
      </div>
    </div>
  );
}

// ── 02. What PASS, FLAKY and FAIL mean ────────────────────────

function StatusMeaning({ data }: { data: EvaluationData }) {
  return (
    <div>
      <SubLabel>{data.label02}</SubLabel>
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 8 }}>
        {data.statusCards.map((card) => {
          const dotColor =
            card.status === "PASS"
              ? STATUS_PASS
              : card.status === "FLAKY"
              ? S_FLAKY
              : STATUS_FAIL;
          const isFlaky = card.status === "FLAKY";
          return (
            <div
              key={card.status}
              style={{ position: "relative", paddingTop: isFlaky ? 34 : 0 }}
            >
              {isFlaky && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-caveat), cursive",
                      color: ORANGE,
                      fontSize: 13,
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {data.flakyNote}
                  </span>
                  <svg width="12" height="16" viewBox="0 0 12 16">
                    <path
                      d="M 6,0 Q 9,7 6,14"
                      fill="none"
                      stroke={ORANGE}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 3,11 L 6,15 L 9,11"
                      fill="none"
                      stroke={ORANGE}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <div
                style={{
                  border: `1px solid ${isFlaky ? ORANGE : CARD_BORDER}`,
                  borderRadius: 4,
                  padding: "12px 14px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <StatusIcon status={card.status} size={16} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: INK,
                      fontFamily: "'Courier New', monospace",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {card.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                  {card.runs.map((filled, i) => (
                    <RunDot
                      key={i}
                      filled={filled}
                      color={dotColor}
                      outlineColor={card.status === "FAIL" ? STATUS_FAIL : undefined}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.55 }}>
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 04. Run history ───────────────────────────────────────────

function RunHistory({ data }: { data: EvaluationData }) {
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const chartRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (desktopRef.current) obs.observe(desktopRef.current);
    if (chartRef.current)   obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

  const show = reduced || entered;
  const animate = !reduced && entered;

  const ariaLabel =
    "Run history: " +
    data.runs
      .map(
        (r) =>
          `${r.run} (${r.cases} cases): ${r.passed} passed every run, ${r.flaky} flaky, ${r.failed} failed every run, ${r.validFirst.count} of ${r.validFirst.total} valid first attempts`
      )
      .join("; ");

  return (
    <div>
      <SubLabel>{data.label04}</SubLabel>

      {/* Desktop: legend + stacked bar chart, then model calls table */}
      <div className="hidden sm:block">
        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 14, marginBottom: 12 }}>
          {[
            { color: S_PASS, hatch: undefined as string | undefined, label: data.legendPass },
            { color: S_FLAKY, hatch: FLAKY_HATCH, label: data.legendFlaky },
            { color: S_FAIL, hatch: FAIL_HATCH, label: data.legendFail },
          ].map(({ color, hatch, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  background: color,
                  backgroundImage: hatch,
                  borderRadius: 2,
                  flexShrink: 0,
                  boxShadow: color === S_FAIL ? "inset 0 0 0 1px #ccc" : "none",
                }}
              />
              <span style={{ fontSize: 11, color: "#666" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Stacked bar chart — 2-column card grid */}
        <div
          ref={desktopRef}
          role="img"
          aria-label={ariaLabel}
          className="grid grid-cols-2"
          style={{ gap: 8, marginBottom: data.runs.some((r) => r.hasFootnote) ? 6 : 24 }}
        >
          {data.runs.map((run) => {
            const pct = (n: number) => (n / run.cases) * 100;
            const validPct = Math.round((run.validFirst.count / run.validFirst.total) * 100);
            const segments = [
              { count: run.passed, color: S_PASS, hatch: undefined as string | undefined, textColor: "white", label: "passed" },
              { count: run.flaky, color: S_FLAKY, hatch: FLAKY_HATCH, textColor: "white", label: "flaky" },
              { count: run.failed, color: S_FAIL, hatch: FAIL_HATCH, textColor: INK, label: "failed" },
            ];
            return (
              <div
                key={run.run}
                style={{ border: `1px solid ${CARD_BORDER}`, borderRadius: 4, padding: "12px 14px", background: "#fff" }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: "0 0 2px 0" }}>
                  {run.run}
                  {run.hasFootnote && (
                    <span aria-hidden="true" style={{ color: ORANGE, fontSize: 10, marginLeft: 3 }}>*</span>
                  )}
                </p>
                <MonoTag>{run.cases} cases</MonoTag>
                <div style={{ display: "flex", height: 22, borderRadius: 3, overflow: "hidden", marginTop: 8, marginBottom: 5 }}>
                  {segments.map(({ count, color, hatch, textColor, label }) => (
                    <div
                      key={label}
                      style={{
                        width: show ? `${pct(count)}%` : "0%",
                        background: color,
                        backgroundImage: hatch,
                        transition: animate ? "width 500ms ease" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxShadow: color === S_FAIL ? "inset 0 0 0 1px #ccc" : "none",
                      }}
                    >
                      {pct(count) >= 15 && show && (
                        <span style={{ fontSize: 10, color: textColor, fontWeight: 600 }}>{count}</span>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#888", margin: "0 0 5px 0" }}>
                  Valid: {run.validFirst.count}/{run.validFirst.total} ({validPct}%)
                </p>
                <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.55 }}>{run.changed}</p>
              </div>
            );
          })}
        </div>

        {data.runs.some((r) => r.hasFootnote) && (
          <p style={{ fontSize: 11, color: "#888", marginBottom: 24, lineHeight: 1.55 }}>
            <span aria-hidden="true" style={{ color: ORANGE, fontWeight: 600, marginRight: 4 }}>*</span>
            {data.footnote}
          </p>
        )}

        {/* Model calls table */}
        <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
              <th scope="col" style={{ textAlign: "left" as const, fontSize: 12, fontWeight: 600, color: INK, padding: "0 12px 10px 0" }}>
                Case
              </th>
              <th scope="col" style={{ textAlign: "right" as const, fontSize: 12, fontWeight: 600, color: INK, padding: "0 0 10px 12px", width: 160 }}>
                Model calls per run
              </th>
            </tr>
          </thead>
          <tbody>
            {data.modelCallsRows.map((row) => (
              <tr key={row.case} style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                <td style={{ fontSize: 13, color: row.isTotal ? INK : "#555", fontWeight: row.isTotal ? 600 : 400, padding: "10px 12px 10px 0", lineHeight: 1.4 }}>
                  {row.case}
                </td>
                <td style={{ fontSize: 13, color: row.isTotal ? INK : "#555", fontWeight: row.isTotal ? 600 : 400, textAlign: "right" as const, padding: "10px 0 10px 12px", width: 160 }}>
                  {row.calls}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: legend + stacked bar chart cards */}
      <div className="sm:hidden">
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 14, marginBottom: 12 }}>
          {[
            { color: S_PASS, hatch: undefined as string | undefined, label: data.legendPass },
            { color: S_FLAKY, hatch: FLAKY_HATCH, label: data.legendFlaky },
            { color: S_FAIL, hatch: FAIL_HATCH, label: data.legendFail },
          ].map(({ color, hatch, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  background: color,
                  backgroundImage: hatch,
                  borderRadius: 2,
                  flexShrink: 0,
                  boxShadow: color === S_FAIL ? "inset 0 0 0 1px #ccc" : "none",
                }}
              />
              <span style={{ fontSize: 11, color: "#666" }}>{label}</span>
            </div>
          ))}
        </div>

        <div ref={chartRef} role="img" aria-label={ariaLabel} style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {data.runs.map((run) => {
            const pct = (n: number) => (n / run.cases) * 100;
            const validPct = Math.round((run.validFirst.count / run.validFirst.total) * 100);
            const segments = [
              { count: run.passed, color: S_PASS, hatch: undefined as string | undefined, textColor: "white", label: "passed" },
              { count: run.flaky, color: S_FLAKY, hatch: FLAKY_HATCH, textColor: "white", label: "flaky" },
              { count: run.failed, color: S_FAIL, hatch: FAIL_HATCH, textColor: INK, label: "failed" },
            ];
            return (
              <div
                key={run.run}
                style={{
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 4,
                  padding: "12px 14px",
                  background: "#fff",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: INK,
                    margin: "0 0 2px 0",
                  }}
                >
                  {run.run}
                  {run.hasFootnote && (
                    <span
                      aria-hidden="true"
                      style={{ color: ORANGE, fontSize: 10, marginLeft: 3 }}
                    >
                      *
                    </span>
                  )}
                </p>
                <MonoTag>{run.cases} cases</MonoTag>
                <div
                  style={{
                    display: "flex",
                    height: 22,
                    borderRadius: 3,
                    overflow: "hidden",
                    marginTop: 8,
                    marginBottom: 5,
                  }}
                >
                  {segments.map(({ count, color, hatch, textColor, label }) => (
                    <div
                      key={label}
                      style={{
                        width: show ? `${pct(count)}%` : "0%",
                        background: color,
                        backgroundImage: hatch,
                        transition: animate ? "width 500ms ease" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxShadow:
                          color === S_FAIL ? "inset 0 0 0 1px #ccc" : "none",
                      }}
                    >
                      {pct(count) >= 15 && show && (
                        <span
                          style={{
                            fontSize: 10,
                            color: textColor,
                            fontWeight: 600,
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#888", margin: "0 0 5px 0" }}>
                  Valid: {run.validFirst.count}/{run.validFirst.total} ({validPct}%)
                </p>
                <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.55 }}>
                  {run.changed}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible hidden table */}
      <table className="sr-only">
        <caption>Run history</caption>
        <thead>
          <tr>
            <th scope="col">Run</th>
            <th scope="col">Cases</th>
            <th scope="col">{data.legendPass}</th>
            <th scope="col">{data.legendFlaky}</th>
            <th scope="col">{data.legendFail}</th>
            <th scope="col">Valid first attempts</th>
            <th scope="col">What changed</th>
          </tr>
        </thead>
        <tbody>
          {data.runs.map((run) => (
            <tr key={run.run}>
              <td>{run.run}</td>
              <td>{run.cases}</td>
              <td>{run.passed}</td>
              <td>{run.flaky}</td>
              <td>{run.failed}</td>
              <td>
                {run.validFirst.count} of {run.validFirst.total}
              </td>
              <td>{run.changed}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

// ── 05. What still fails ──────────────────────────────────────

function WhatStillFails({ data }: { data: EvaluationData }) {
  return (
    <div>
      <SubLabel>{data.label05}</SubLabel>

      {/* Failing group */}
      <div style={{ marginBottom: 4 }}>
        <MonoTag>{data.failingGroupLabel}</MonoTag>
      </div>

      {/* Row 1: cards 1–2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8, marginBottom: 8 }}>
        {data.failingCards.slice(0, 2).map((card, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 4,
              padding: "10px 12px",
              background: "#fff",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: INK,
                margin: "0 0 4px 0",
                lineHeight: 1.4,
              }}
            >
              {card.title}
            </p>
            <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.55 }}>
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Handwritten note before row 2 */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
          paddingLeft: 2,
        }}
      >
        <svg width="18" height="14" viewBox="0 0 18 14">
          <path
            d="M 2,2 Q 9,2 16,10"
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 13,7 L 16,11 L 12,11"
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-caveat), cursive",
            color: ORANGE,
            fontSize: 13,
          }}
        >
          {data.importantNote}
        </span>
      </div>

      {/* Row 2: cards 3–4 — orange left border */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8 }}>
        {data.failingCards.slice(2).map((card, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${CARD_BORDER}`,
              borderLeft: `3px solid ${ORANGE}`,
              borderRadius: 4,
              padding: "10px 12px",
              background: "#fff",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: INK,
                margin: "0 0 4px 0",
                lineHeight: 1.4,
              }}
            >
              {card.title}
            </p>
            <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.55 }}>
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Author note */}
      <p
        style={{
          fontSize: 12,
          color: "#888",
          marginTop: 10,
          marginBottom: 20,
          lineHeight: 1.55,
        }}
      >
        {data.authorNote}
      </p>

      {/* Flaky group (hidden for now) */}
      {false && (<>
      <div style={{ marginBottom: 4 }}>
        <MonoTag>{data.flakyGroupLabel}</MonoTag>
      </div>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", gap: 8 }}
      >
        {data.flakyDetailCards.map((card, i) => (
          <li
            key={i}
            style={{
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 4,
              padding: "10px 12px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                marginBottom: 5,
              }}
            >
              {/* Half-filled orange dot */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path d="M 5,0.5 A 4.5,4.5 0 0 0 5,9.5 Z" fill={ORANGE} />
                <circle cx="5" cy="5" r="4.5" fill="none" stroke={ORANGE} strokeWidth="0.8" />
              </svg>
              <strong style={{ fontSize: 12, color: INK, lineHeight: 1.4, fontWeight: 600 }}>
                {card.title}
              </strong>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#555",
                margin: 0,
                lineHeight: 1.55,
                paddingLeft: 17,
              }}
            >
              {card.detail}
            </p>
          </li>
        ))}
      </ul>
      </>)}
    </div>
  );
}

// ── 06. Limits ────────────────────────────────────────────────

function Limits({ data }: { data: EvaluationData }) {
  return (
    <div>
      <SubLabel>{data.label06}</SubLabel>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column" as const,
          gap: 8,
        }}
      >
        {data.limits.map((item, i) => (
          <li
            key={i}
            style={{ display: "flex", alignItems: "baseline", gap: 10 }}
          >
            <svg
              aria-hidden="true"
              width="6"
              height="6"
              viewBox="0 0 6 6"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <rect x="0" y="0" width="6" height="6" fill="#bbb" rx="1" />
            </svg>
            <span className="text-sm text-gray-800" style={{ lineHeight: 1.55 }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────

export default function EvaluationSection({ data }: { data: EvaluationData }) {
  // Dev-time assertions
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    data.runs.forEach((run) => {
      if (run.passed + run.flaky + run.failed !== run.cases) {
        console.error(
          `EvaluationSection: ${run.run} passed(${run.passed})+flaky(${run.flaky})+failed(${run.failed}) ≠ cases(${run.cases})`
        );
      }
    });
    const caseTotal = data.caseGroups.reduce((s, g) => s + g.count, 0);
    if (caseTotal !== 18) {
      console.error(
        `EvaluationSection: caseGroups sum to ${caseTotal}, expected 18`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // At-a-glance text computed from run data
  const r1 = data.runs[0];
  const rLast = data.runs[data.runs.length - 1];
  const newCases = rLast.cases - r1.cases;
  const atAGlance =
    newCases > 0 && rLast.sharedPassed !== undefined
      ? `Cases passing every run went from ${r1.passed} of ${r1.cases} in ${r1.run} to ${rLast.sharedPassed} of the same ${r1.cases} in ${rLast.run} (${rLast.passed} of ${rLast.cases} including the ${newCases} new real-excerpt cases).`
      : `Cases passing every run went from ${r1.passed} of ${r1.cases} in ${r1.run} to ${rLast.passed} of ${rLast.cases} in ${rLast.run}.`;

  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
        {data.sectionLabel}
      </h2>
      <p className="text-sm text-gray-800 leading-relaxed mb-10">{atAGlance}</p>

      <div className="flex flex-col gap-10">
        <HowItIsTested data={data} />
        {/* StatusMeaning hidden for now */}
        <RunHistory data={data} />
        <WhatStillFails data={data} />
        <Limits data={data} />
      </div>
    </section>
  );
}
