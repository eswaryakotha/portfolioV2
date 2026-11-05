"use client";

import { useActionState, useEffect, useId } from "react";
import { Lock } from "lucide-react";
import { passwordNotes } from "@/data/content";
import { unlockCaseStudy, type UnlockState } from "@/app/work/[slug]/actions";
import BackToBook from "@/components/transition/BackToBook";
import { useBookTransition } from "@/components/transition/TransitionLayer";

/** Shown instead of a protected case study until the password is entered. */
export default function PasswordGate({ slug, name }: { slug: string; name: string }) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockCaseStudy, { error: null });
  const id = useId();
  const tx = useBookTransition();

  // arriving from the book: there is no hero here for the video to land on, so let it go now
  useEffect(() => {
    tx?.noHero();
  }, [tx]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <BackToBook slug={slug} />
      <div className="mx-auto mt-20 max-w-sm text-center">
        <span className="mx-auto mb-5 grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700">
          <Lock aria-hidden="true" size={18} strokeWidth={1.5} />
        </span>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{name}</p>
        <h1 className="mt-2 text-xl font-semibold text-gray-900">This case study is password protected</h1>
        {passwordNotes[slug] && (
          <p className="mt-3 text-sm leading-relaxed text-gray-700">{passwordNotes[slug]}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">Enter the password to view it.</p>
        <form action={action} className="mt-6 flex flex-col gap-3 text-left">
          <input type="hidden" name="slug" value={slug} />
          <label htmlFor={`${id}-pw`} className="font-mono text-xs uppercase tracking-widest text-gray-500">
            Password
          </label>
          <input
            id={`${id}-pw`}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? `${id}-err` : undefined}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus-visible:border-gray-900 focus-visible:ring-1 focus-visible:ring-gray-900"
          />
          <p id={`${id}-err`} role="alert" className="min-h-5 text-sm text-red-700">
            {state.error}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-60"
          >
            {pending ? "Checking..." : "View case study"}
          </button>
        </form>
      </div>
    </div>
  );
}
