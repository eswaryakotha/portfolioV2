"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { book, type BookCaseStudySpread } from "@/data/content";
import { useBookPage } from "./bookCtx";

const S = book.settings;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
/** set a video's time and wait (briefly) until that frame is ready */
const seekTo = (v: HTMLVideoElement, t: number, ms = 250) =>
  new Promise<void>((resolve) => {
    if (!v.src || Math.abs(v.currentTime - t) < 0.03) return resolve();
    const done = () => resolve();
    v.addEventListener("seeked", done, { once: true });
    setTimeout(done, ms);
    try {
      v.currentTime = t;
    } catch {
      resolve();
    }
  });

type Phase = "hidden" | "flush" | "raised" | "sinking";
type Pull = {
  id: number;
  y0: number;
  max: number;
  moved: boolean;
  samples: { t: number; y: number }[];
};

/** The raised video card of a case-study spread, like the standing piece of a pop-up
    greeting card: one unsplit copy of the video, centred on the fold and standing off the
    pages, with the "View case study" pull tab. It only shows while the spread is open and
    settled. It appears exactly over the printed halves (flush), then lifts forward; when a
    page starts to turn it sinks back flush and hands over to the halves on the pages. */
export default function SpreadCard({
  spread,
  stop,
}: {
  spread: BookCaseStudySpread;
  stop: number;
}) {
  const api = useBookPage();
  const active = api?.spread === stop;
  const near = api ? Math.abs(api.spread - stop) <= 1 : false;
  const arriving = !!api?.arriving;
  const wantUp = active && !!api?.settled && !arriving;
  const hero = spread.heroVideo;
  const [phase, setPhase] = useState<Phase>("hidden");
  const phaseRef = useRef<Phase>("hidden");

  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const pull = useRef<Pull | null>(null);
  const offset = useRef(0);

  const halves = useCallback(() => {
    const bookEl = cardRef.current?.closest(".bk-book");
    return bookEl
      ? [
          ...bookEl.querySelectorAll<HTMLElement>(
            `.bk-vhalf[data-media-for="${spread.id}"]`,
          ),
        ]
      : [];
  }, [spread.id]);
  const halfVideos = useCallback(
    () =>
      halves()
        .map((h) => h.querySelector("video"))
        .filter((v): v is HTMLVideoElement => !!v),
    [halves],
  );
  const cover = useCallback(
    (on: boolean) => halves().forEach((h) => (on ? (h.dataset.covered = "") : delete h.dataset.covered)),
    [halves],
  );
  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  /* arriving back from a case study: straight down to the page, before the first paint, with
     no sinking motion (the video flies into the printed slot, then the card rises as usual) */
  useLayoutEffect(() => {
    if (!arriving || phaseRef.current === "hidden") return;
    videoRef.current?.pause();
    cover(false);
    phaseRef.current = "hidden";
    setPhase("hidden"); // in a layout effect: this lands before the first paint
  }, [arriving, cover]);

  /* ---------- rise when the spread settles, sink and hand over when a page turns ---------- */
  useEffect(() => {
    let cancelled = false;
    const card = videoRef.current;
    (async () => {
      if (wantUp) {
        if (phaseRef.current === "raised" || phaseRef.current === "flush") return;
        // show the same frame the pages show, exactly over them, then lift
        const from = halfVideos()[0];
        if (card && from) await seekTo(card, from.currentTime);
        if (cancelled) return;
        go("flush");
        // only hide the printed halves once the card is on screen over them
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        if (cancelled) return;
        cover(true);
        go("raised");
        card?.play().catch(() => card.pause());
      } else {
        if (phaseRef.current === "hidden") return;
        card?.pause();
        // give the printed halves the card's frame while it sinks back flat
        const t = card?.currentTime ?? 0;
        go("sinking");
        await Promise.all([...halfVideos().map((v) => seekTo(v, t)), wait(S.cardSinkMs)]);
        if (cancelled && phaseRef.current !== "sinking") return;
        cover(false);
        go("hidden");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wantUp, go, cover, halfVideos]);

  /* ---------- pull: the tab slides down and the card lifts further ---------- */
  const maxPull = useCallback(() => {
    const bookEl = cardRef.current?.closest(".bk-book") as HTMLElement | null;
    return Math.max(1, (bookEl?.offsetHeight ?? 600) * S.tabPullOfPage);
  }, []);

  const apply = useCallback((px: number, max: number) => {
    offset.current = px;
    const tab = tabRef.current;
    if (tab) tab.style.translate = Math.abs(px) < 0.01 ? "" : `0 ${px.toFixed(2)}px`; // empty lets :hover work
    const p = clamp(px / max, 0, 1);
    const w = wrapRef.current;
    if (w) {
      w.style.transform = p
        ? `translateZ(${(S.videoLiftZ * p).toFixed(2)}px) scale(${(1 + (S.videoLiftScale - 1) * p).toFixed(4)})`
        : "";
    }
    if (shadowRef.current) shadowRef.current.style.opacity = p.toFixed(3);
  }, []);

  const animateTo = useCallback(
    (to: number, ms: number, max: number, bounce = false) =>
      new Promise<void>((resolve) => {
        const from = offset.current;
        const start = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const step = (now: number) => {
          const t = clamp((now - start) / ms, 0, 1);
          let v = from + (to - from) * ease(t);
          if (bounce) v -= Math.sin(Math.PI * t) * Math.min(6, from * 0.08); // small bounce back
          apply(v, max);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [apply],
  );

  useEffect(() => {
    if (!api) return;
    api.registerTab(stop, {
      finish: (ms) => void animateTo(maxPull(), ms, maxPull()),
      reset: () => {
        tabRef.current?.classList.remove("is-pulling");
        apply(0, 1);
      },
    });
    return () => api.registerTab(stop, null);
  }, [api, stop, animateTo, apply, maxPull]);

  const up = phase === "raised";
  const commit = () => {
    if (!api || api.isBusy() || !active || !up) return;
    api.openCaseStudy(stop);
  };

  /* The handlers sit on the tab's wrapper: inside the book's 3D space Chrome delivers real
     pointer events to the wrapper rather than to the button, so they are handled here.
     Keyboard clicks on the button bubble up to the same onClick. */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!up || api?.isBusy()) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation(); // never start a page drag from the tab
    api?.prefetch(spread.href);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* best effort */
    }
    pull.current = {
      id: e.pointerId,
      y0: e.clientY - offset.current,
      max: maxPull(),
      moved: false,
      samples: [{ t: e.timeStamp, y: e.clientY }],
    };
    tabRef.current?.classList.add("is-pulling");
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = pull.current;
    if (!d || d.id !== e.pointerId) return;
    e.stopPropagation();
    const dy = e.clientY - d.y0;
    if (Math.abs(dy) > 4) d.moved = true;
    const over = Math.max(0, dy - d.max); // rubber band past the full pull
    const px = clamp(dy, 0, d.max) + S.pullRubberPx * (1 - Math.exp(-over / 40));
    apply(px, d.max);
    d.samples.push({ t: e.timeStamp, y: e.clientY });
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const d = pull.current;
    if (!d || d.id !== e.pointerId) return;
    e.stopPropagation();
    pull.current = null;
    if (!d.moved && !cancelled) {
      tabRef.current?.classList.remove("is-pulling");
      return; // a plain click: handled by onClick
    }
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const v = last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
    const p = offset.current / d.max;
    if (!cancelled && (p >= S.pullCommitAt || v > S.pullFlickVelocity)) {
      commit();
    } else {
      tabRef.current?.classList.remove("is-pulling");
      void animateTo(0, 380, d.max, true);
    }
  };
  const onClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    // click, Enter or Space without a drag: pull it ourselves, then open
    if (offset.current > 1 && e.detail > 0) return; // the end of a drag
    if (!up || api?.isBusy()) return;
    if (api?.reduced) return commit();
    const max = maxPull();
    tabRef.current?.classList.add("is-pulling");
    await animateTo(max, S.autoPullMs, max);
    commit();
  };

  const label = book.ui.tabLabel.replace("{name}", spread.name);
  const showHint = api?.hintFor === stop && up;

  return (
    <div
      ref={cardRef}
      className="bk-card"
      data-phase={phase}
      aria-hidden={!up}
      inert={!up}
      style={{ "--accent-tab": spread.accent } as CSSProperties}
    >
      <span className="bk-card-ground" aria-hidden="true" />
      <div className="bk-vwrap" ref={wrapRef} data-media-for={spread.id} data-side="c">
        <span className="bk-vshadow" ref={shadowRef} aria-hidden="true" />

        <div
          className="bk-tab-slot"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={(e) => onUp(e)}
          onPointerCancel={(e) => onUp(e, true)}
          onPointerEnter={() => api?.prefetch(spread.href)}
          onClick={onClick}
        >
          <button
            ref={tabRef}
            type="button"
            className="bk-tab"
            aria-label={label}
            onFocus={() => api?.prefetch(spread.href)}
          >
            <span className="bk-tab-grip" aria-hidden="true" />
            <span className="bk-tab-text">{book.ui.tabText}</span>
          </button>
          {showHint && (
            <span className="bk-pull-hint" aria-hidden="true">
              <span>{book.ui.tabHint}</span>
              <svg viewBox="0 0 40 40" fill="none">
                <path
                  d="M4 10 C 16 4, 28 10, 32 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M26 20 L32 27 L37 19"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>

        {hero?.src ? (
          <div className="bk-vclip" onClick={commit}>
            <video
              ref={videoRef}
              src={near ? hero.src : undefined}
              poster={hero.poster || undefined}
              muted
              loop
              playsInline
              preload={near ? "auto" : "none"}
              aria-label={hero.label}
            />
          </div>
        ) : (
          <div
            className="bk-vclip bk-dashed bk-video-ph"
            role="img"
            aria-label={spread.videoPlaceholder}
            onClick={commit}
          >
            {spread.videoPlaceholder}
          </div>
        )}
      </div>
    </div>
  );
}
