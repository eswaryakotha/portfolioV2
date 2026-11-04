import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { book } from "@/data/content";

/**
 * GET /api/github: this year's GitHub contribution calendar for the book's cover, read from the
 * public calendar on the profile (no token needed). Returns
 * { year, total, cells: [week, weekday, level][], months: { label, week }[] },
 * or 503 { error: "unavailable" }. Cached for an hour (Cache Components: `use cache`).
 */

const TIMEOUT_MS = 4000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type Contributions = {
  year: number;
  total: number;
  cells: [number, number, number][];
  months: { label: string; week: number }[];
};

async function getContributions(user: string, year: number): Promise<Contributions> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });

  const url = `https://github.com/users/${encodeURIComponent(user)}/contributions?from=${year}-01-01&to=${year}-12-31`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "User-Agent": "portfolio-cover" },
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const html = await res.text();

  const cells: [number, number, number][] = [];
  const firstOfWeek = new Map<number, string>();
  for (const m of html.matchAll(/<td\b[^>]*\bclass="ContributionCalendar-day"[^>]*>/g)) {
    const tag = m[0];
    const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
    const level = Number(/data-level="([0-4])"/.exec(tag)?.[1]);
    const pos = /id="contribution-day-component-(\d+)-(\d+)"/.exec(tag);
    if (!date || !pos || Number.isNaN(level)) continue;
    const day = Number(pos[1]);
    const week = Number(pos[2]);
    cells.push([week, day, level]);
    const prev = firstOfWeek.get(week);
    if (!prev || date < prev) firstOfWeek.set(week, date);
  }
  const total = Number(
    /id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contribution/.exec(html)?.[1]?.replace(/,/g, ""),
  );
  if (cells.length < 300 || !Number.isFinite(total)) throw new Error("unexpected upstream shape");

  // a month label over the first week that holds that month's first days
  const months: Contributions["months"] = [];
  let last = -1;
  [...firstOfWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .forEach(([week, date]) => {
      const m = Number(date.slice(5, 7)) - 1;
      const d = Number(date.slice(8, 10));
      if (m !== last && (d <= 7 || week === 0)) {
        months.push({ label: MONTHS[m], week: d > 1 && week === 0 && d > 7 ? week + 1 : week });
        last = m;
      }
    });
  return { year, total, cells, months };
}

export async function GET() {
  await connection();
  try {
    const year = new Date().getFullYear();
    const data = await getContributions(book.cover.contributions.username, year);
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch (e) {
    return Response.json(
      { error: "unavailable", ...(process.env.NODE_ENV === "development" ? { detail: String(e) } : {}) },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
