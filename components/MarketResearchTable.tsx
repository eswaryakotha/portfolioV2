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

  // Short dotted curve: starts just below bottom-right of rect,
  // bows 20px outward to the right, lands ~58px below rect bottom
  const arrowPath = box
    ? `M ${box.width - 6} ${box.top + box.height + 2} Q ${box.width + 20} ${box.top + box.height + 36} ${box.width - 28} ${box.top + box.height + 58}`
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
                  fontSize: 12,
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

      {/* SVG overlay: dashed orange rect + short dotted curved arrow */}
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
            <marker id="tbl-head" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M 0,0 L 6,2.5 L 0,5 Z" fill={ORANGE} />
            </marker>
          </defs>
          {/* Highlight rectangle */}
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
          {/* Short dotted curved arrow — round dots, solid arrowhead */}
          <path
            d={arrowPath}
            stroke={ORANGE}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="1 6"
            markerEnd="url(#tbl-head)"
          />
        </svg>
      )}

      {/* Handwritten annotation — right-aligned, max 320px, right edge flush with table */}
      <div style={{ marginTop: 64, marginLeft: "auto", maxWidth: 320, textAlign: "right" }}>
        <span
          style={{
            display: "inline-block",
            color: ORANGE,
            fontFamily: "var(--font-caveat), cursive",
            fontSize: 20,
            lineHeight: 1.2,
            transform: "rotate(-2deg)",
            transformOrigin: "right center",
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
          }}
        >
          {annotationLine2}
        </p>
      </div>
    </div>
  );
}
