import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { book } from "@/data/content";
import { conditionFromWmo, type SkyData } from "@/lib/sky";

/**
 * GET /api/sky: the current sky over Bengaluru, for the back cover of the homepage book.
 * Returns { condition, isDay, updatedAt }, or 503 { error: "unavailable" }.
 *
 * Caching: this project runs with Cache Components (next.config.ts), where a route's
 * `export const revalidate` and fetch's `next: { revalidate }` are replaced by `use cache`
 * with `cacheLife`. The upstream call is cached for 10 minutes (revalidate 600s) in getSky.
 */

const UPSTREAM = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 4000;

async function getSky(): Promise<SkyData> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });

  const { lat, lon } = book.backCover.location;
  const url = new URL(UPSTREAM);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "weather_code,is_day");
  url.searchParams.set("timezone", "Asia/Kolkata");

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const body: unknown = await res.json();
  const current = (body as { current?: Record<string, unknown> } | null)?.current;
  const code = current?.weather_code;
  const isDay = current?.is_day;
  if (typeof code !== "number" || !Number.isInteger(code) || (isDay !== 0 && isDay !== 1)) {
    throw new Error("unexpected upstream shape");
  }
  // a thrown error is not cached, so a failure is retried on the next request
  return { condition: conditionFromWmo(code), isDay: isDay === 1, updatedAt: new Date().toISOString() };
}

export async function GET() {
  await connection(); // answer at request time; the weather itself comes from the cache above
  try {
    const sky = await getSky();
    return Response.json(sky, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=300" },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
