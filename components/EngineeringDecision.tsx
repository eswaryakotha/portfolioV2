"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";
import DecorativeQuote from "@/components/DecorativeQuote";
import type { EngineeringDecisionData } from "@/data/content";

const ORANGE = "var(--accent)";
const INK = "#2B2B2B";
const CARD_BORDER = "#e5e7eb";

function MonoLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: 12,
      color: "#999",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      margin: "0 0 6px 0",
    }}>
      {children}
    </p>
  );
}

// ── Block row for "What improved" ────────────────────────────

function BlockRow({
  count, total, fillColor, show, animate,
}: {
  count: number;
  total: number;
  fillColor: string;
  show: boolean;
  animate: boolean;
}) {
  return (
    <div
      className="grid [grid-template-columns:repeat(9,14px)] sm:[grid-template-columns:repeat(18,14px)]"
      style={{ gap: 3 }}
    >
      {Array.from({ length: total }, (_, i) => {
        const filled = i < count;
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 2,
              border: `1px solid ${show && filled ? fillColor : CARD_BORDER}`,
              background: show && filled ? fillColor : "transparent",
              transition: animate ? "background-color 0.12s ease, border-color 0.12s ease" : "none",
              transitionDelay: animate ? `${(i / (total - 1)) * 500}ms` : "0ms",
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function EngineeringDecision({ data }: { data: EngineeringDecisionData }) {
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (graphicRef.current) obs.observe(graphicRef.current);
    return () => obs.disconnect();
  }, []);

  const show = reduced || entered;
  const animate = !reduced && entered;

  const beforePct = Math.round((data.whatImproved.before.count / data.whatImproved.before.total) * 100);
  const afterPct = Math.round((data.whatImproved.after.count / data.whatImproved.after.total) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* HEADLINE — reuses DecorativeQuote, slightly larger than the other quotes */}
      <div style={{ marginTop: 4 }}>
        <DecorativeQuote text={data.headline} fontSize={22} />
      </div>

      {/* DECISION */}
      <div>
        <MonoLabel>{data.decision.label}</MonoLabel>
        <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
          {data.decision.body}
        </p>
      </div>

      {/* TRADE-OFF */}
      <div>
        <MonoLabel>{data.tradeoff.label}</MonoLabel>
        <div style={{ border: `1px solid ${CARD_BORDER}`, borderRadius: 4, padding: "12px 16px" }}>
          <ul style={{ margin: "0 0 10px 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            {data.tradeoff.items.map((item, i) => (
              <li key={i} className="text-sm" style={{ color: "#555", lineHeight: 1.55 }}>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm" style={{
            margin: 0,
            fontWeight: 600,
            color: INK,
            borderTop: `1px solid ${CARD_BORDER}`,
            paddingTop: 10,
          }}>
            {data.tradeoff.closing}
          </p>
        </div>
      </div>

      {/* REASONING — arrow on left, label + phrases on right */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <svg
          aria-hidden="true"
          width="56" height="36" viewBox="0 0 56 36"
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <path
            d="M 4,4 Q 4,28 48,30"
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M 45,27 L 49,30 L 45,33"
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div aria-describedby="eng-reasoning-desc">
          <MonoLabel>{data.reasoning.label}</MonoLabel>
          <p className="text-sm" style={{ fontWeight: 600, color: INK, margin: "0 0 8px 0", lineHeight: 1.4 }}>
            {data.reasoning.phrase1}
          </p>
          <p className="text-sm" style={{ color: "#555", margin: 0, lineHeight: 1.4 }}>
            {data.reasoning.phrase2}
          </p>
          <span id="eng-reasoning-desc" className="sr-only">
            {data.reasoning.ariaDescription}
          </span>
        </div>
      </div>

      {/* CHALLENGE */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <Lightbulb
            size={32}
            strokeWidth={1.5}
            color={ORANGE}
            style={{ flexShrink: 0, marginTop: 14 }}
          />
          <div style={{ border: `1px solid ${CARD_BORDER}`, borderRadius: 4, padding: "10px 14px", flex: 1 }}>
            <MonoLabel>{data.challenge.label}</MonoLabel>
            <p className="text-sm" style={{ color: "#555", margin: 0, lineHeight: 1.55 }}>
              {data.challenge.body}
            </p>
          </div>
        </div>
        {/* Down arrow toward "What was built" */}
        <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 4 }}>
          <svg width="10" height="20" viewBox="0 0 10 20">
            <line x1="5" y1="0" x2="5" y2="15" stroke="#d1d5db" strokeWidth="1" />
            <path d="M 2,12 L 5,16 L 8,12" fill="none" stroke="#d1d5db" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* WHAT WAS BUILT */}
      <div>
        <MonoLabel>{data.whatWasBuilt.label}</MonoLabel>
        <ul
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
          style={{ listStyle: "none", padding: 0, margin: 0, gap: 8 }}
        >
          {data.whatWasBuilt.boxes.map((box) => (
            <li
              key={box.heading}
              style={{
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: 4,
                padding: "10px 12px",
                background: "#fff",
              }}
            >
              <strong style={{ fontSize: 12, display: "block", marginBottom: 4, color: INK, lineHeight: 1.4 }}>
                {box.heading}
              </strong>
              <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.5 }}>
                {box.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* WHAT IMPROVED */}
      <div>
        <MonoLabel>{data.whatImproved.label}</MonoLabel>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 16px 0" }}>
          {data.whatImproved.caption}
        </p>

        <div
          ref={graphicRef}
          role="img"
          aria-label={data.whatImproved.ariaLabel}
        >
          {/* Before row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: "#999",
              width: 38,
              flexShrink: 0,
            }}>{data.whatImproved.before.rowLabel ?? "Before"}</span>
            <BlockRow
              count={data.whatImproved.before.count}
              total={data.whatImproved.before.total}
              fillColor="#a0a0a0"
              show={show}
              animate={animate}
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginLeft: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1 }}>
                {data.whatImproved.before.count}/{data.whatImproved.before.total}
              </span>
              <span style={{ fontSize: 11, color: "#999" }}>({beforePct}%)</span>
            </div>
          </div>

          {/* Annotation between rows */}
          {data.whatImproved.annotation && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 46, marginBottom: 8 }}>
              <svg aria-hidden="true" width="18" height="16" viewBox="0 0 18 16" style={{ flexShrink: 0 }}>
                <path d="M 9,2 Q 15,8 9,14" fill="none" stroke={ORANGE} strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 6,11 L 9,15 L 12,11" fill="none" stroke={ORANGE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 13, color: ORANGE }}>
                {data.whatImproved.annotation}
              </span>
            </div>
          )}

          {/* After row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: "#999",
              width: 38,
              flexShrink: 0,
            }}>{data.whatImproved.after.rowLabel ?? "After"}</span>
            <BlockRow
              count={data.whatImproved.after.count}
              total={data.whatImproved.after.total}
              fillColor={ORANGE}
              show={show}
              animate={animate}
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginLeft: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: ORANGE, lineHeight: 1 }}>
                {data.whatImproved.after.count}/{data.whatImproved.after.total}
              </span>
              <span style={{ fontSize: 11, color: "#999" }}>({afterPct}%)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
