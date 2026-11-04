"use client";

/* Persistent layer for the book to case study transition, both ways. It lives in the root
   layout so it survives the navigation.
   Forward (run): the book hands it the video's rect, it flies a copy of the video (or the
   placeholder) to the hero of the case study page that registers itself, then hands over.
   Reverse (runReverse, "Back to Book"): it flies a copy of the hero back into the video slot of
   that project's spread. The pending hand over is kept here and in sessionStorage, so the book
   can read it on its very first render and arrive already open, flat and receded; the book
   then tells the layer where the slot is (bookReady), takes the video over and settles.
   Either way, if anything goes wrong it still navigates and never stays on screen. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { book } from "@/data/content";
import "./transition.css";

const T = book.settings.transition;
const R = T.reverse;
const ARRIVAL_KEY = "bk-arrival";

/** A hand over back into the book, waiting for the book to arrive. fly: false arrives
    without a flying video (the book just fades and grows in). */
export type Arrival = {
  direction: "reverse";
  slug: string;
  fly: boolean;
  reduced: boolean;
  startedAt: number;
  rect?: { left: number; top: number; width: number; height: number };
  radius?: number;
  src?: string;
  time?: number;
};

/** What the book gives the layer once it is open, receded and measurable. */
export type BookArrivalHandle = {
  /** the slot's box, on the receded book */
  measureSlot: () => { rect: DOMRect; radius: number } | null;
  /** show the real slot (video at `time`, or its placeholder) under the overlay */
  handover: (time: number | null) => void;
  /** grow back to rest, chrome in, input back; resolves when done */
  settle: () => Promise<void>;
};

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
  /** "Back to Book" from a case study; false if a transition is already running */
  runReverse: (opts: { href: string; slug: string; placeholder: string }) => boolean;
  isBusy: () => boolean;
  registerHero: (el: HTMLElement) => void;
  unregisterHero: (el: HTMLElement) => void;
  /** the page has no hero (for example a password page): a waiting flight lets go at once */
  noHero: () => void;
  /** the pending hand over back into the book, if any (read on the book's first render) */
  readArrival: () => Arrival | null;
  /** the path shown before the current one (to tell an arrival from a case study) */
  previousPath: () => string | null;
  /** the book is open, receded and measurable */
  bookReady: (h: BookArrivalHandle) => void;
  /** the arrival is over: forget it */
  endArrival: () => void;
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

