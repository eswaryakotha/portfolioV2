"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { IdCardSettings } from "@/data/content";

/** seated: in the holder (drawn inside the page). Any other phase: drawn in the overlay. */
export type IdCardPhase = "seated" | "lifting" | "out" | "returning";

export type IdCardCtl = {
  phase: IdCardPhase;
  /** click on the card: lift it out, or put it back */
  toggle: () => void;
  /** start putting the card back (if it is not seated); returns ms until it is seated */
  beginReturn: () => number;
  /** ms until the card is seated, if a return were started now (0 when seated) */
  remaining: () => number;
  /** seat the card at once, with no motion (the spread was left without a turn) */
  reset: () => void;
  /** lift the card out by itself, and put it back after `ms` unless something else does first */
  autoShow: (ms: number) => void;
  setBox: (el: HTMLDivElement | null) => void; // the overlay's box
  setCard: (el: HTMLButtonElement | null) => void; // the overlay's card
  setShadow: (el: HTMLSpanElement | null) => void; // the overlay's shadow
  setPageButton: (el: HTMLButtonElement | null) => void; // the seated card's button
  onCardPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onCardPointerLeave: () => void;
};

type Anim = {
  from: number;
  to: number;
  t0: number;
  dur: number;
  ease: (t: number) => number;
  bump: (t: number) => number; // small extra beyond the path: the overshoot and the settle
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const linear = (t: number) => t;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of time. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (u: number) => ((ax * u + bx) * u + cx) * u;
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  const y = (u: number) => ((ay * u + by) * u + cy) * u;
  return (t: number) => {
    let u = t;
    for (let i = 0; i < 8; i++) {
      const err = x(u) - t;
      if (Math.abs(err) < 1e-5) break;
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= err / d;
    }
    return y(clamp(u, 0, 1));
  };
}
const liftEase = cubicBezier(0.22, 1, 0.36, 1);
/** lift: a little past the out pose around 70% of the way, then back */
const liftBump = (t: number) =>
  0.05 * Math.sin(Math.PI * clamp((t - 0.42) / 0.58, 0, 1));
/** return: a tiny dip into the groove at the very end, then back up */
const returnBump = (t: number) =>
  -0.035 * Math.sin(Math.PI * clamp((t - 0.8) / 0.2, 0, 1));
const none = () => 0;

/** Rest geometry, as shares of the card height h (matches idcard.css): the group is the
    card plus the bit of the paper slot below the card's bottom edge. */
export const GROUP_OF_H = 1.03;

/**
 * The ID card's state and motion. One controller drives both drawings of the card: the
 * seated one inside the page and the moving one in the overlay. Which of the two shows is
 * set with data attributes on `scope` (an element that contains both), in the same write as
 * the overlay's first or last frame, so the swap never shows a gap or a double.
 */
