"use client";

import { useEffect, useState } from "react";
import { book } from "@/data/content";
import type { Contributions } from "@/app/api/github/route";

const C = book.cover.contributions;

/** deterministic jitter, so the torn edges are the same on every render */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** a paper strip with torn top and bottom edges, as a clip-path polygon */
const TORN = (() => {
  const r = rng(7);
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = 0; x <= 100; x += 1.6 + r() * 1.4) {
    top.push(`${Math.min(x, 100).toFixed(2)}% ${(r() * 4.5).toFixed(2)}%`);
  }
  top.push(`100% ${(r() * 4.5).toFixed(2)}%`);
  for (let x = 100; x >= 0; x -= 1.6 + r() * 1.4) {
    bottom.push(`${Math.max(x, 0).toFixed(2)}% ${(100 - r() * 4.5).toFixed(2)}%`);
  }
  bottom.push(`0% ${(100 - r() * 4.5).toFixed(2)}%`);
  return `polygon(${[...top, ...bottom].join(", ")})`;
})();

/** A torn strip of paper taped near the bottom of the cover, with this year's GitHub
    contribution graph (live, from /api/github). Not shown if the data can't be loaded. */
export default function CoverContributions() {
  const [data, setData] = useState<Contributions | null>(null);

  useEffect(() => {
    const ctl = new AbortController();
    const timer = window.setTimeout(() => ctl.abort(), 6000);
    fetch("/api/github", { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Contributions | null) => {
        if (d && Array.isArray(d.cells) && typeof d.total === "number") setData(d);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      ctl.abort();
      window.clearTimeout(timer);
    };
  }, []);

  if (!data) return null;
  return (
    // the cover is one big "open the book" button, so this is decoration for it
    <div className="bk-gh" aria-hidden="true">
      <span className="bk-gh-tape bk-gh-tape-l" />
      <span className="bk-gh-tape bk-gh-tape-r" />
      <div className="bk-gh-paper" style={{ clipPath: TORN }}>
        <p className="bk-gh-head">
          <span className="bk-gh-label">
            {C.label} <span className="bk-gh-source">{C.source}</span>
          </span>
          <span className="bk-gh-total">
            {C.totalTemplate.replace("{n}", String(data.total)).replace("{year}", String(data.year))}
          </span>
        </p>
        <div className="bk-gh-months">
          {data.months.map((m) => (
            <span key={m.label} style={{ gridColumn: `${m.week + 1} / span 4` }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="bk-gh-grid">
          {data.cells.map(([w, d, l]) => (
            <i key={`${w}-${d}`} data-l={l} style={{ gridColumn: w + 1, gridRow: d + 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
