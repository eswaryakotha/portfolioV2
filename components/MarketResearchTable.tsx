"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { ProductTableRow } from "@/data/content";

const ORANGE = "#E07B39";

type Box = { top: number; height: number; width: number };

export default function MarketResearchTable({
  headers,
  rows,
  annotationLine1,
  annotationLine2,
}: {
  headers: string[];
  rows: ProductTableRow[];
  annotationLine1: string;
  annotationLine2: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startRowRef = useRef<HTMLTableRowElement>(null);
  const endRowRef = useRef<HTMLTableRowElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  const measure = useCallback(() => {
    if (!containerRef.current || !startRowRef.current || !endRowRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();
    const r1 = startRowRef.current.getBoundingClientRect();
    const r2 = endRowRef.current.getBoundingClientRect();
    const p = 5;
    setBox({
      top: r1.top - cr.top - p,
      height: r2.bottom - r1.top + p * 2,
      width: cr.width,
    });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Arrow: from right edge of rect, sweeping left-down toward annotation
  const arrowPath = box
    ? `M ${box.width - 6} ${box.top + box.height * 0.55} Q ${box.width * 0.82} ${box.top + box.height + 36} ${box.width * 0.22} ${box.top + box.height + 54}`
    : "";

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Scrollable table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 520 }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: "left",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#6B7280",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "8px 12px",
                  borderTop: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                ref={i === 3 ? startRowRef : i === 4 ? endRowRef : undefined}
              >
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB", color: "#111", fontWeight: 500 }}>
                  {row.tool}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB", color: "#374151" }}>
                  {row.coreFeature}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB", color: "#374151" }}>
                  {row.useInProduction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SVG overlay: dashed orange rect around rows 4–5 + curved arrow toward annotation */}
      {box && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: box.width,
            height: box.top + box.height,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker id="tbl-head" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M 0,0 L 7,3 L 0,6 Z" fill={ORANGE} />
            </marker>
          </defs>
          {/* Highlight rectangle — dashed for hand-drawn feel */}
          <rect
            x={2}
            y={box.top}
            width={box.width - 4}
            height={box.height}
            fill="none"
            stroke={ORANGE}
            strokeWidth={1.5}
            rx={5}
            strokeDasharray="6 3"
          />
          {/* Curved arrow from right edge of rect down to annotation */}
          <path
            d={arrowPath}
            stroke={ORANGE}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#tbl-head)"
          />
        </svg>
      )}

      {/* Handwritten annotation below table */}
      <div style={{ marginTop: 64, paddingLeft: 4 }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            color: ORANGE,
            fontFamily: "var(--font-caveat), cursive",
            fontSize: 20,
            lineHeight: 1.2,
            transform: "rotate(-2deg)",
            transformOrigin: "left center",
          }}
        >
          {annotationLine1}
        </span>
        <p
          style={{
            color: ORANGE,
            fontFamily: "var(--font-caveat), cursive",
            fontSize: 15,
            lineHeight: 1.4,
            marginTop: 4,
            maxWidth: 380,
          }}
        >
          {annotationLine2}
        </p>
      </div>
    </div>
  );
}
