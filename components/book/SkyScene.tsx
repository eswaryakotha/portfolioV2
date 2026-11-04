"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { SkyCondition } from "@/data/content";

/* The chalk sky over the back cover's sketch: inline SVG, white chalk strokes on the dark
   page. Units: 1 = 1% of the page width; the sky is W wide and `h` tall. Every path is built
   once, from a seeded random source, so the markup is the same on every render. */

const W = 100;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n: number) => n.toFixed(2);
type P = [number, number];

/** a closed, smooth path through the points (Catmull-Rom as cubic Beziers) */
function closedPath(pts: P[]) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + " Z";
}

/** a slightly bent stroke from a to b */
function stroke(a: P, b: P, r: () => number, bend = 0.04) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const mx = (a[0] + b[0]) / 2 + (r() - 0.5) * len * bend;
  const my = (a[1] + b[1]) / 2 + (r() - 0.5) * len * bend;
  return `M${f(a[0])} ${f(a[1])} Q${f(mx)} ${f(my)} ${f(b[0])} ${f(b[1])}`;
}

/* ---------- shapes ---------- */
function sunShape(cx: number, cy: number, rad: number, seed: number) {
  const r = rng(seed);
  const j = rad * 0.015 * 2;
  const ring: P[] = Array.from({ length: 14 }, (_, k) => {
    const a = (k / 14) * Math.PI * 2;
    return [cx + Math.cos(a) * rad + (r() - 0.5) * j, cy + Math.sin(a) * rad + (r() - 0.5) * j];
  });
  const rays = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2 + Math.PI / 10 + (r() - 0.5) * 0.06;
    const inner = rad * 1.38;
    const outer = rad * (k % 2 === 0 ? 1.9 : 1.62);
    return stroke(
      [cx + Math.cos(a) * inner, cy + Math.sin(a) * inner],
      [cx + Math.cos(a) * outer, cy + Math.sin(a) * outer],
      r,
    );
  });
  return { ring: closedPath(ring), rays };
}

