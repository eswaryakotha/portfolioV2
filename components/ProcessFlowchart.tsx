"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProcessFlowchartData } from "@/data/content";
import CurrentProcessLabel from "@/components/CurrentProcessLabel";

// Live HTML boxes in a CSS grid with an SVG connector overlay. Connectors are
// measured from the real boxes (refs + ResizeObserver), so they stay attached
// when the layout changes.

const STROKE = "var(--accent-bright, var(--accent))";
const R = 10; // corner radius for the loop-back and branch arrows
const LOOP_RISE = 26; // how far the loop-back climbs above the main row

type Box = { l: number; r: number; t: number; b: number; cx: number; cy: number };

function head(x: number, y: number, dir: "right" | "down") {
  const a = dir === "right" ? 0 : Math.PI / 2;
  const arm = (d: number) =>
    `${x - 8 * Math.cos(a + d)} ${y - 8 * Math.sin(a + d)}`;
  return `M ${arm(0.5)} L ${x} ${y} L ${arm(-0.5)}`;
}

export default function ProcessFlowchart({ data }: { data: ProcessFlowchartData }) {
  const box = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const branch = useRef<HTMLDivElement | null>(null);
  const [paths, setPaths] = useState<{ lines: string[]; heads: string[]; w: number; h: number } | null>(null);

  const measure = useCallback(() => {
    const wrap = box.current;
    const bEl = branch.current;
    if (!wrap || !bEl || cells.current.some((c) => !c)) return;
    const o = wrap.getBoundingClientRect();
    const rect = (el: HTMLElement): Box => {
      const r = el.getBoundingClientRect();
      const l = r.left - o.left;
      const t = r.top - o.top;
      return { l, r: l + r.width, t, b: t + r.height, cx: l + r.width / 2, cy: t + r.height / 2 };
    };
    const m = cells.current.map((c) => rect(c!));
    const br = rect(bEl);
    const lines: string[] = [];
    const heads: string[] = [];

    // main row: box i -> box i+1
    for (let i = 0; i < m.length - 1; i++) {
      lines.push(`M ${m[i].r} ${m[i].cy} L ${m[i + 1].l} ${m[i].cy}`);
      heads.push(head(m[i + 1].l, m[i].cy, "right"));
    }

    // loop-back: top of `from` up, over, and down into the top of `to`
    const f = m[data.loop.from];
    const to = m[data.loop.to];
    const y = f.t - LOOP_RISE;
    lines.push(
      `M ${f.cx} ${f.t} L ${f.cx} ${y + R} Q ${f.cx} ${y} ${f.cx - R} ${y} ` +
        `L ${to.cx + R} ${y} Q ${to.cx} ${y} ${to.cx} ${y + R} L ${to.cx} ${to.t}`
    );
    heads.push(head(to.cx, to.t, "down"));

    // branch: straight down from the bottom of `from` to the branch box
    lines.push(`M ${f.cx} ${f.b} L ${f.cx} ${br.t}`);
    heads.push(head(f.cx, br.t, "down"));

    // elbow: right from the branch box, up, then right into the left of `rejoin`
    const rj = m[data.branch.rejoin];
    const gx = (m[data.branch.rejoin - 1].r + rj.l) / 2;
    lines.push(
      `M ${br.r} ${br.cy} L ${gx - R} ${br.cy} Q ${gx} ${br.cy} ${gx} ${br.cy - R} ` +
        `L ${gx} ${rj.cy + R} Q ${gx} ${rj.cy} ${gx + R} ${rj.cy} L ${rj.l} ${rj.cy}`
    );
    heads.push(head(rj.l, rj.cy, "right"));

    setPaths({ lines, heads, w: o.width, h: o.height });
  }, [data]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const wrap = box.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    cells.current.forEach((c) => c && ro.observe(c));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const boxStyle: React.CSSProperties = {
    border: `1px solid ${STROKE}`,
    background: "#F5F0E6",
    borderRadius: 4,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 1.45,
    color: "#374151",
  };

  const n = data.steps.length;

  return (
    <div style={{ marginTop: 32, marginBottom: 24 }}>
      {/* breaks out of the text column, up to 1100px wide; scrolls on narrow screens */}
      <div
        style={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1100px, 100vw - 32px)",
          overflowX: "auto",
        }}
      >
        {/* label sits left-aligned with the chart, arrow curving down toward box 1 */}
        <div style={{ minWidth: 960 }}>
          <CurrentProcessLabel color={STROKE} arrow="down" note={data.note} />
        </div>
        <div style={{ height: 40 + LOOP_RISE - 32 + 6 }} aria-hidden="true" />
        <div
          ref={box}
          style={{
            position: "relative",
            minWidth: 960,
            display: "grid",
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
            columnGap: 24,
            rowGap: 56,
          }}
        >
          <ol style={{ display: "contents", listStyle: "none", margin: 0, padding: 0 }}>
            {data.steps.map((paras, i) => (
              <li
                key={i}
                ref={(el) => {
                  cells.current[i] = el as unknown as HTMLDivElement;
                }}
                style={{ ...boxStyle, gridRow: 1, gridColumn: i + 1 }}
              >
                {paras.map((p, j) => (
                  <p key={j} style={{ margin: 0 }}>
                    {p}
                  </p>
                ))}
              </li>
            ))}
          </ol>
          <div
            ref={branch}
            style={{ ...boxStyle, gridRow: 2, gridColumn: data.loop.from + 1 }}
          >
            <p style={{ margin: 0 }}>{data.branch.text}</p>
          </div>

          {paths && (
            <svg
              aria-hidden="true"
              focusable="false"
              width={paths.w}
              height={paths.h}
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
            >
              <g fill="none" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                {paths.lines.map((d, i) => (
                  <path key={`l${i}`} d={d} />
                ))}
                {paths.heads.map((d, i) => (
                  <path key={`h${i}`} d={d} />
                ))}
              </g>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
