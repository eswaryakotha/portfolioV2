"use client";

/* Persistent layer for the book to case study transition. It lives in the root layout so it
   survives the navigation: the book hands it the video's rect, it flies a copy of the video
   (or the placeholder) to the hero of the case study page that registers itself, then hands
   over and removes itself. If anything goes wrong it still navigates and never stays on screen. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { book } from "@/data/content";
import "./transition.css";

const T = book.settings.transition;

export type TxSource = {
  href: string;
  /** ease the book flat, fade its chrome, finish the ribbon pull */
  flatten: () => Promise<void>;
  /** the video box as it looks now */
  measure: () => {
    rect: DOMRect;
    radius: number;
    video: HTMLVideoElement | null;
    placeholder: string;
  };
  hideSource: () => void;
  /** book scales down and fades while the overlay lifts */
  lift: () => void;
  /** put the book back if the transition stops before navigating */
  reset: () => void;
};

type TxApi = {
  run: (src: TxSource) => boolean;
  isBusy: () => boolean;
  registerHero: (el: HTMLElement) => void;
  unregisterHero: (el: HTMLElement) => void;
};

const TxContext = createContext<TxApi | null>(null);
export const useBookTransition = () => useContext(TxContext);

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const pathOf = (url: string) => {
  try {
    return new URL(url, window.location.href).pathname;
  } catch {
    return url;
  }
};
const radiusOf = (el: Element | null) =>
  el ? parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0 : 0;

/** The hero's visible box and its corner radius (the rounded element inside, if any). */
function heroBox(hero: HTMLElement) {
  const media = hero.querySelector("video")?.parentElement ?? hero;
  return { rect: hero.getBoundingClientRect(), radius: radiusOf(media) };
}

function buildOverlay(m: ReturnType<TxSource["measure"]>) {
  const root = document.createElement("div");
  root.className = "tx-overlay";
  root.setAttribute("aria-hidden", "true");
  Object.assign(root.style, {
    left: `${m.rect.left}px`,
    top: `${m.rect.top}px`,
    width: `${m.rect.width}px`,
    height: `${m.rect.height}px`,
    borderRadius: `${m.radius}px`,
  });
  const shadow = document.createElement("div");
  shadow.className = "tx-shadow";
  const clip = document.createElement("div");
  clip.className = "tx-clip";
  root.append(shadow, clip);

  let video: HTMLVideoElement | null = null;
  const src = m.video ? m.video.currentSrc || m.video.getAttribute("src") || "" : "";
  if (m.video && src) {
    // the current frame first, so there is never a blank frame while the copy loads
    const still = document.createElement("canvas");
    still.width = m.video.videoWidth || 16;
    still.height = m.video.videoHeight || 9;
    try {
      still.getContext("2d")?.drawImage(m.video, 0, 0, still.width, still.height);
    } catch {
      /* not drawable yet: the poster below shows instead */
    }
    video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    if (m.video.poster) video.poster = m.video.poster;
    video.src = src;
    video.className = "tx-video";
    const v = video;
    const show = () => v.classList.add("is-ready");
    v.addEventListener("seeked", show, { once: true });
    v.addEventListener("playing", show, { once: true });
    v.addEventListener(
      "loadedmetadata",
      () => {
        try {
          v.currentTime = m.video?.currentTime ?? 0;
        } catch {
          /* ignore */
        }
        v.play().catch(() => {});
      },
      { once: true },
    );
    clip.append(still, video);
  } else {
    clip.classList.add("is-placeholder");
    const label = document.createElement("span");
    label.textContent = m.placeholder;
    clip.append(label);
  }
  document.body.append(root);
  return { root, shadow, video };
}

