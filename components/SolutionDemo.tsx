"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import VideoFrame from "@/components/VideoFrame";
import type { SolutionDemoData } from "@/data/content";

// Solution: two video blocks, then the group expense tracking workflow as a live
// diagram. 1000px and wider: a grid with SVG connectors measured from the boxes
// (offset positions, so the entrance slide does not skew them). Below 1000px: a
// vertical flow grouped under headings, with no long connectors. The diagram animates
// once when 30% is visible (opacity, transform, stroke-dashoffset); the final state is
// the default, so it shows with reduced motion or without JavaScript.

const BRIGHT = "var(--accent-bright, var(--accent))";
const ACCENT = "var(--accent)";
const INK = "var(--board-ink)";
const LINE = "var(--board-line)";
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Diagram = SolutionDemoData["diagram"];
type Box = Diagram["boxes"][number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconFor = (name: string): React.ComponentType<any> | null => (LucideIcons as any)[name] ?? null;

function Icon({ name, size = 18, color }: { name: string; size?: number; color: string }) {
  const Comp = iconFor(name);
  return Comp ? <Comp aria-hidden="true" size={size} strokeWidth={1.5} color={color} style={{ display: "block", flexShrink: 0 }} /> : null;
}

const srOnly: React.CSSProperties = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 };

const BOX_LOOK: Record<Box["type"], { box: React.CSSProperties; icon: string }> = {
  ai: { box: { border: `1.5px solid ${BRIGHT}`, background: "color-mix(in srgb, var(--accent-bright, var(--accent)) 12%, white)" }, icon: BRIGHT },
  code: { box: { border: `1px solid ${LINE}`, background: "#fff" }, icon: INK },
  io: { box: { border: "1px solid #D1D5DB", background: "#FAFAF9" }, icon: "#4B5563" },
  eval: { box: { border: `1px dashed ${BRIGHT}`, background: "color-mix(in srgb, var(--accent) 7%, white)" }, icon: ACCENT },
};

// ── videos ──────────────────────────────────────────────────────