export function useIdCard({
  settings: S,
  reduced,
  active,
  scopeRef,
  perspectiveOfBox = 8,
}: {
  settings: IdCardSettings;
  reduced: boolean;
  active: boolean; // the card can be used (its spread is current)
  scopeRef: RefObject<HTMLElement | null>;
  /** the perspective the card is drawn with, in widths of its box (for the fit check) */
  perspectiveOfBox?: number;
}): IdCardCtl {
  const [phase, setPhaseState] = useState<IdCardPhase>("seated");
  const phaseRef = useRef<IdCardPhase>("seated");
  const box = useRef<HTMLDivElement | null>(null);
  const card = useRef<HTMLButtonElement | null>(null);
  const shadow = useRef<HTMLSpanElement | null>(null);
  const pageBtn = useRef<HTMLButtonElement | null>(null);
  const pos = useRef(0); // 0 seated .. 1 out
  const anim = useRef<Anim | null>(null);
  const raf = useRef(0);
  const frameRef = useRef<FrameRequestCallback>(() => {});
  const hPx = useRef(0);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0, sx: 50, tsx: 50 });
  const reducedRef = useRef(reduced);
  const activeRef = useRef(active);
  useEffect(() => {
    reducedRef.current = reduced;
    activeRef.current = active;
  }, [reduced, active]);

  const setPhase = useCallback((p: IdCardPhase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  /** which drawing shows, and whether the card is still behind the holder's lip */
  const setScope = useCallback(
    (moving: boolean, behindLip: boolean) => {
      const el = scopeRef.current;
      if (!el) return;
      if (moving) el.dataset.idcPhase = "moving";
      else delete el.dataset.idcPhase;
      if (moving && behindLip) el.dataset.idcLip = "front";
      else delete el.dataset.idcLip;
    },
    [scopeRef],
  );

  const measure = useCallback(() => {
    if (card.current) hPx.current = card.current.offsetHeight;
  }, []);

  /** Draws the overlay card for path position e (plus the bump o). Returns whether the card
      is still behind the lip. */
  const write = useCallback(
    (e: number, o: number) => {
      const el = card.current;
      if (!el) return true;
      const h = hPx.current || el.offsetHeight;
      const k = e + o;
      const T = tilt.current;
      const tx = reducedRef.current ? 0 : T.x * e;
      const ty = reducedRef.current ? 0 : T.y * e;
      const lean = S.restLean * (1 - k);
      const s = 1 + (S.outScale - 1) * k;
      const y = -S.liftUp * h * k;
      el.style.transform =
        `translate3d(0px, ${y.toFixed(2)}px, ${(S.outZ * e).toFixed(2)}px) ` +
        `rotateZ(${(-2 * e).toFixed(3)}deg) translateY(50%) rotateX(${lean.toFixed(3)}deg) ` +
        `translateY(-50%) rotateX(${tx.toFixed(3)}deg) rotateY(${ty.toFixed(3)}deg) ` +
        `scale(${s.toFixed(4)})`;
      el.style.setProperty("--sx", T.sx.toFixed(1));
      el.style.setProperty("--hy", (50 + (T.x - T.y) * 2.5).toFixed(1));
      const sh = shadow.current;
      if (sh) {
        const g = clamp(e, 0, 1);
        sh.style.opacity = (0.6 * g).toFixed(3);
        sh.style.transform = `translate(${(10 * g).toFixed(2)}px, ${(18 * g).toFixed(2)}px) scale(${(0.9 + 0.12 * g).toFixed(3)})`;
      }
      // The card's lowest point (scaled about its centre, turned 2deg, tilted) against the top of
      // the lip, both measured up from the groove in card heights. The 2deg turn drops a corner
      // by about (width / 2) x sin 2deg, and the most tilt lowers the edge a little more.
      const corner = ((S.cardAspect * s) / 2) * Math.sin(Math.PI / 90) * e;
      const tiltDrop = 0.02 * e;
      const bottom = S.liftUp * k - (s - 1) / 2 - corner - tiltDrop;
      return bottom < S.seat + 0.04 + 0.005;
    },
    [S],
  );

  const settleSeated = useCallback(() => {
    anim.current = null;
    pos.current = 0;
    write(0, 0);
    setScope(false, false);
    setPhase("seated");
    if (document.activeElement === card.current)
      pageBtn.current?.focus({ preventScroll: true });
  }, [setPhase, setScope, write]);

  const frame = useCallback(
    (now: number) => {
      raf.current = 0;
      const a = anim.current;
      const T = tilt.current;
      const out = phaseRef.current === "out";
      // smoothed tilt: follows the pointer while out, eases back to neutral otherwise
      if (!reducedRef.current) {
        const k = out ? 0.16 : 0.12;
        T.x += (T.tx - T.x) * k;
        T.y += (T.ty - T.y) * k;
        T.sx += (T.tsx - T.sx) * k;
      }
      if (a) {
        const t = clamp((now - a.t0) / a.dur, 0, 1);
        const e = a.from + (a.to - a.from) * a.ease(t);
        const o = a.bump(t);
        pos.current = e;
        const behind = write(e, o);
        setScope(true, behind);
        if (t >= 1) {
          if (a.to === 0) {
            settleSeated();
            return;
          }
          anim.current = null;
          pos.current = 1;
          setPhase("out");
        }
      } else if (out) {
        write(1, 0);
      }
      const moving =
        Math.abs(T.tx - T.x) > 0.01 ||
        Math.abs(T.ty - T.y) > 0.01 ||
        Math.abs(T.tsx - T.sx) > 0.05;
      if (anim.current || (out && moving && !reducedRef.current)) {
        raf.current = requestAnimationFrame(frameRef.current);
      }
    },
    [setPhase, setScope, settleSeated, write],
  );
  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);
  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(frameRef.current);
  }, []);

  const lift = useCallback(() => {
    if (!activeRef.current) return;
    const from = pos.current;
    const flat = reducedRef.current;
    if (phaseRef.current === "seated") {
      measure();
      tilt.current = { x: 0, y: 0, tx: 0, ty: 0, sx: 50, tsx: 50 };
      write(0, 0); // the first overlay frame matches the seated card exactly
      setScope(true, true);
      if (document.activeElement === pageBtn.current)
        card.current?.focus({ preventScroll: true });
    }
    anim.current = {
      from,
      to: 1,
      t0: performance.now(),
      dur: (flat ? S.reducedMs : S.liftMs) * Math.max(0.2, 1 - from),
      ease: flat ? linear : liftEase,
      bump: flat ? none : liftBump,
    };
    setPhase("lifting");
    kick();
  }, [S, kick, measure, setPhase, setScope, write]);

  const beginReturn = useCallback(() => {
    clearTimeout(autoTimer.current); // anything that puts it back cancels a timed return
    const p = phaseRef.current;
    if (p === "seated") return 0;
    const now = performance.now();
    if (p === "returning" && anim.current)
      return Math.max(0, anim.current.t0 + anim.current.dur - now);
    const flat = reducedRef.current;
    const from = pos.current;
    const dur = (flat ? S.reducedMs : S.returnMs) * Math.max(0.25, from);
    tilt.current.tx = 0;
    tilt.current.ty = 0;
    tilt.current.tsx = 50;
    anim.current = {
      from,
      to: 0,
      t0: now,
      dur,
      ease: flat ? linear : easeInOut,
      bump: flat ? none : returnBump,
    };
    setPhase("returning");
    kick();
    return dur;
  }, [S, kick, setPhase]);

  const remaining = useCallback(() => {
    const p = phaseRef.current;
    if (p === "seated") return 0;
    if (p === "returning" && anim.current) {
      return Math.max(
        0,
        anim.current.t0 + anim.current.dur - performance.now(),
      );
    }
    return (
      (reducedRef.current ? S.reducedMs : S.returnMs) *
      Math.max(0.25, pos.current)
    );
  }, [S]);

  const reset = useCallback(() => {
    clearTimeout(autoTimer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
    if (phaseRef.current !== "seated") settleSeated();
  }, [settleSeated]);

  const toggle = useCallback(() => {
    clearTimeout(autoTimer.current); // a click takes over from a timed return
    const p = phaseRef.current;
    if (p === "seated" || p === "returning") lift();
    else beginReturn();
  }, [beginReturn, lift]);

  const autoShow = useCallback(
    (ms: number) => {
      if (phaseRef.current !== "seated" || !activeRef.current) return;
      lift();
      clearTimeout(autoTimer.current);
      autoTimer.current = setTimeout(() => beginReturn(), ms);
    },
    [beginReturn, lift],
  );

  /* no longer usable (its spread was left): make sure it is on its way back. A turn has
     already started the return (an instant jump calls reset itself); this is a safety net. */
  useEffect(() => {
    if (!active) beginReturn();
  }, [active, beginReturn]);

  /* Esc puts it back */
  useEffect(() => {
    if (phase === "seated") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") beginReturn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, beginReturn]);

  /* resize while out: recompute, and put it back if it no longer fits under the header */
  const fits = useCallback(() => {
    const b = box.current;
    if (!b) return true;
    const r = b.getBoundingClientRect();
    const H = r.height;
    const h = H * S.cardHeight;
    const w = h * S.cardAspect;
    const persp = r.width * perspectiveOfBox;
    const tiltRad = (S.tiltMax * Math.PI) / 180;
    const grow =
      persp / (persp - S.outZ - ((h * S.outScale) / 2) * Math.sin(tiltRad));
    const halfH =
      ((h * S.outScale) / 2) * grow +
      ((w * S.outScale) / 2) * Math.sin(Math.PI / 90);
    const halfW =
      ((w * S.outScale) / 2) * grow +
      ((h * S.outScale) / 2) * Math.sin(Math.PI / 90);
    const restCenter = r.top + (H - h * GROUP_OF_H) / 2 + h / 2;
    const top = restCenter - S.liftUp * h - halfH;
    const right = r.left + r.width / 2 + halfW;
    const header =
      document.querySelector("body > header")?.getBoundingClientRect().bottom ??
      0;
    return top >= header + S.headerClearance && right <= r.right - 12;
  }, [S, perspectiveOfBox]);

  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const ro = new ResizeObserver(() => {
      measure();
      if (phaseRef.current === "seated") return;
      if (phaseRef.current === "out") write(1, 0);
      if (!fits()) beginReturn();
    });
    ro.observe(b);
    return () => ro.disconnect();
  }, [beginReturn, fits, measure, write]);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      clearTimeout(autoTimer.current);
    },
    [],
  );

  const onCardPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (
        phaseRef.current !== "out" ||
        reducedRef.current ||
        e.pointerType === "touch"
      )
        return;
      const r = e.currentTarget.getBoundingClientRect();
      const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      const T = tilt.current;
      T.ty = nx * S.tiltMax;
      T.tx = -ny * S.tiltMax;
      T.tsx = 50 - nx * 45;
      kick();
    },
    [S, kick],
  );
  const onCardPointerLeave = useCallback(() => {
    const T = tilt.current;
    T.tx = 0;
    T.ty = 0;
    T.tsx = 50;
    kick();
  }, [kick]);

  const setBox = useCallback((el: HTMLDivElement | null) => {
    box.current = el;
  }, []);
  const setCard = useCallback((el: HTMLButtonElement | null) => {
    card.current = el;
  }, []);
  const setShadow = useCallback((el: HTMLSpanElement | null) => {
    shadow.current = el;
  }, []);
  const setPageButton = useCallback((el: HTMLButtonElement | null) => {
    pageBtn.current = el;
  }, []);

  return useMemo(
    () => ({
      phase,
      toggle,
      beginReturn,
      remaining,
      reset,
      autoShow,
      setBox,
      setCard,
      setShadow,
      setPageButton,
      onCardPointerMove,
      onCardPointerLeave,
    }),
    [
      phase,
      toggle,
      beginReturn,
      remaining,
      reset,
      autoShow,
      setBox,
      setCard,
      setShadow,
      setPageButton,
      onCardPointerMove,
      onCardPointerLeave,
    ],
  );
}
