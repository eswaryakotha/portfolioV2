"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { book } from "@/data/content";

const S = book.settings;
const FADE_MS = 200; // the crossfade to a case study
const isPhone = () => !window.matchMedia(S.desktopOnlyQuery).matches;

/** The phone page's small behaviours, in phone mode only (the page is hidden elsewhere):
    - blocks fade up 12px the first time they scroll into view (not with reduced motion)
    - /#metamint scrolls to that card and outlines it in its colour for a moment
    - "View case study" fades the page out over 200ms, then navigates
    - the playground clips load their first frame (phone mode only) */
export default function PhoneEffects() {
  const ref = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // the playground clips: show a first frame on phones (the hidden page loads nothing elsewhere)
  useEffect(() => {
    if (!isPhone()) return;
    ref.current
      ?.closest(".ph-home")
      ?.querySelectorAll<HTMLVideoElement>(".ph-pg-videos video")
      .forEach((v) => {
        v.preload = "metadata";
      });
  }, []);

  // fade up on first view
  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>(".ph-home");
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (!seen.has(el)) {
            seen.add(el);
            // on screen already when the page loads: leave it as it is
            if (e.isIntersecting || !isPhone()) {
              io.unobserve(el);
              continue;
            }
            el.dataset.reveal = "wait";
            continue;
          }
          if (e.isIntersecting) {
            el.dataset.reveal = "in";
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12 },
    );
    root.querySelectorAll(".ph-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // the hash: scroll to the card and flash its outline
  useEffect(() => {
    const flash = () => {
      if (!isPhone()) return; // the book owns the hash on desktop
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = ref.current?.closest(".ph-home")?.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);
      if (!el) return;
      el.dataset.reveal = "in";
      el.scrollIntoView({ block: "start" });
      el.classList.remove("is-flash");
      void el.offsetWidth; // restart the animation
      el.classList.add("is-flash");
      window.setTimeout(() => el.classList.remove("is-flash"), 1300);
    };
    flash();
    window.addEventListener("hashchange", flash);
    return () => window.removeEventListener("hashchange", flash);
  }, []);

  // crossfade out to a case study
  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>(".ph-home");
    if (!root) return;
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-ph-nav]");
      if (!a || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // plain link
      e.preventDefault();
      const href = a.getAttribute("href") ?? "/";
      root.classList.add("is-leaving");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => router.push(href), FADE_MS);
    };
    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    };
  }, [router]);

  // back on the homepage (it stays mounted between pages, or comes back from the back-forward
  // cache): fully visible again
  useEffect(() => {
    const show = () => ref.current?.closest(".ph-home")?.classList.remove("is-leaving");
    if (pathname === "/") show();
    window.addEventListener("pageshow", show);
    return () => window.removeEventListener("pageshow", show);
  }, [pathname]);

  return <span ref={ref} hidden />;
}
