import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { protectedCaseStudies } from "@/data/content";

/* Password protection for case studies listed in protectedCaseStudies. The password comes from
   an environment variable (never from the repo): CASE_STUDY_PASSWORD_<SLUG>, for example
   CASE_STUDY_PASSWORD_VERAAI. Without it, the study stays locked. After the right password,
   an httpOnly cookie holds a signature made with the password, so changing the password locks
   everyone out again. */

const envName = (slug: string) => `CASE_STUDY_PASSWORD_${slug.replace(/[^a-z0-9]/gi, "_").toUpperCase()}`;
export const cookieName = (slug: string) => `cs-unlock-${slug}`;
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const isProtected = (slug: string) => protectedCaseStudies.includes(slug);

function passwordFor(slug: string): string | null {
  const pw = process.env[envName(slug)];
  return pw && pw.length > 0 ? pw : null;
}

export function unlockToken(slug: string): string | null {
  const pw = passwordFor(slug);
  return pw ? createHmac("sha256", pw).update(`unlock:${slug}`).digest("hex") : null;
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(slug: string, attempt: string): boolean {
  const pw = passwordFor(slug);
  return !!pw && same(createHmac("sha256", "cmp").update(pw).digest("hex"), createHmac("sha256", "cmp").update(attempt).digest("hex"));
}

/** Whether this visitor has unlocked the study (always true for unprotected ones). */
export async function isUnlocked(slug: string): Promise<boolean> {
  if (!isProtected(slug)) return true;
  const token = unlockToken(slug);
  if (!token) return false;
  const got = (await cookies()).get(cookieName(slug))?.value;
  return !!got && same(got, token);
}