export default function TransitionLayer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const hero = useRef<HTMLElement | null>(null);
  const heroWaiters = useRef<Array<(el: HTMLElement) => void>>([]);
  const finishRef = useRef<() => void>(() => {});
  const target = useRef<string | null>(null);

  const registerHero = useCallback((el: HTMLElement) => {
    hero.current = el;
    heroWaiters.current.splice(0).forEach((f) => f(el));
  }, []);
  const unregisterHero = useCallback((el: HTMLElement) => {
    if (hero.current === el) hero.current = null;
  }, []);

  const waitForHero = useCallback(
    (ms: number) =>
      new Promise<HTMLElement | null>((resolve) => {
        if (hero.current && hero.current.isConnected) return resolve(hero.current);
        const t = setTimeout(() => resolve(null), ms);
        heroWaiters.current.push((el) => {
          clearTimeout(t);
          resolve(el);
        });
      }),
    [],
  );

  const run = useCallback(
    (src: TxSource) => {
      if (busy.current) return false; // ignore new commits while one runs
      busy.current = true;
      const html = document.documentElement;
      const main = document.querySelector("main");
      let overlay: ReturnType<typeof buildOverlay> | null = null;
      let pushed = false;
      let done = false;
      const anims: Animation[] = [];

      const push = () => {
        if (pushed) return;
        pushed = true;
        target.current = pathOf(src.href);
        hero.current = null;
        router.push(src.href);
      };
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(hard);
        overlay?.root.remove();
        anims.forEach((a) => a.cancel());
        html.classList.remove("tx-pending", "tx-hero-hidden");
        heroWaiters.current = [];
        target.current = null;
        busy.current = false;
        finishRef.current = () => {};
      };
      const fail = () => {
        if (!pushed) {
          src.reset();
          push();
        }
        finish();
      };
      // never leave anything on screen
      const hard = setTimeout(() => {
        if (!pushed) push();
        finish();
      }, T.hardTimeoutMs);
      finishRef.current = finish;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      (async () => {
        try {
          if (reduced) {
            // no lift and no flight: a quick crossfade between the pages
            if (main) {
              const out = main.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: T.reducedFadeMs,
                fill: "forwards",
              });
              anims.push(out);
              await out.finished;
            }
            push();
            await waitForHero(T.heroWaitMs);
            window.scrollTo(0, 0);
            anims.forEach((a) => a.cancel());
            anims.length = 0;
            if (main) {
              await main.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.reducedFadeMs })
                .finished;
            }
            finish();
            return;
          }

          // a) flatten
          await src.flatten();

          // b) lift
          const m = src.measure();
          overlay = buildOverlay(m);
          const ov = overlay;
          await nextFrame();
          src.hideSource();
          src.lift();
          ov.root.style.willChange = "transform";
          const lift = ov.root.animate(
            [{ transform: "scale(1)" }, { transform: `scale(${T.liftScale})` }],
            { duration: T.lift, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "forwards" },
          );
          ov.shadow.animate([{ opacity: 0.35 }, { opacity: 1 }], {
            duration: T.lift,
            fill: "forwards",
          });
          await lift.finished;

          // c) navigate, with the new page's content held back (see transition.css)
          html.classList.add("tx-pending", "tx-hero-hidden");
          push();
          const heroEl = await waitForHero(T.heroWaitMs);
          window.scrollTo(0, 0);
          await nextFrame();
          await nextFrame();

          if (!heroEl || !heroEl.isConnected) {
            // no hero in time: fade the overlay out and show the page normally
            html.classList.remove("tx-pending", "tx-hero-hidden");
            await ov.root.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: T.crossfade,
              fill: "forwards",
            }).finished;
            finish();
            return;
          }

          // d) fly: re-anchor the overlay on the hero's box (same look), then animate to it
          const to = heroBox(heroEl);
          const r = m.rect;
          const s0 = T.liftScale;
          const from = {
            left: r.left - (r.width * (s0 - 1)) / 2,
            top: r.top - (r.height * (s0 - 1)) / 2,
            width: r.width * s0,
            height: r.height * s0,
          };
          const sx = from.width / to.rect.width;
          const sy = from.height / to.rect.height;
          lift.cancel();
          Object.assign(ov.root.style, {
            left: `${to.rect.left}px`,
            top: `${to.rect.top}px`,
            width: `${to.rect.width}px`,
            height: `${to.rect.height}px`,
            transformOrigin: "0 0",
          });
          const fly = ov.root.animate(
            [
              {
                transform: `translate(${from.left - to.rect.left}px, ${from.top - to.rect.top}px) scale(${sx}, ${sy})`,
                borderRadius: `${(m.radius * s0) / sx}px / ${(m.radius * s0) / sy}px`,
              },
              { transform: "none", borderRadius: `${to.radius}px` },
            ],
            { duration: T.fly, easing: T.flyEase, fill: "forwards" },
          );
          ov.shadow.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: T.fly,
            easing: T.flyEase,
            fill: "forwards",
          });

          // the rest of the page fades up from the top while the video flies
          const parent = heroEl.parentElement;
          if (parent) {
            [...parent.children]
              .filter((c) => c !== heroEl)
              .forEach((el, i) => {
                (el as HTMLElement).animate(
                  [
                    { opacity: 0, transform: "translateY(16px)" },
                    { opacity: 1, transform: "none" },
                  ],
                  {
                    duration: T.contentFade,
                    delay: i * T.contentStagger,
                    easing: "ease-out",
                    fill: "backwards",
                  },
                );
              });
          }
          html.classList.remove("tx-pending");
          await fly.finished;

          // e) hand over
          const hv = heroEl.querySelector("video");
          const sameVideo =
            !!hv &&
            !!ov.video &&
            pathOf(hv.currentSrc || hv.src) === pathOf(ov.video.currentSrc || ov.video.src);
          if (hv && ov.video && sameVideo) {
            try {
              hv.currentTime = ov.video.currentTime;
            } catch {
              /* ignore */
            }
            await Promise.race([
              new Promise((res) => hv.addEventListener("seeked", res, { once: true })),
              wait(300),
            ]);
            hv.play().catch(() => {});
            html.classList.remove("tx-hero-hidden"); // same frame: no visible change
            finish();
          } else {
            html.classList.remove("tx-hero-hidden");
            heroEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.crossfade });
            await ov.root.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: T.crossfade,
              fill: "forwards",
            }).finished;
            finish();
          }
        } catch {
          fail();
        }
      })();
      return true;
    },
    [router, waitForHero],
  );

  // if the reader ends up somewhere else, stop at once
  useEffect(() => {
    if (busy.current && target.current && pathname !== target.current && pathname !== "/") {
      finishRef.current();
    }
  }, [pathname]);

  useEffect(() => () => finishRef.current(), []);

  const api = useMemo<TxApi>(
    () => ({ run, isBusy: () => busy.current, registerHero, unregisterHero }),
    [run, registerHero, unregisterHero],
  );
  return <TxContext.Provider value={api}>{children}</TxContext.Provider>;
}