function moonShape(cx: number, cy: number, rad: number, seed: number) {
  const r = rng(seed);
  // the crescent: the outer circle minus a second circle offset up and to the right
  const ix = cx + rad * 0.5;
  const iy = cy - rad * 0.22;
  const ir = rad * 0.86;
  const phi = Math.atan2(iy - cy, ix - cx);
  const outer: P[] = [];
  for (let k = 1; k < 72; k++) {
    const a = phi + (k / 72) * Math.PI * 2;
    const p: P = [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
    if (Math.hypot(p[0] - ix, p[1] - iy) > ir) outer.push(p);
  }
  let inner: P[] = [];
  for (let k = 0; k < 72; k++) {
    const a = phi + Math.PI + (k / 72 - 0.5) * Math.PI * 2;
    const p: P = [ix + Math.cos(a) * ir, iy + Math.sin(a) * ir];
    if (Math.hypot(p[0] - cx, p[1] - cy) < rad) inner.push(p);
  }
  const end = outer[outer.length - 1];
  if (Math.hypot(end[0] - inner[0][0], end[1] - inner[0][1]) > Math.hypot(end[0] - inner[inner.length - 1][0], end[1] - inner[inner.length - 1][1])) {
    inner = inner.reverse();
  }
  const pts = [...outer.filter((_, i) => i % 4 === 0), ...inner.filter((_, i) => i % 4 === 0)];
  const j = rad * 0.015 * 2;
  return closedPath(pts.map(([x, y]) => [x + (r() - 0.5) * j, y + (r() - 0.5) * j] as P));
}

/** a cloud: flat bottom, rounded ends, 3 or 4 round bumps on top; local box 0..w by 0..h */
function cloudShape(w: number, h: number, bumps: number, seed: number) {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 2 * 0.015 * w;
  const end = h * 0.5; // the rounded ends
  const top = h * 0.48; // where the bumps meet
  const xs: number[] = [];
  const span = w - end * 2;
  let acc = 0;
  const weights = Array.from({ length: bumps }, () => 0.8 + r() * 0.5);
  const sum = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < bumps - 1; i++) {
    acc += (weights[i] / sum) * span;
    xs.push(w - end - acc + j());
  }
  const pts: P[] = [[w - end, h], [w - end * 0.15 + j(), top + j() * 0.3], ...xs.map((x) => [x, top + j() * 0.4] as P), [end * 0.15 + j(), top + j() * 0.3], [end, h]];
  let d = `M${f(end)} ${f(h)} L${f(w - end)} ${f(h)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const rad = (Math.hypot(x1 - x0, y1 - y0) / 2) * (1.02 + r() * 0.1);
    d += ` A${f(rad)} ${f(rad)} 0 0 0 ${f(x1)} ${f(y1)}`;
  }
  return d + " Z";
}

/* ---------- the scene's parts, laid out for a sky `h` tall ---------- */
export type SkyGeometry = {
  h: number;
  sun: { cx: number; cy: number; ring: string; rays: string[] };
  moon: { cx: number; cy: number; d: string };
  stars: { x: number; y: number; dot: boolean; s: number; dur: number; delay: number }[];
  clouds: Record<"partly" | "cloudy" | "rain", Cloud[]>;
  rain: { x: number; y: number; len: number; dur: number; delay: number; fall: number; sy: number }[];
};
type Cloud = { d: string; w: number; y: number; dur: number; delay: number };

const RAIN_TILT = (15 * Math.PI) / 180;

export function buildSky({
  h,
  sunAt,
  moonAt,
  radius,
  starCount,
  rainCount,
}: {
  h: number;
  sunAt: P;
  moonAt: P;
  radius: number;
  starCount: number;
  rainCount: number;
}): SkyGeometry {
  const sun = sunShape(sunAt[0], sunAt[1], radius, 11);
  const moon = { cx: moonAt[0], cy: moonAt[1], d: moonShape(moonAt[0], moonAt[1], radius, 23) };

  const r = rng(37);
  const stars: SkyGeometry["stars"] = [];
  let guard = 0;
  while (stars.length < starCount && guard++ < 2000) {
    const x = 5 + r() * (W - 10);
    const y = 3 + r() * (h * 0.78 - 3);
    if (Math.hypot(x - moonAt[0], y - moonAt[1]) < radius * 2.3) continue;
    if (stars.some((s) => Math.hypot(s.x - x, s.y - y) < 8)) continue;
    stars.push({ x, y, dot: stars.length % 5 === 3, s: 0.9 + r() * 0.6, dur: 3 + r() * 3, delay: -r() * 6 });
  }

  let seed = 100;
  const cloud = (w: number, ch: number, bumps: number, y: number, dur: number, phase: number): Cloud => ({
    d: cloudShape(w, ch, bumps, seed++),
    w,
    y,
    dur,
    delay: -phase * dur,
  });
  const big = (s: number): [number, number] => [26 * s, 10 * s];
  const small = (s: number): [number, number] => [17 * s, 6.6 * s];
  const clouds = {
    // one passes in front of the sun or moon (at their height), one lower down
    partly: [
      cloud(...big(1), 4, sunAt[1] - 1.5, 95, 0.55),
      cloud(...small(1), 3, h * 0.6, 80, 0.15),
    ],
    cloudy: [
      cloud(...big(1.05), 4, 5, 105, 0.1),
      cloud(...small(1.1), 3, 7, 85, 0.45),
      cloud(...big(0.9), 4, 4, 98, 0.75),
      cloud(...small(1.0), 3, h * 0.36, 72, 0.25),
      cloud(...big(1.0), 4, h * 0.33, 92, 0.62),
    ],
    rain: [
      cloud(...big(1.35), 4, 2.5, 110, 0.12),
      cloud(...big(1.25), 4, 6, 104, 0.48),
      cloud(...big(1.3), 4, 3.5, 100, 0.8),
    ],
  };

  const rr = rng(53);
  const rainTop = 2.5 + 10 * 1.35 * 0.85; // just under the rain clouds' bottoms
  const rain = Array.from({ length: rainCount }, () => {
    const fall = h - rainTop + 2;
    return {
      x: 8 + rr() * (W - 12),
      y: rainTop + rr() * 3,
      len: 2.5,
      dur: 1.2 + rr() * 0.8,
      delay: -rr() * 2,
      fall,
      sy: rr() * (fall - 4), // where it rests when motion is reduced
    };
  });
  return { h, sun: { cx: sunAt[0], cy: sunAt[1], ...sun }, moon, stars, clouds, rain };
}

/* ---------- drawing ---------- */
function Clouds({ list, fill }: { list: Cloud[]; fill: string }) {
  return (
    <g className="sky-clouds">
      {list.map((c, i) => (
        <g
          key={i}
          className="sky-drift"
          style={{ "--from": `${f(-c.w - 4)}px`, "--to": `${f(W + 4)}px`, animationDuration: `${c.dur}s`, animationDelay: `${f(c.delay)}s` } as CSSProperties}
        >
          <path d={c.d} transform={`translate(0 ${f(c.y)})`} fill={fill} />
        </g>
      ))}
    </g>
  );
}

function Scene({ g, condition, isDay, fill }: { g: SkyGeometry; condition: SkyCondition; isDay: boolean; fill: string }) {
  const bodies = condition === "clear" || condition === "partly-cloudy";
  return (
    <>
      {bodies && !isDay && (
        <g className="sky-stars">
          {g.stars.map((s, i) => (
            <g key={i} transform={`translate(${f(s.x)} ${f(s.y)})`}>
              <g className="sky-twinkle" style={{ animationDuration: `${f(s.dur)}s`, animationDelay: `${f(s.delay)}s` }}>
                {s.dot ? (
                  <path d="M0 0 L0.01 0" />
                ) : (
                  <path d={`M${f(-0.8 * s.s)} 0 L${f(0.8 * s.s)} 0 M0 ${f(-0.8 * s.s)} L0 ${f(0.8 * s.s)}`} />
                )}
              </g>
            </g>
          ))}
        </g>
      )}
      {bodies && isDay && (
        <g className="sky-sun">
          <g className="sky-rays" style={{ transformOrigin: `${f(g.sun.cx)}px ${f(g.sun.cy)}px` }}>
            {g.sun.rays.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <path d={g.sun.ring} fill={fill} />
        </g>
      )}
      {bodies && !isDay && <path className="sky-moon" d={g.moon.d} fill={fill} />}
      {condition === "partly-cloudy" && <Clouds list={g.clouds.partly} fill={fill} />}
      {condition === "cloudy" && <Clouds list={g.clouds.cloudy} fill={fill} />}
      {condition === "rain" && (
        <>
          <Clouds list={g.clouds.rain} fill={fill} />
          <g className="sky-rain">
            {g.rain.map((d, i) => {
              const dx = -Math.sin(RAIN_TILT) * d.len;
              const dy = Math.cos(RAIN_TILT) * d.len;
              return (
                <path
                  key={i}
                  className="sky-drop"
                  d={`M${f(d.x)} ${f(d.y)} l${f(dx)} ${f(dy)}`}
                  style={
                    {
                      "--fx": `${f(-Math.tan(RAIN_TILT) * d.fall)}px`,
                      "--fy": `${f(d.fall)}px`,
                      "--sx": `${f(-Math.tan(RAIN_TILT) * d.sy)}px`,
                      "--sy": `${f(d.sy)}px`,
                      animationDuration: `${f(d.dur)}s`,
                      animationDelay: `${f(d.delay)}s`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </g>
        </>
      )}
    </>
  );
}

type Layer = { key: string; condition: SkyCondition; isDay: boolean; leaving: boolean };

/**
 * The sky. When the condition or the time of day changes, the new scene fades in over the old
 * one (600ms). `active`: the back cover is current and still, so the motion runs; otherwise it
 * is paused where it is.
 */
export default function SkyScene({
  geometry,
  condition,
  isDay,
  active,
  chalk,
  fill,
  heightCqw,
}: {
  geometry: SkyGeometry;
  condition: SkyCondition;
  isDay: boolean;
  active: boolean;
  chalk: string;
  fill: string; // the page colour: clouds and the moon are filled with it, to hide what is behind
  heightCqw: number;
}) {
  const key = `${condition}-${isDay ? "day" : "night"}`;
  const [layers, setLayers] = useState<Layer[]>([{ key, condition, isDay, leaving: false }]);

  useEffect(() => {
    let timer: number | undefined;
    // a new scene comes in over the old one, which then leaves
    const add = window.setTimeout(() => {
      setLayers((ls) => {
        if (ls[ls.length - 1]?.key === key) return ls;
        return [...ls.filter((l) => !l.leaving).map((l) => ({ ...l, leaving: true })), { key, condition, isDay, leaving: false }];
      });
      timer = window.setTimeout(() => setLayers((ls) => ls.filter((l) => !l.leaving)), 650);
    }, 0);
    return () => {
      window.clearTimeout(add);
      window.clearTimeout(timer);
    };
  }, [key, condition, isDay]);

  return (
    <svg
      className="sky"
      data-active={active}
      viewBox={`0 0 ${W} ${f(geometry.h)}`}
      preserveAspectRatio="xMidYMin meet"
      style={{ height: `${f(heightCqw)}cqw`, color: chalk } as CSSProperties}
      aria-hidden="true"
      focusable="false"
    >
      {layers.map((l) => (
        <g key={l.key} className={`sky-layer${l.leaving ? " is-leaving" : ""}`}>
          <Scene g={geometry} condition={l.condition} isDay={l.isDay} fill={fill} />
        </g>
      ))}
    </svg>
  );
}
