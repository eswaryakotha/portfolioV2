"use client";

import { useEffect, useRef, useState } from "react";
import type { SkyCondition } from "@/data/content";
import { isSkyData, SKY_CONDITIONS } from "@/lib/sky";

export type Sky = { condition: SkyCondition; isDay: boolean };

const TIMEOUT_MS = 4000;

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
 * data is older than `refreshMinutes`. Returns null until live data arrives, and stays null if
 * the fetch fails (the back cover is then left blank); a later refresh can still fill it in.
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
  const fetchedAt = useRef(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!opened) return;
    const stale = Date.now() - fetchedAt.current > refreshMinutes * 60_000;
    // the first time the book opens, and later whenever the last spread shows stale data
    if (fetchedAt.current !== 0 && !(current && stale)) return;
    if (inFlight.current) return;
    inFlight.current = true;
    const ctl = new AbortController();
    const timer = window.setTimeout(() => ctl.abort(), TIMEOUT_MS);
    const override = readOverride();
    fetch("/api/sky", { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => {
        fetchedAt.current = Date.now();
        if (!isSkyData(data)) throw new Error("bad data");
        setSky({ condition: data.condition, isDay: data.isDay, ...override });
      })
      .catch(() => {
        // keep whatever live sky we already had; with none, the page stays blank
        fetchedAt.current = fetchedAt.current || Date.now();
      })
      .finally(() => {
        window.clearTimeout(timer);
        inFlight.current = false;
      });
  }, [opened, current, refreshMinutes]);

  return sky;
}