function Videos({ data }: { data: SolutionDemoData }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.videosSubLabel}</p>
      <div className="flex flex-col" style={{ gap: 56 }}>
        {data.videos.map((v) => (
          <div key={v.title}>
            <span
              className="font-mono uppercase text-gray-500"
              style={{ display: "inline-block", fontSize: 11, letterSpacing: "0.06em", border: `1px ${v.tagStyle === "dashed" ? "dashed #9CA3AF" : `solid ${BRIGHT}`}`, borderRadius: 4, padding: "3px 8px" }}
            >
              {v.tag}
            </span>
            <h4 className="text-gray-900" style={{ margin: "8px 0 12px", fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
              {v.title}
            </h4>
            <VideoFrame
              videoUrl={v.videoUrl}
              poster={v.poster}
              placeholderLabel={v.placeholderLabel}
              title={v.videoUrl ? v.ariaLabel : `${v.ariaLabel} (placeholder)`}
            />
            <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: "16px 0 0" }}>
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── connectors ──────────────────────────────────────────────────

type Pt = [number, number];
type Conn = { d: string; head: string };

const R = 8; // corner radius
const HEAD = 7; // arrowhead length

// polyline with rounded corners
function rounded(points: Pt[]): string {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const r = Math.min(R, Math.hypot(cx - px, cy - py) / 2, Math.hypot(nx - cx, ny - cy) / 2);
    const ax = cx - Math.sign(cx - px) * r, ay = cy - Math.sign(cy - py) * r;
    const bx = cx + Math.sign(nx - cx) * r, by = cy + Math.sign(ny - cy) * r;
    d += ` L ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
  }
  const last = points[points.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

type Rect = { left: number; top: number; right: number; bottom: number; cx: number; cy: number };

function route(f: Rect, t: Rect): Conn {
  // same row: straight across, to the right
  if (Math.abs(f.cy - t.cy) < 2 && t.left >= f.right) {
    const y = f.cy;
    return { d: rounded([[f.right, y], [t.left - HEAD, y]]), head: `M ${t.left} ${y} L ${t.left - HEAD} ${y - 4} L ${t.left - HEAD} ${y + 4} Z` };
  }
  // below: down, jog sideways in the gap if the target is not under the start
  const x1 = f.cx;
  const x2 = x1 >= t.left + 16 && x1 <= t.right - 16 ? x1 : t.cx;
  const mid = f.bottom + (t.top - f.bottom) / 2;
  const pts: Pt[] = x1 === x2 ? [[x1, f.bottom], [x2, t.top - HEAD]] : [[x1, f.bottom], [x1, mid], [x2, mid], [x2, t.top - HEAD]];
  return { d: rounded(pts), head: `M ${x2} ${t.top} L ${x2 - 4} ${t.top - HEAD} L ${x2 + 4} ${t.top - HEAD} Z` };
}

// ── diagram ─────────────────────────────────────────────────────

function Diagram({ data }: { data: Diagram }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [conns, setConns] = useState<Conn[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || wrap.offsetWidth === 0) return;
    const rect = (id: string): Rect | null => {
      const el = boxRefs.current[id];
      if (!el || el.offsetParent !== wrap) return null;
      const left = el.offsetLeft, top = el.offsetTop, w = el.offsetWidth, h = el.offsetHeight;
      return { left, top, right: left + w, bottom: top + h, cx: left + w / 2, cy: top + h / 2 };
    };
    const next: Conn[] = [];
    for (const c of data.connections) {
      const f = rect(c.from), t = rect(c.to);
      if (f && t) next.push(route(f, t));
    }
    setConns(next);
    setSize({ w: wrap.offsetWidth, h: wrap.offsetHeight });
  }, [data.connections]);

  useIsoLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    Object.values(boxRefs.current).forEach((el) => el && ro.observe(el));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  useIsoLayoutEffect(() => {
    const el = wrapRef.current;
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

  const order = [...data.boxes].sort((a, b) => a.row - b.row || a.column - b.column).map((b) => b.id);
  const boxFx = (id: string): React.CSSProperties => {
    const delay = order.indexOf(id) * 80;
    return phase === "final"
      ? {}
      : phase === "hidden"
      ? { opacity: 0, transform: "translateY(8px)" }
      : { opacity: 1, transform: "none", transition: `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms` };
  };
  const drawAt = order.length * 80 + 250;
  const lineFx: React.CSSProperties =
    phase === "hidden" ? { strokeDashoffset: 1 } : phase === "shown" ? { strokeDashoffset: 0, transition: `stroke-dashoffset 600ms ease-in-out ${drawAt}ms` } : { strokeDashoffset: 0 };
  const headFx: React.CSSProperties =
    phase === "hidden" ? { opacity: 0 } : phase === "shown" ? { opacity: 1, transition: `opacity 150ms ease ${drawAt + 450}ms` } : {};

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: "0 0 16px" }}>
        {data.intro}
      </p>

      {/* 1000px and wider: breaks out of the text column, up to 1100px, centered */}
      <div className="min-[1000px]:relative min-[1000px]:left-1/2 min-[1000px]:w-[min(880px,calc(100vw-48px))] min-[1000px]:-translate-x-1/2">
        <div
          style={{ border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9F9F7", padding: 20, ["--board-line" as string]: "#3A3A3A", ["--board-ink" as string]: "#2B2B2B" }}
        >
          <style>{`@media (min-width: 1000px) { .sd-box { grid-area: var(--ga); } .sd-wide { text-align: center; } .sd-wide .sd-head { justify-content: center; padding-left: 44px; } }`}</style>
          <span style={srOnly}>{data.srText}</span>
          <div ref={wrapRef} style={{ position: "relative" }}>
            <ol
              className="list-none p-0 m-0 grid grid-cols-1 gap-y-3 min-[1000px]:grid-cols-4 min-[1000px]:gap-x-8 min-[1000px]:gap-y-9"
            >
              {data.boxes.map((b, i) => {
                const look = BOX_LOOK[b.type];
                const newGroup = i === 0 || data.boxes[i - 1].group !== b.group;
                const group = data.groups.find((g) => g.id === b.group);
                const span = b.colSpan ?? 1;
                return (
                  <Fragment key={b.id}>
                    {newGroup && (
                      <>
                        {i > 0 && (
                          <li aria-hidden="true" className="flex justify-center min-[1000px]:hidden" style={{ height: 24 }}>
                            <svg width="12" height="24" viewBox="0 0 12 24" fill="none">
                              <path d="M 6,2 V 18" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                              <path d="M 6,23 L 2,16 H 10 Z" fill="#9CA3AF" />
                            </svg>
                          </li>
                        )}
                        <li aria-hidden="true" className="min-[1000px]:hidden font-mono text-gray-500" style={{ fontSize: 11, letterSpacing: "0.08em", marginTop: i > 0 ? 4 : 0 }}>
                          {group?.label}
                        </li>
                      </>
                    )}
                    <li
                      ref={(el) => {
                        boxRefs.current[b.id] = el;
                      }}
                      className={`sd-box${span > 1 ? " sd-wide" : ""} relative${b.type === "eval" ? " min-[1000px]:mt-6" : ""}`}
                      style={{
                        ["--ga" as string]: `${b.row} / ${b.column} / ${b.row + 1} / span ${span}`,
                        borderRadius: 6,
                        padding: "10px 12px",
                        boxSizing: "border-box",
                        ...look.box,
                        ...boxFx(b.id),
                      }}
                    >
                      <span
                        className="font-mono uppercase"
                        style={{ position: "absolute", top: 8, right: 10, fontSize: 10, letterSpacing: "0.06em", lineHeight: 1, color: "#6B7280" }}
                      >
                        {b.tag}
                      </span>
                      <div className="sd-head" style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 44 }}>
                        <Icon name={b.icon} size={16} color={look.icon} />
                        <strong style={{ fontSize: 13, lineHeight: 1.3, color: INK, fontWeight: 700 }}>{b.name}</strong>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.4, color: "#374151" }}>{b.description}</p>
                      {b.stack && (
                        <p className="font-mono" style={{ margin: "3px 0 0", fontSize: 10, lineHeight: 1.4, color: "#6B7280" }}>
                          {b.stack}
                        </p>
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ol>

            {/* connectors (desktop only) */}
            <svg
              aria-hidden="true"
              focusable="false"
              className="hidden min-[1000px]:block"
              width={size.w}
              height={size.h}
              style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }}
            >
              {conns.map((c, i) => (
                <g key={i}>
                  <path d={c.d} fill="none" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} style={lineFx} />
                  <path d={c.head} fill="#9CA3AF" style={headFx} />
                </g>
              ))}
            </svg>
          </div>
        </div>

        <ul className="list-none p-0 m-0 flex flex-wrap text-gray-500" style={{ gap: 16, marginTop: 12, fontSize: 12 }}>
          {data.legend.map((l) => (
            <li key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "2px 8px", borderRadius: 4, ...BOX_LOOK[l.type].box }}>
                <Icon name={l.icon} size={14} color={BOX_LOOK[l.type].icon} />
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.06em" }}>
                  {l.tag}
                </span>
              </span>
              {l.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SolutionDemo({ data }: { data: SolutionDemoData }) {
  return (
    <>
      <Videos data={data} />
      <Diagram data={data.diagram} />
    </>
  );
}
