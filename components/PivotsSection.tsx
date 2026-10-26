"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { PivotsData } from "@/data/content";

// Three pivots: a path of nodes over three equal cards. 900px+: horizontal path
// (SVG connectors measured from the real nodes). Below: vertical timeline.
// Entrance: when 30% visible, the path draws left to right and nodes/cards fade in
// as it reaches them. The final state is the default (no JS / reduced motion).

const BRIGHT = "var(--accent-bright, var(--accent))";
const ACCENT = "var(--accent)";
const MID = "#9CA3AF";
const SEG_MS = 500; // each connector draws in this long (1000ms in total for two)
const NODE = 56;

type Phase = "final" | "hidden" | "shown";

function Icon({ name, color }: { name: string; color: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp aria-hidden="true" size={26} strokeWidth={1.5} color={color} />;
}

function arrowHead(x: number, y: number, ang: number) {
  const arm = (d: number) => `${x - 8 * Math.cos(ang + d)} ${y - 8 * Math.sin(ang + d)}`;
  return `M ${arm(0.5)} L ${x} ${y} L ${arm(-0.5)}`;
}

function Annotation({ text, arrow }: { text: string; arrow: "left" | "down" }) {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: 4, pointerEvents: "none", userSelect: "none" }}>
      {arrow === "left" && (
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none" stroke={BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible" }}>
          <path d="M 26,3 C 16,0 6,4 3,12" />
          <path d="M 3,5 L 3,13 L 10,12" />
        </svg>
      )}
      <span
        style={{ color: BRIGHT, fontFamily: "var(--font-caveat), cursive", fontSize: 17, lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(-3deg)" }}
      >
        {text}
      </span>
    </span>
  );
}