function readStoredArrival(): Arrival | null {
  try {
    const raw = window.sessionStorage.getItem(ARRIVAL_KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Arrival;
    if (a?.direction !== "reverse" || typeof a.slug !== "string") return null;
    return a;
  } catch {
    return null;
  }
}

export default function TransitionLayer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const arrival = useRef<Arrival | null>(null);
  const bookWaiter = useRef<((h: BookArrivalHandle) => void) | null>(null);
  const shownPath = useRef<string | null>(null);
  const prevPath = useRef<string | null>(null);
  const hero = useRef<HTMLElement | null>(null);
  const heroWaiters = useRef<Array<(el: HTMLElement) => void>>([]);
  const noHeroWaiters = useRef<Array<() => void>>([]);
  const finishRef = useRef<() => void>(() => {});
  const target = useRef<string | null>(null);

  const registerHero = useCallback((el: HTMLElement) => {
    hero.current = el;
    heroWaiters.current.splice(0).forEach((f) => f(el));
  }, []);
  const unregisterHero = useCallback((el: HTMLElement) => {
    if (hero.current === el) hero.current = null;
  }, []);
  const noHero = useCallback(() => {
    noHeroWaiters.current.splice(0).forEach((f) => f());
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
        noHeroWaiters.current.push(() => {
          clearTimeout(t);
          resolve(null);
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
        noHeroWaiters.current = [];
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

  const endArrival = useCallback(() => {
    arrival.current = null;
    try {
      window.sessionStorage.removeItem(ARRIVAL_KEY);
    } catch {
      /* storage blocked */
    }
  }, []);

  const readArrival = useCallback(() => {
    const a = arrival.current ?? readStoredArrival();
    if (!a) return null;
    if (Date.now() - a.startedAt > R.maxAgeMs) {
      endArrival();
      return null;
    }
    return a;
  }, [endArrival]);

  const bookReady = useCallback((h: BookArrivalHandle) => {
    const w = bookWaiter.current;
    bookWaiter.current = null;
    if (w) w(h);
    else void h.settle(); // nothing is flying: just come to rest
  }, []);

  const runReverse = useCallback(
    ({ href, slug, placeholder }: { href: string; slug: string; placeholder: string }) => {
      if (busy.current) return false;
      busy.current = true;
      const html = document.documentElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // the case study's hero on screen (pages kept alive in the background are display: none)
      const heroEl =
        [...document.querySelectorAll<HTMLElement>("[data-hero-media]")].find(
          (el) => el.getClientRects().length > 0,
        ) ?? null;
      const anims: Animation[] = [];
      let overlay: ReturnType<typeof buildOverlay> | null = null;
      let pushed = false;
      let done = false;

      const store = (a: Arrival) => {
        arrival.current = a;
        try {
          window.sessionStorage.setItem(ARRIVAL_KEY, JSON.stringify(a));
        } catch {
          /* storage blocked: the ref above still carries it */
        }
      };
      const push = () => {
        if (pushed) return;
        pushed = true;
        target.current = "/";
        router.push(href);
        window.scrollTo(0, 0);
      };
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(hard);
        bookWaiter.current = null;
        overlay?.root.remove();
        anims.forEach((a) => a.cancel()); // the case study (kept alive, hidden) looks normal again
        if (heroEl) heroEl.style.visibility = "";
        html.classList.remove("tx-lock");
        target.current = null;
        busy.current = false;
        finishRef.current = () => {};
      };
      const hard = setTimeout(() => {
        if (!pushed) push();
        endArrival();
        finish();
      }, T.hardTimeoutMs);
      finishRef.current = finish;

      /** fade the page out from the bottom up (everything but the hero and the header) */
      const fadePage = (skip: Element | null) => {
        const root = (heroEl?.parentElement ?? document.querySelector("main > *")) as HTMLElement | null;
        const els = [
          ...(root ? [...root.children].filter((c) => c !== skip) : []),
          ...[document.querySelector("body > footer")].filter(Boolean),
        ].reverse() as HTMLElement[];
        const list = els.map((el, i) =>
          el.animate(
            [
              { opacity: 1, transform: "none" },
              { opacity: 0, transform: `translateY(${R.contentSlidePx}px)` },
            ],
            {
              duration: R.contentFade,
              delay: i * R.contentStagger,
              easing: "ease-in",
              fill: "forwards",
            },
          ),
        );
        anims.push(...list);
        return Promise.all(list.map((a) => a.finished)).then(() => undefined);
      };

      (async () => {
        try {
          html.classList.add("tx-lock");
          const startedAt = Date.now();

          if (reduced) {
            // no flight, no slide: the page fades out and the book fades in (200ms each)
            store({ direction: "reverse", slug, fly: false, reduced: true, startedAt });
            const main = document.querySelector("main");
            if (main) {
              const out = main.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: T.reducedFadeMs,
                fill: "forwards",
              });
              anims.push(out);
              await out.finished;
            }
            push();
            await nextFrame();
            await nextFrame();
            finish(); // the book fades itself in from here
            return;
          }

          // fly only from a hero that is mostly on screen
          const box = heroEl ? heroBox(heroEl) : null;
          const visible = box
            ? Math.max(0, Math.min(box.rect.bottom, window.innerHeight) - Math.max(box.rect.top, 0)) /
              Math.max(1, box.rect.height)
            : 0;
          if (!heroEl || !box || visible < R.minVisible) {
            store({ direction: "reverse", slug, fly: false, reduced: false, startedAt });
            await fadePage(null);
            push();
            await nextFrame();
            finish();
            return;
          }

          // a) the overlay over the hero: the same video (shown at once), or the stand-in
          const heroVideo = heroEl.querySelector("video");
          overlay = buildOverlay({ rect: box.rect, radius: box.radius, video: heroVideo, placeholder });
          const ov = overlay;
          if (!heroVideo) {
            const fadeIn = ov.root.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: R.overlayFadeIn,
              fill: "backwards",
            });
            await fadeIn.finished;
          } else {
            await nextFrame();
          }
          heroEl.style.visibility = "hidden";
          store({
            direction: "reverse",
            slug,
            fly: true,
            reduced: false,
            startedAt,
            rect: { left: box.rect.left, top: box.rect.top, width: box.rect.width, height: box.rect.height },
            radius: box.radius,
            src: heroVideo ? heroVideo.currentSrc || heroVideo.src : undefined,
            time: heroVideo?.currentTime,
          });

          // b) the page fades out, then c) navigate; the overlay stays (it lives in <body>)
          const ready = new Promise<BookArrivalHandle | null>((resolve) => {
            bookWaiter.current = resolve;
            setTimeout(() => resolve(null), R.contentFade + R.readyTimeoutMs + 600);
          });
          await fadePage(heroEl);
          push();

          // d) the book arrives receded and tells us where the slot is
          const handle = await ready;
          const slot = handle?.measureSlot() ?? null;
          if (!handle || !slot) {
            await ov.root.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: T.crossfade,
              fill: "forwards",
            }).finished;
            if (handle) {
              handle.handover(null);
              await handle.settle();
            }
            finish();
            return;
          }

          // e) fly from the hero's box to the slot's (same technique as the forward fly)
          const to = slot;
          const from = box.rect;
          const sx = from.width / to.rect.width;
          const sy = from.height / to.rect.height;
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
                borderRadius: `${box.radius / sx}px / ${box.radius / sy}px`,
              },
              { transform: "none", borderRadius: `${to.radius}px` },
            ],
            { duration: R.fly, easing: T.flyEase, fill: "forwards" },
          );
          anims.push(fly);
          await fly.finished;
          if (process.env.NODE_ENV !== "production") {
            const a = ov.root.getBoundingClientRect();
            const b = handle.measureSlot()?.rect;
            if (b) {
              (window as unknown as { __txLanding?: object }).__txLanding = {
                dx: +(a.left - b.left).toFixed(2),
                dy: +(a.top - b.top).toFixed(2),
                dw: +(a.width - b.width).toFixed(2),
                dh: +(a.height - b.height).toFixed(2),
              };
            }
          }

          // f) hand over: the same video at the same time, then the overlay goes
          handle.handover(ov.video ? ov.video.currentTime : null);
          if (ov.video) {
            await nextFrame();
            ov.root.remove();
          } else {
            await ov.root.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: T.crossfade,
              fill: "forwards",
            }).finished;
            ov.root.remove();
          }

          // g) the book settles to rest
          await handle.settle();
          finish();
        } catch {
          // never strand the reader: go to the book and clean up
          if (!pushed) {
            endArrival();
            push();
          }
          finish();
        }
      })();
      return true;
    },
    [router, endArrival],
  );

  // remember the path shown before this one (an arrival from a case study, e.g. browser Back)
  useEffect(() => {
    if (shownPath.current !== pathname) {
      prevPath.current = shownPath.current;
      shownPath.current = pathname;
    }
  }, [pathname]);

  // if the reader ends up somewhere else, stop at once
  useEffect(() => {
    if (busy.current && target.current && pathname !== target.current && pathname !== "/") {
      finishRef.current();
    }
  }, [pathname]);

  useEffect(() => () => finishRef.current(), []);

  const api = useMemo<TxApi>(
    () => ({
      run,
      runReverse,
      isBusy: () => busy.current,
      registerHero,
      unregisterHero,
      noHero,
      readArrival,
      // children read this before this layer's effect records the new path, so while the
      // book arrives it still names the page it came from
      previousPath: () => (shownPath.current !== pathname ? shownPath.current : prevPath.current),
      bookReady,
      endArrival,
    }),
    [run, runReverse, registerHero, unregisterHero, noHero, readArrival, bookReady, endArrival, pathname],
  );
  return <TxContext.Provider value={api}>{children}</TxContext.Provider>;
}
