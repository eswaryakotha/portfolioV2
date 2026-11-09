"use client";

import { useEffect, useRef, useState } from "react";
import type { SkyCondition } from "@/data/content";
import { isSkyData, SKY_CONDITIONS } from "@/lib/sky";

export type Sky = { condition: SkyCondition; isDay: boolean };

// generous enough for a cold serverless start plus the upstream call (itself capped at 4s)
const TIMEOUT_MS = 8000;
// when there is no live sky yet, a failed fetch is retried after these delays
const RETRY_DELAYS_MS = [2000, 5000, 10000];

/** ?sky=clear|partly-cloudy|cloudy|rain and ?phase=day|night on the page URL override the sky. */
function readOverride(): Partial<Sky> {
  const q = new URLSearchParams(window.location.search);
  const out: Partial<Sky> = {};
  const sky = q.get("sky");
  if (sky && (SKY_CONDITIONS as string[]).includes(sky)) out.condition = sky as SkyCondition;
  const phase = q.get("phase");
  if (phase === "day") out.isDay = true;
  if (phase === "night") out.isDay = false;
  return out;
}

/**
 * The current sky over Bengaluru, for the back cover. Fetched once when the book first opens
 * (so it is ready by the last spread), and again when the last spread becomes current if the
 * data is older than `refreshMinutes`. Returns null until live data arrives. If a fetch fails
 * before any live sky has arrived, it is retried a few times after short delays
 * (RETRY_DELAYS_MS); if those fail too, the back cover stays blank until the next refresh.
 */
export function useSky({
  opened,
  current,
  refreshMinutes,
}: {
  opened: boolean; // the book has been opened at least once
  current: boolean; // the back cover's spread is current
  refreshMinutes: number;
}): Sky | null {
  const [sky, setSky] = useState<Sky | null>(null);
  const [retryTick, setRetryTick] = useState(0); // bumped to re-run the fetch effect for a retry
  const fetchedAt = useRef(0);
  const inFlight = useRef(false);
  const hasSky = useRef(false);
  const retries = useRef(0);
  const retryTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(retryTimer.current), []);

  useEffect(() => {
    if (!opened) return;
    const stale = Date.now() - fetchedAt.current > refreshMinutes * 60_000;
    // the first time the book opens (or a retry of it), and later whenever the last spread
    // shows stale data
    if (fetchedAt.current !== 0 && !(current && stale)) return;
    if (inFlight.current) return;
    inFlight.current = true;
    const ctl = new AbortController();
    const timer = window.setTimeout(() => ctl.abort(), TIMEOUT_MS);
    const override = readOverride();
    fetch("/api/sky", { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => {
        if (!isSkyData(data)) throw new Error("bad data");
        fetchedAt.current = Date.now();
        hasSky.current = true;
        setSky({ condition: data.condition, isDay: data.isDay, ...override });
      })
      .catch(() => {
        if (!hasSky.current && retries.current < RETRY_DELAYS_MS.length) {
          // no live sky yet: leave fetchedAt at 0 so the effect fetches again, and retry soon
          const delay = RETRY_DELAYS_MS[retries.current++];
          retryTimer.current = window.setTimeout(() => setRetryTick((n) => n + 1), delay);
          return;
        }
        // keep whatever live sky we already had; with none, the page stays blank
        fetchedAt.current = fetchedAt.current || Date.now();
      })
      .finally(() => {
        window.clearTimeout(timer);
        inFlight.current = false;
      });
  }, [opened, current, refreshMinutes, retryTick]);

  return sky;
}
