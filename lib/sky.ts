import type { SkyCondition } from "@/data/content";

/** What /api/sky returns. */
export type SkyData = { condition: SkyCondition; isDay: boolean; updatedAt: string };

/** WMO weather code (as used by Open-Meteo) to the four skies the back cover can draw. */
export function conditionFromWmo(code: number): SkyCondition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly-cloudy";
  if (code === 3 || code === 45 || code === 48 || (code >= 71 && code <= 77) || code === 85 || code === 86) {
    return "cloudy";
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code === 95 || code === 96 || code === 99) {
    return "rain";
  }
  return "partly-cloudy";
}

export const SKY_CONDITIONS: SkyCondition[] = ["clear", "partly-cloudy", "cloudy", "rain"];

export function isSkyData(v: unknown): v is SkyData {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.condition === "string" &&
    (SKY_CONDITIONS as string[]).includes(o.condition) &&
    typeof o.isDay === "boolean" &&
    typeof o.updatedAt === "string"
  );
}
