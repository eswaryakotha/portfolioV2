"use client";

import { useEffect, useState, useCallback } from "react";
import type { AnnotatedScreenData } from "@/data/content";

const ORANGE = "var(--accent)";
const ORANGE_70 = "color-mix(in srgb, var(--accent) 70%, transparent)";

export default function AnnotatedScreen({ screen }: { screen: AnnotatedScreenData }) {
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    setIsDebug(new URLSearchParams(window.location.search).get("debug") === "1");
  }, []);

  const handleDebugClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDebug) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const msg = `x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`;
    console.log(msg);
    const el = Object.assign(document.createElement("div"), { textContent: msg });
    Object.assign(el.style, {
      position: "fixed", top: "12px", left: "50%", transform: "translateX(-50%)",
      background: "#111", color: ORANGE, padding: "6px 14px", borderRadius: "4px",
      fontFamily: "monospace", fontSize: "13px", zIndex: "9999", pointerEvents: "none",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }, [isDebug]);

  const leftCalls = screen.callouts.filter(c => c.side === "left");
  const rightCalls = screen.callouts.filter(c => c.side === "right");
  const topCalls = screen.callouts.filter(c => c.side === "top");
  const bottomCalls = screen.callouts.filter(c => c.side === "bottom");

  const textStyle: React.CSSProperties = {
    color: "#cfcfcf",
    fontSize: 16,
    lineHeight: 1.4,
    maxWidth: 230,
    margin: 0,
  };

  return (
    <div>
      {/* Screen header — shown on all viewports */}
      {screen.header && (
        <h4
          className="pl-0 md:pl-[12.8%]"
          style={{ margin: "0 0 40px 0" }}
        >
          {screen.header.jtbd && (
            <span style={{
              display: "block",
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              marginBottom: 4,
            }}>
              {screen.header.jtbd}
            </span>
          )}
          <span className="text-sm text-gray-800 leading-relaxed" style={{ display: "block", fontWeight: 600 }}>
            {screen.header.title}
          </span>
        </h4>
      )}

      {/* ── Desktop ─────────────────────────────── */}
      <div className="hidden md:block">

        {/* Top callouts — centered over the image column */}
        {topCalls.length > 0 && (
          <div style={{ paddingLeft: "12.8%", paddingRight: "12.8%", paddingBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {topCalls.map((c, i) => (
              <p key={i} style={{ ...textStyle, textAlign: "center" }}>{c.text}</p>
            ))}
          </div>
        )}

        {/* 3-column grid: left gutter (19) | image (62) | right gutter (19) */}
        <div style={{ display: "grid", gridTemplateColumns: "12.8fr 74.4fr 12.8fr" }}>

          {/* Left gutter: text right-aligned, Y-anchored to target midpoints */}
          <div style={{ position: "relative" }}>
            {leftCalls.map((c, i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${c.target.y + c.target.h / 2}%`,
                right: 12,
                transform: "translateY(-50%)",
                textAlign: "right",
                ...textStyle,
              }}>
                {c.text}
              </div>
            ))}
          </div>

          {/* Image + SVG overlay (rects + connectors) */}
          <div style={{ position: "relative" }} onClick={handleDebugClick}>
            <img
              src={screen.image}
              alt={screen.alt}
              style={{ width: "100%", display: "block" }}
            />
            {screen.callouts.length > 0 && (
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "100%", height: "100%",
                  overflow: "visible", pointerEvents: "none",
                }}
              >
                {screen.callouts.map((c, i) => {
                  const mx = c.target.x + c.target.w / 2;
                  const my = c.target.y + c.target.h / 2;
                  return (
                    <g key={i}>
                      {/* Highlight rectangle */}
                      <rect
                        x={`${c.target.x}%`} y={`${c.target.y}%`}
                        width={`${c.target.w}%`} height={`${c.target.h}%`}
                        fill="none" stroke={ORANGE_70} strokeWidth={1}
                      />
                      {/* Connector to gutter boundary */}
                      {c.side === "right" && (
                        <line x1={`${c.target.x + c.target.w}%`} y1={`${my}%`} x2="100%" y2={`${my}%`} stroke={ORANGE_70} strokeWidth={1} />
                      )}
                      {c.side === "left" && (
                        <line x1={`${c.target.x}%`} y1={`${my}%`} x2="0%" y2={`${my}%`} stroke={ORANGE_70} strokeWidth={1} />
                      )}
                      {c.side === "top" && (
                        <line x1={`${mx}%`} y1={`${c.target.y}%`} x2={`${mx}%`} y2="0%" stroke={ORANGE_70} strokeWidth={1} />
                      )}
                      {c.side === "bottom" && (
                        <line x1={`${mx}%`} y1={`${c.target.y + c.target.h}%`} x2={`${mx}%`} y2="100%" stroke={ORANGE_70} strokeWidth={1} />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Right gutter: text left-aligned, Y-anchored to target midpoints */}
          <div style={{ position: "relative" }}>
            {rightCalls.map((c, i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${c.target.y + c.target.h / 2}%`,
                left: 12,
                transform: "translateY(-50%)",
                textAlign: "left",
                ...textStyle,
              }}>
                {c.text}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom callouts — centered under the image column */}
        {bottomCalls.length > 0 && (
          <div style={{ paddingLeft: "12.8%", paddingRight: "12.8%", paddingTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {bottomCalls.map((c, i) => (
              <p key={i} style={{ ...textStyle, textAlign: "center" }}>{c.text}</p>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile ──────────────────────────────── */}
      <div className="md:hidden">
        <div style={{ position: "relative" }}>
          <img src={screen.image} alt={screen.alt} style={{ width: "100%", display: "block" }} />
          {screen.callouts.length > 0 && (
            <>
              {/* Highlight rectangles */}
              <svg
                aria-hidden="true"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              >
                {screen.callouts.map((c, i) => (
                  <rect
                    key={i}
                    x={`${c.target.x}%`} y={`${c.target.y}%`}
                    width={`${c.target.w}%`} height={`${c.target.h}%`}
                    fill="none" stroke={ORANGE_70} strokeWidth={1}
                  />
                ))}
              </svg>
              {/* Number badges at top-left corner of each rect */}
              {screen.callouts.map((c, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: `${c.target.y}%`,
                    left: `${c.target.x}%`,
                    transform: "translate(-50%, -50%)",
                    background: ORANGE,
                    color: "#fff",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </>
          )}
        </div>
        {screen.callouts.length > 0 && (
          <ol style={{ marginTop: 16, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {screen.callouts.map((c, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "#cfcfcf", fontSize: 14, lineHeight: 1.5 }}>
                <span
                  aria-hidden="true"
                  style={{
                    background: ORANGE, color: "#fff", borderRadius: "50%",
                    width: 20, height: 20, minWidth: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, lineHeight: 1, flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                {c.text}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