export default function PivotsSection({ data }: { data: PivotsData }) {
  const uid = useId().replace(/:/g, "");
  const list = useRef<HTMLOListElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const callouts = useRef<(HTMLDivElement | null)[]>([]);
  const [phase, setPhase] = useState<Phase>("final");
  const [geo, setGeo] = useState<{ w: number; h: number; segs: { d: string; head: string }[] } | null>(null);

  // make the "What we learned" boxes the same height
  const equalize = useCallback(() => {
    const els = callouts.current.filter((c): c is HTMLDivElement => !!c);
    els.forEach((c) => (c.style.minHeight = ""));
    const tallest = Math.max(...els.map((c) => c.offsetHeight));
    els.forEach((c) => (c.style.minHeight = `${tallest}px`));
  }, []);

  const measure = useCallback(() => {
    equalize();
    const ol = list.current;
    if (!ol || nodes.current.some((n) => !n)) return;
    const o = ol.getBoundingClientRect();
    const pts = nodes.current.map((n) => {
      const r = n!.getBoundingClientRect();
      return { cx: r.left - o.left + r.width / 2, cy: r.top - o.top + r.height / 2 };
    });
    const r = NODE / 2 + 6;
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const x1 = pts[i].cx + r;
      const x2 = pts[i + 1].cx - r - 4;
      const y = pts[i].cy;
      const dx = (x2 - x1) * 0.35;
      // soft, slightly uneven hand-drawn curve
      const wob = i % 2 === 0 ? 7 : -6;
      const d = `M ${x1} ${y} C ${x1 + dx} ${y - wob}, ${x2 - dx} ${y + wob}, ${x2} ${y}`;
      segs.push({ d, head: arrowHead(x2, y, Math.atan2(-wob * 0.4, dx)) });
    }
    setGeo({ w: o.width, h: o.height, segs });
  }, [equalize]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const ro = new ResizeObserver(measure);
    ro.observe(ol);
    document.fonts?.ready.then(measure);

    let io: IntersectionObserver | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      setPhase("hidden");
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          setPhase("shown");
          io?.disconnect();
        },
        { threshold: 0.3 }
      );
      io.observe(ol);
    }
    return () => {
      ro.disconnect();
      io?.disconnect();
    };
  }, [measure]);

  const animated = phase !== "final";
  const hidden = phase === "hidden";
  // appear when the path reaches pivot i
  const reveal = (i: number): React.CSSProperties =>
    animated
      ? {
          opacity: hidden ? 0 : 1,
          transform: hidden ? "translateY(8px)" : "translateY(0)",
          transition: hidden ? "none" : `opacity 250ms ease ${i * SEG_MS}ms, transform 250ms ease ${i * SEG_MS}ms`,
        }
      : {};

  const n = data.pivots.length;

  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">{data.heading}</h2>

      <ol
        ref={list}
        className="relative grid grid-cols-1 min-[900px]:grid-cols-3 list-none p-0 m-0 mt-6"
        style={{ columnGap: 24, rowGap: 32 }}
      >
        {/* mobile timeline line (thin, down the left side) */}
        <span
          aria-hidden="true"
          className="min-[900px]:hidden"
          style={{
            position: "absolute",
            left: NODE / 2,
            top: NODE / 2,
            bottom: "auto",
            height: `calc(100% - ${NODE}px)`,
            width: 0,
            borderLeft: `1.5px solid ${BRIGHT}`,
            transformOrigin: "top",
            transform: hidden ? "scaleY(0)" : "scaleY(1)",
            transition: animated && !hidden ? `transform ${SEG_MS * (n - 1)}ms linear` : "none",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />

        {/* desktop path */}
        {geo && (
          <svg
            aria-hidden="true"
            focusable="false"
            className="hidden min-[900px]:block"
            width={geo.w}
            height={geo.h}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
          >
            <defs>
              {geo.segs.map((s, i) => (
                <mask id={`${uid}-m${i}`} key={i} maskUnits="userSpaceOnUse" x="-10" y="-10" width={geo.w + 20} height={geo.h + 20}>
                  <path
                    d={s.d}
                    pathLength={1}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={1}
                    strokeDashoffset={hidden ? 1 : 0}
                    style={{ transition: animated && !hidden ? `stroke-dashoffset ${SEG_MS}ms linear ${i * SEG_MS}ms` : "none" }}
                  />
                </mask>
              ))}
            </defs>
            <g fill="none" stroke={BRIGHT} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              {geo.segs.map((s, i) => {
                // 1 -> 2 is dashed; the line into the final pivot is solid
                const solid = i === geo.segs.length - 1;
                return (
                  <g key={i}>
                    {solid ? (
                      <path
                        d={s.d}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={hidden ? 1 : 0}
                        style={{ transition: animated && !hidden ? `stroke-dashoffset ${SEG_MS}ms linear ${i * SEG_MS}ms` : "none" }}
                      />
                    ) : (
                      <path d={s.d} strokeDasharray="5 5" mask={`url(#${uid}-m${i})`} />
                    )}
                    <path
                      d={s.head}
                      style={{
                        opacity: hidden ? 0 : 1,
                        transition: animated && !hidden ? `opacity 150ms ease ${(i + 1) * SEG_MS - 100}ms` : "none",
                      }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {data.pivots.map((p, i) => {
          const current = p.status === "current";
          const nodeColor = current ? "#fff" : "#6B7280";
          return (
            <li
              key={p.label}
              className="relative grid grid-cols-[56px_1fr] gap-x-4 min-[900px]:flex min-[900px]:flex-col min-[900px]:items-center min-[900px]:gap-0"
            >
              {/* node (+ desktop tag) */}
              <div className="flex flex-col items-center min-[900px]:w-full" style={reveal(i)}>
                <div
                  ref={(el) => {
                    nodes.current[i] = el;
                  }}
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    width: NODE,
                    height: NODE,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: current ? ACCENT : "#f9f9f7",
                    border: current ? `1.5px solid ${ACCENT}` : `1.5px solid ${MID}`,
                    flexShrink: 0,
                  }}
                >
                  <Icon name={p.icon} color={nodeColor} />
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: current ? "#fff" : MID,
                      border: current ? `1.5px solid ${ACCENT}` : "none",
                    }}
                  >
                    {current ? (
                      <LucideIcons.Check size={11} strokeWidth={2.5} color={ACCENT} />
                    ) : (
                      <LucideIcons.X size={11} strokeWidth={2.5} color="#fff" />
                    )}
                  </span>
                </div>
                <span
                  className="hidden min-[900px]:inline-block"
                  style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: current ? BRIGHT : "#6B7280", letterSpacing: "0.02em" }}
                >
                  {p.statusLabel}
                </span>
              </div>

              {/* card column */}
              <div className="flex flex-col min-[900px]:w-full min-[900px]:flex-1 min-[900px]:mt-4" style={reveal(i)}>
                {/* mobile tag row (carries the "we are here" note beside the current pivot) */}
                <div className="min-[900px]:hidden flex items-center gap-3 mb-2" style={{ minHeight: NODE / 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: current ? BRIGHT : "#6B7280", letterSpacing: "0.02em" }}>
                    {p.statusLabel}
                  </span>
                  {current && <Annotation text={data.note} arrow="left" />}
                </div>
                <div
                  className="flex flex-col flex-1"
                  style={{
                    padding: 24,
                    borderRadius: 4,
                    background: current ? "color-mix(in srgb, var(--accent) 5%, #fff)" : "#fff",
                    border: current ? `2px solid ${BRIGHT}` : "1px solid #E5E7EB",
                    gap: 12,
                  }}
                >
                  <p className="font-mono text-xs tracking-widest text-gray-400 uppercase" style={{ margin: 0 }}>
                    {p.label}
                  </p>
                  <h3 className="text-base font-semibold text-gray-900" style={{ margin: 0 }}>
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
                    {p.body}
                  </p>
                  <div
                    ref={(el) => {
                      callouts.current[i] = el;
                    }}
                    style={{
                      marginTop: "auto",
                      background: current ? "color-mix(in srgb, var(--accent) 4%, #fff)" : "#F5F5F4",
                      borderLeft: `3px solid ${current ? BRIGHT : MID}`,
                      padding: "10px 12px",
                    }}
                  >
                    <p className="font-mono text-gray-400 uppercase" style={{ margin: "0 0 4px", fontSize: 11, letterSpacing: "0.06em" }}>
                      {p.calloutLabel}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed" style={{ margin: 0 }}>
                      {p.calloutText}
                    </p>
                  </div>
                </div>
              </div>

              {/* mobile down arrow to the next pivot */}
              {i < n - 1 && (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="min-[900px]:hidden absolute"
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  stroke={BRIGHT}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ left: NODE / 2 - 6, top: NODE + 8, ...reveal(i + 1) }}
                >
                  <path d="M 6 1 L 6 12 M 2 8 L 6 12.5 L 10 8" />
                </svg>
              )}

              {/* desktop "we are here" beside the current node */}
              {current && (
                <div
                  aria-hidden="true"
                  className="hidden min-[900px]:block absolute"
                  style={{ left: `calc(50% + ${NODE / 2 + 12}px)`, top: NODE / 2 - 22, ...reveal(i) }}
                >
                  <Annotation text={data.note} arrow="left" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 40 }}>
        {data.closing}
      </p>
    </section>
  );
}
