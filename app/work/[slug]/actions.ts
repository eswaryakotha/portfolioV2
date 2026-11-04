"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_MAX_AGE,
  cookieName,
  isProtected,
  passwordMatches,
  unlockToken,
} from "@/lib/caseStudyAccess";

export type UnlockState = { error: string | null };

/** Checks the password for a protected case study; on success sets the unlock cookie and
    reloads the page, which then renders the case study. */
export async function unlockCaseStudy(_prev: UnlockState, form: FormData): Promise<UnlockState> {
  const slug = String(form.get("slug") ?? "");
  const attempt = String(form.get("password") ?? "");
  if (!isProtected(slug)) return { error: "This case study is not protected." };
  const token = unlockToken(slug);
  if (!token) return { error: "This case study can't be unlocked right now." };
  if (!attempt || !passwordMatches(slug, attempt)) return { error: "That password isn't right. Try again." };
  (await cookies()).set(cookieName(slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/work/${slug}`,
    maxAge: COOKIE_MAX_AGE,
  });
  redirect(`/work/${slug}`);
}
