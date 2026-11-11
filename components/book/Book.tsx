"use client";

import { CLOSE_BOOK_EVENT } from "@/components/NameLink";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBookTransition } from "@/components/transition/TransitionLayer";
import { BookPageCtx, type BookPageApi } from "./bookCtx";
import { book, siteContent, type BookSpread } from "@/data/content";
import { LeftPage, RightPage } from "./BookPages";
import SpreadCard from "./SpreadCard";
import BackCoverScene, { BACK_COVER_BG } from "./BackCoverScene";
import CoverContributions from "./CoverContributions";
import CoverNotes from "./CoverNotes";
import IdCardHolder from "@/components/idcard/IdCardHolder";
import { useIdCard } from "@/components/idcard/useIdCard";
import "./book.css";

const S = book.settings;
const SPREADS: BookSpread[] = book.spreads;
/** Leaves: 0 is the cover, 1..n-2 are interior leaves and the last is the back board, which
    can flip too, to close the book at the end. Stop k shows leaves 0..k-1 flipped. */
const LEAVES = SPREADS.length + 1;
/** Stops: 0 = closed on the cover, 1..SPREADS.length = open spreads, LAST = closed on the
    back cover. */
const LAST = LEAVES;
const BACK = LAST;
const BACK_ID = "back-cover";
const stopId = (k: number) => (k === BACK ? BACK_ID : SPREADS[k - 1]?.id);
const stopName = (k: number) =>
  k === 0 ? book.ui.coverDot : k === BACK ? book.ui.backDot : (SPREADS[k - 1]?.name ?? "");
const EPS = S.leafGapPx;
/** The About spread: its left page (the back of leaf ABOUT_STOP - 1) holds the ID card. */
const ABOUT_STOP = SPREADS.findIndex((s) => s.type === "about") + 1; // 0 if there is none
const ABOUT_LEAF = ABOUT_STOP - 1;
const ID = book.aboutSpread;
const ID_CARD_ID = "bk-id-card";
/** The ID card's overlay sits this far above the pages (see .idc-layer in book.css). */
const ID_LAYER_Z = (SPREADS.length + 1 + 5) * S.leafGapPx;
const OVERSHOOT = S.settleDeg / 180;
/** Board weights in units where an inner leaf is 1. Total includes the static back board. */
const COVER_W = S.coverThickness;
const LEAF_W = (i: number) => (i === 0 || i === LEAVES - 1 ? COVER_W : 1);
const W_TOTAL = COVER_W * 2 + (LEAVES - 2);
/** Block depth is written in steps of 1/SLAB_STEPS of a leaf unit (about 0.5px at desktop sizes). */
const SLAB_STEPS = 16;

/* ---------- rounded edge faces ----------
   Each solid block is drawn as a ring of flat edge faces around its outer edge: a straight
   bottom run, a straight outer side, and the two outer corners split into a few facets. Every
   face is extruded backward by the block depth with the same transform, so they read as one
   rounded slab. Positions are in book coordinates; R is the corner radius. */
type EdgeFace = { left: string; top: string; width: string; angle: number };
const R = "var(--bk-r)";
const n4 = (v: number) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(4);
function arcFaces(
  cx: [number, number],
  cy: [number, number],
  fromDeg: number,
  toDeg: number,
): EdgeFace[] {
  const out: EdgeFace[] = [];
  const n = S.cornerSegments;
  for (let k = 0; k < n; k++) {
    const a = ((fromDeg + ((toDeg - fromDeg) * k) / n) * Math.PI) / 180;
    const b = ((fromDeg + ((toDeg - fromDeg) * (k + 1)) / n) * Math.PI) / 180;
    const dx = Math.cos(b) - Math.cos(a);
    const dy = Math.sin(b) - Math.sin(a);
    out.push({
      left: `calc(${cx[0]}% + ${R} * ${n4(cx[1] + Math.cos(a))})`,
      top: `calc(${cy[0]}% + ${R} * ${n4(cy[1] + Math.sin(a))})`,
      width: `calc(${R} * ${n4(Math.hypot(dx, dy))} + 0.6px)`,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    });
  }
  return out;
}
const SIDE_LEN = `calc(var(--bh) - ${R} * 2 + 0.6px)`;
const EDGE_FACES: Record<"l" | "r", EdgeFace[]> = {
  r: [
    { left: "50%", top: "100%", width: `calc(50% - ${R} + 0.6px)`, angle: 0 },
    ...arcFaces([100, -1], [100, -1], 90, 0),
    { left: "100%", top: `calc(100% - ${R})`, width: SIDE_LEN, angle: -90 },
    ...arcFaces([100, -1], [0, 1], 0, -90),
  ],
  l: [
    { left: R, top: "100%", width: `calc(50% - ${R} + 0.6px)`, angle: 0 },
    ...arcFaces([0, 1], [100, -1], 90, 180),
    { left: "0%", top: `calc(100% - ${R})`, width: SIDE_LEN, angle: -90 },
    ...arcFaces([0, 1], [0, 1], 180, 270),
  ],
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** The swing: eases in and out, but still has some speed when it lands, so the rebound reads
    as the board touching down rather than a stop and a second move. */
const easeSwing = (t: number) => 0.65 * (t * t * (3 - 2 * t)) + 0.35 * t;

type Seg = { from: number; to: number; dur: number; ease: (t: number) => number };
type Anim = { segs: Seg[]; k: number; t0: number; begin: number; started: boolean; final: number };
type Drag = {
  leaf: number;
  pointerId: number;
  x0: number;
  y0: number;
  p0: number;
  started: boolean;
  samples: { t: number; x: number }[];
  raw: number; // where the pointer would have put the leaf (it may be held back, see below)
};

/** With mobileBook off, the book only runs at desktop widths; below that the list is shown. */
export const bookEnabled = () =>
  S.mobileBook || window.matchMedia(S.desktopOnlyQuery).matches;

const stopForSlug = (slug: string): number => {
  const idx = SPREADS.findIndex((s) => s.type === "case-study" && s.slug === slug);
  return idx === -1 ? 0 : idx + 1;
};
const RV = book.settings.transition.reverse;

const hashToSpread = (hash: string): number => {
  const id = hash.replace(/^#/, "");
  if (id === BACK_ID) return BACK;
  const idx = SPREADS.findIndex((s) => s.id === id);
  return idx === -1 ? 0 : idx + 1;
};

export function useMedia(query: string, server: boolean) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}

function Face({
  side,
  active,
  className = "",
  onClick,
  button,
  tint,
  children,
}: {
  side: "front" | "back";
  active: boolean;
  className?: string;
  onClick?: () => void;
  button?: string; // accessible name, makes the face a keyboard operable button
  tint?: { mix: string; color?: string }; // a case study's page colour (see tintOf)
  children: ReactNode;
}) {
  return (
    <div
      className={`bk-face bk-${side} ${className}`}
      style={
        tint?.color
          ? ({ "--page-color": tint.color } as CSSProperties)
          : tint?.mix
            ? ({ "--page-tint": tint.mix } as CSSProperties)
            : undefined
      }
      data-active={active}
      aria-hidden={!active}
      inert={!active}
      onClick={onClick}
      role={button ? "button" : undefined}
      aria-label={button}
      tabIndex={button && active ? 0 : undefined}
      onKeyDown={
        button
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
      <span className="bk-shade" aria-hidden="true" />
    </div>
  );
}

const HINT_KEY = "bk-tab-hint-seen";
/** case-study pages are tinted with their project's colour */
/** fold shading for the open spread: a deeper shade of a case study's page colour, softer
    than the warm shading on cream paper */
const spineStyle = (s: BookSpread | undefined) =>
  s?.type === "case-study"
    ? {
        // the page colour; book.css turns it into a deeper shade of the same hue
        "--spine-base":
          s.pageColor ?? `color-mix(in srgb, ${s.pageTint} ${S.pageTintPct}%, ${book.colors.page})`,
        "--spine-peak": `${S.foldShadePct}%`,
      }
    : {};
const tintOf = (s: BookSpread | undefined) =>
  s?.type === "case-study" ? { mix: s.pageTint, color: s.pageColor } : undefined;

export default function Book() {
  const [spread, setSpread] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [settled, setSettled] = useState(true);
  const [hintFor, setHintFor] = useState<number | null>(null);
  const router = useRouter();
  const tx = useBookTransition();
  const tabs = useRef(
    new Map<number, { finish: (ms: number) => void; reset: () => void }>(),
  );
  const reduced = useMedia("(prefers-reduced-motion: reduce)", false);

  const spreadRef = useRef(0);
  const reducedRef = useRef(false);
  const announceOn = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafEls = useRef<(HTMLDivElement | null)[]>([]);
  const castEls = useRef<(HTMLDivElement | null)[]>([]);
  const slabR = useRef<HTMLDivElement>(null);
  const slabL = useRef<HTMLDivElement>(null);
  const parRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const prevArrowRef = useRef<HTMLButtonElement>(null);
  const thickPx = useRef(0);
  const slabKey = useRef("");
  const prog = useRef<number[]>(Array.from({ length: LEAVES }, () => 0));
  const anims = useRef(new Map<number, Anim>());
  const raf = useRef(0);
  const tickRef = useRef<FrameRequestCallback>(() => {});
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const pendingTurn = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /* arriving back from a case study: open, flat, receded, controls hidden, input off */
  const [arriving, setArriving] = useState(false);
  const arrivingRef = useRef(false);

  /* the ID card on the About spread's left page */
  const desktop = useMedia(S.desktopOnlyQuery, true);
  const idCard = useIdCard({
    settings: ID.settings,
    reduced,
    active: ABOUT_STOP > 0 && spread === ABOUT_STOP && (S.mobileBook || desktop),
    scopeRef: rootRef,
    perspectiveOfBox: 2 * S.perspectiveOfWidth, // the book's perspective, in page widths
  });
  const idCardRef = useRef(idCard);
  useEffect(() => {
    idCardRef.current = idCard;
  }, [idCard]);

  /* ---------- the two solid blocks: depth follows how many leaves each side holds ---------- */
  const applySlabs = useCallback((exact = false) => {
    const r = slabR.current;
    const l = slabL.current;
    if (!r || !l) return;
    const P = prog.current.map((p) => clamp(p, 0, 1));
    let rMid = 0;
    let lMid = 0;
    for (let i = 1; i < LEAVES - 1; i++) {
      rMid += 1 - P[i];
      lMid += P[i];
    }
    const back = P[LEAVES - 1]; // the back board, flipped only when the book closes at the end
    const rFront = COVER_W * (1 - P[0]); // cover board on top of the right block
    const rTot = rFront + rMid + COVER_W * (1 - back); // back board at the rear while it is there
    const lCover = COVER_W * P[0]; // flipped cover lies at the rear of the left block
    const lTot = lMid + lCover + COVER_W * back;
    // Rescaling the edge faces makes the browser re-composite the whole 3D scene, so only
    // write when a block's depth has really changed (about half a pixel at desktop sizes).
    const q = (v: number) => Math.round(v * SLAB_STEPS) / SLAB_STEPS;
    const key = [q(rTot), q(rFront), q(lTot), q(lCover)].join();
    // exact: a leaf just landed, so write the final depth even if it is within a step
    if (key === slabKey.current && !exact) return;
    slabKey.current = key;
    r.style.setProperty("--s", (rTot / W_TOTAL).toFixed(4));
    r.style.setProperty("--a", `${((rFront / rTot) * 100).toFixed(3)}%`);
    r.style.setProperty("--b", `${(((rFront + rMid) / rTot) * 100).toFixed(3)}%`);
    l.style.setProperty("--s", (lTot / W_TOTAL).toFixed(4));
    l.style.setProperty("--a", lTot > 0 ? `${((lMid / lTot) * 100).toFixed(3)}%` : "100%");
    // a block with no depth would still draw its squashed faces as a hairline outline
    l.style.visibility = lTot > 0.001 ? "visible" : "hidden";
    r.style.visibility = rTot > 0.001 ? "visible" : "hidden";
  }, []);

  /* ---------- rendering of one leaf from its progress value ---------- */
  const applyLeaf = useCallback((i: number) => {
    const el = leafEls.current[i];
    if (!el) return;
    const p = prog.current[i];
    const cl = clamp(p, 0, 1);
    if (reducedRef.current) {
      el.style.transform = "";
      return;
    }
    const lift = S.liftPx * Math.sin(Math.PI * cl);
    // The hinge sits mid thickness, so both resting pages end up in the same plane. Depth moves
    // continuously from the top of the right stack to the top of the left stack (no snap at
    // lift-off or landing); the lift keeps it above everything in between.
    const half = (thickPx.current * LEAF_W(i)) / W_TOTAL / 2;
    const s = cl * cl * (3 - 2 * cl);
    const restR = (LEAVES - i) * EPS;
    const restL = i * EPS;
    const z = -half + restR + (restL - restR) * s + lift;
    el.style.transform = `translateZ(${z}px) rotateY(${-p * 180}deg)`;
    el.style.setProperty("--shade", (S.shadeMax * Math.sin(Math.PI * cl)).toFixed(3));
    // the leaf's own edges fade in only once it has left the block, so they never sit in the
    // same plane as the block's edge faces (that caused flicker)
    el.style.setProperty("--ledge", clamp(Math.sin(Math.PI * cl) * 6 - 0.2, 0, 1).toFixed(3));
    const cast = castEls.current[i];
    if (cast) {
      const side = p < 0.5 ? "r" : "l";
      cast.dataset.side = side;
      // just above the page it falls on and just below the moving leaf, at every progress
      const castZ = (side === "r" ? LEAVES - i - 0.5 : i - 0.5) * EPS;
      cast.style.transform = `translateZ(${castZ}px) scaleX(${Math.abs(Math.cos(Math.PI * cl)).toFixed(4)})`;
      // no page under the cover on the left, or under the back board on the right
      const noPageBelow = (i === 0 && side === "l") || (i === LEAVES - 1 && side === "r");
      cast.style.opacity = noPageBelow ? "0" : (S.castMax * Math.sin(Math.PI * cl)).toFixed(3);
    }
  }, []);

  const setWillChange = (i: number, on: boolean) => {
    const el = leafEls.current[i];
    if (el) el.style.willChange = on ? "transform" : "";
  };
  const setMoving = (i: number, on: boolean) => {
    const el = leafEls.current[i];
    if (!el) return;
    if (on) el.dataset.moving = "1";
    else delete el.dataset.moving;
  };

  const snap = useCallback(
    (i: number, p: number) => {
      anims.current.delete(i);
      prog.current[i] = p;
      setWillChange(i, false);
      setMoving(i, false);
      applyLeaf(i);
      applySlabs(true);
      if (anims.current.size === 0 && !drag.current?.started) setSettled(true);
    },
    [applyLeaf, applySlabs],
  );

  const tick = useCallback(
    (now: number) => {
      raf.current = 0;
      anims.current.forEach((a, i) => {
        if (now < a.begin) return;
        if (!a.started) {
          a.started = true;
          setWillChange(i, true);
        }
        let elapsed = now - a.t0;
        while (a.k < a.segs.length && elapsed >= a.segs[a.k].dur) {
          elapsed -= a.segs[a.k].dur;
          a.k++;
        }
        if (a.k >= a.segs.length) {
          snap(i, a.final);
          return;
        }
        const seg = a.segs[a.k];
        prog.current[i] = seg.from + (seg.to - seg.from) * seg.ease(elapsed / seg.dur);
        applyLeaf(i);
      });
      applySlabs(); // once per frame, after all moving leaves
      if (anims.current.size > 0) raf.current = requestAnimationFrame(tickRef.current);
    },
    [applyLeaf, applySlabs, snap],
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const flipTo = useCallback(
    (i: number, to: number, opts: { delay?: number; settle?: boolean } = {}) => {
      const from = prog.current[i];
      const dist = Math.abs(to - from);
      if (dist < 0.001) {
        snap(i, to);
        return;
      }
      const dur = Math.max(S.minFlipMs, S.flipMs * dist);
      const dir = to > from ? 1 : -1;
      const segs: Seg[] =
        opts.settle === false
          ? [{ from, to, dur, ease: easeOut }]
          : [
              // swing all the way down, rebound about 2deg off the stack, settle back. Going
              // past flat instead would push the free edge into the pages below it.
              { from, to, dur, ease: easeSwing },
              { from: to, to: to - dir * OVERSHOOT, dur: S.settleMs * 0.45, ease: easeOut },
              { from: to - dir * OVERSHOOT, to, dur: S.settleMs * 0.55, ease: easeInOut },
            ];
      setMoving(i, true);
      setSettled(false);
      const begin = performance.now() + (opts.delay ?? 0);
      anims.current.set(i, { segs, k: 0, t0: begin, begin, started: false, final: to });
      if (!raf.current) raf.current = requestAnimationFrame(tickRef.current);
    },
    [snap],
  );

  /* ---------- committed spread: state, URL hash, announcement ---------- */
  const commit = useCallback((target: number) => {
    spreadRef.current = target;
    setSpread(target);
    const url =
      target === 0 ? window.location.pathname + window.location.search : `#${stopId(target)}`;
    window.history.replaceState(null, "", url);
    // one-time "pull" hint, the first time per session a case-study spread is reached
    if (S.tabHint && SPREADS[target - 1]?.type === "case-study") {
      try {
        if (!window.sessionStorage.getItem(HINT_KEY)) {
          window.sessionStorage.setItem(HINT_KEY, "1");
          setHintFor(target);
          window.setTimeout(
            () => setHintFor((h) => (h === target ? null : h)),
            S.tabHintMs + S.flipMs,
          );
        }
      } catch {
        /* storage blocked: skip the hint */
      }
    }
    if (announceOn.current) {
      setAnnounce(
        target === 0
          ? book.ui.liveCover
          : target === BACK
            ? book.ui.liveBack
            : book.ui.liveTemplate
                .replace("{n}", String(target))
                .replace("{total}", String(SPREADS.length))
                .replace("{name}", SPREADS[target - 1].name),
      );
    }
  }, []);

  /** Turns the leaves to show `target`. `delay` holds back every flip (ms). */
  const runFlips = useCallback(
    (target: number, from: number, delay = 0) => {
      if (reducedRef.current) {
        for (let i = 0; i < LEAVES; i++) snap(i, i < target ? 1 : 0);
        return;
      }
      const changed: number[] = [];
      for (let i = 0; i < LEAVES; i++) {
        const want = i < target ? 1 : 0;
        const cur = anims.current.get(i)?.final ?? prog.current[i];
        if (cur !== want) changed.push(i);
      }
      if (target < from) changed.reverse();
      const split = Math.max(0, changed.length - S.maxVisibleJumpFlips);
      changed.forEach((i, n) => {
        const want = i < target ? 1 : 0;
        if (n < split) snap(i, want);
        else flipTo(i, want, { delay: delay + (n - split) * S.jumpStaggerMs });
      });
    },
    [flipTo, snap],
  );

  const goTo = useCallback(
    (raw: number, instant = false) => {
      const target = clamp(raw, 0, LAST);
      const from = spreadRef.current;
      if (target === from && !instant) return;
      clearTimeout(pendingTurn.current);
      commit(target);
      if (instant) {
        idCardRef.current.reset();
        for (let i = 0; i < LEAVES; i++) snap(i, i < target ? 1 : 0);
        return;
      }
      // The ID card goes back into its holder first. A turn that flips the About page itself,
      // or covers it at once (a long jump snaps the far leaves), waits until the card is
      // seated. Other turns start together with the return, held back just enough (at most
      // 200ms) that the card is seated before the turning leaf reaches the left page, which
      // happens halfway through the swing.
      const wait = idCardRef.current.beginReturn();
      if (wait > 0) {
        let moves = 0;
        let flipsAbout = false;
        for (let i = 0; i < LEAVES; i++) {
          const cur = anims.current.get(i)?.final ?? prog.current[i];
          if (cur !== (i < target ? 1 : 0)) {
            moves++;
            if (i === ABOUT_LEAF) flipsAbout = true;
          }
        }
        if (flipsAbout || reducedRef.current || moves > S.maxVisibleJumpFlips) {
          // + two frames: the card's last frame lands on the next animation frame after `wait`
          pendingTurn.current = setTimeout(() => runFlips(spreadRef.current, from), wait + 40);
          return;
        }
        runFlips(target, from, clamp(wait - S.flipMs / 2, 0, 200));
        return;
      }
      runFlips(target, from);
    },
    [commit, runFlips, snap],
  );

  /* ---------- the URL hash is the source of truth ----------
     The route stays alive while you visit another page (cacheComponents keeps its state), so
     this effect re-runs when the page is shown again and re-reads the hash instead of trusting
     the old state. No hash means closed (when startClosed is on). */
  /* ---------- leaving for a case study, and undoing it ---------- */
  const resetLeaving = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.remove("bk-leaving", "bk-lifting");
    if (arrivingRef.current) {
      tabs.current.forEach((r) => r.reset());
      return; // the arriving slot stays hidden under the overlay until the hand over
    }
    root.querySelectorAll<HTMLElement>("[data-media-for]").forEach((m) => {
      m.style.visibility = "";
    });
    tabs.current.forEach((r) => r.reset());
  }, []);

  const openCaseStudy = useCallback(
    (stop: number) => {
      const s = SPREADS[stop - 1];
      const root = rootRef.current;
      if (!s || s.type !== "case-study" || !root) return;
      if (spreadRef.current !== stop) return;
      if (!tx) {
        router.push(s.href);
        return;
      }
      if (tx.isBusy()) return;
      // the video is printed across the fold in two halves, one on each page
      const medias = [...root.querySelectorAll<HTMLElement>(`[data-media-for="${s.id}"]`)];
      const T = S.transition;
      const ok = tx.run({
        href: s.href,
        flatten: async () => {
          root.classList.add("bk-leaving");
          tabs.current.get(stop)?.finish(T.flatten);
          await new Promise((r) => setTimeout(r, T.flatten));
        },
        measure: () => {
          // the video as it looks now: the raised card if it is up, else the two printed
          // halves together
          const card = medias.find(
            (m) => m.dataset.side === "c" && getComputedStyle(m).visibility === "visible",
          );
          if (card) {
            const rect = card.getBoundingClientRect();
            const clip = card.querySelector(".bk-vclip") ?? card;
            const scale = card.offsetWidth ? rect.width / card.offsetWidth : 1;
            return {
              rect,
              radius: (parseFloat(getComputedStyle(clip).borderTopRightRadius) || 0) * scale,
              video: card.querySelector("video"),
              placeholder: s.videoPlaceholder,
            };
          }
          const halves = medias.filter((m) => m.dataset.side !== "c");
          const rects = halves.map((m) => m.getBoundingClientRect());
          const left = Math.min(...rects.map((r) => r.left));
          const top = Math.min(...rects.map((r) => r.top));
          const right = Math.max(...rects.map((r) => r.right));
          const bottom = Math.max(...rects.map((r) => r.bottom));
          const main = halves.find((m) => m.dataset.side === "r") ?? halves[0] ?? root;
          const clip = main.querySelector(".bk-vclip") ?? main;
          const scale = main.offsetWidth ? rects[halves.indexOf(main)]?.width / main.offsetWidth || 1 : 1;
          return {
            rect: new DOMRect(left, top, right - left, bottom - top),
            radius: (parseFloat(getComputedStyle(clip).borderTopRightRadius) || 0) * scale,
            video: main.querySelector("video"),
            placeholder: s.videoPlaceholder,
          };
        },
        hideSource: () => {
          medias.forEach((m) => (m.style.visibility = "hidden"));
        },
        lift: () => root.classList.add("bk-lifting"),
        reset: resetLeaving,
      });
      if (!ok) return;
    },
    [router, tx, resetLeaving],
  );

  /* ---------- arriving back from a case study ----------
     Runs before the first paint, also when the cached homepage is shown again: the book is
     put open at the project's spread, flat and receded with its controls hidden, so the very
     first frame is already in that state. Then, once fonts are in and the slot holds still,
     it tells the transition layer where the slot is (or, with nothing flying, just settles). */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !tx || !bookEnabled()) return;
    const a = tx.readArrival();
    const fromCase = (tx.previousPath() ?? "").startsWith("/work/");
    if (!a && !fromCase) return;
    const hashStop = hashToSpread(window.location.hash);
    const stop = (a ? stopForSlug(a.slug) : 0) || hashStop;
    if (!stop) {
      tx.endArrival();
      return; // unknown: the normal path (closed, or the hash) takes over
    }
    const fly = !!a?.fly;
    const quiet = !!a?.reduced || reducedRef.current;
    const s = SPREADS[stop - 1];
    const medias = () =>
      s ? [...root.querySelectorAll<HTMLElement>(`[data-media-for="${s.id}"]:not([data-side="c"])`)] : [];

    arrivingRef.current = true;
    root.classList.remove("bk-leaving", "bk-lifting", "bk-settling");
    root.classList.add("bk-arriving");
    root.classList.toggle("bk-arriving-quiet", quiet);
    tabs.current.forEach((r) => r.reset());
    root.querySelectorAll<HTMLElement>("[data-media-for]").forEach((m) => (m.style.visibility = ""));
    if (fly) medias().forEach((m) => (m.style.visibility = "hidden"));
    goTo(stop, true);
    // this must land before the first paint (the video card has to be down in that frame)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArriving(true);

    let cancelled = false;
    let settled = false;
    const settle = () =>
      new Promise<void>((resolve) => {
        if (settled) return resolve();
        settled = true;
        root.classList.add("bk-settling");
        root.classList.remove("bk-arriving");
        window.setTimeout(() => {
          root.classList.remove("bk-settling", "bk-arriving-quiet");
          arrivingRef.current = false;
          setArriving(false);
          tx.endArrival();
          // focus the book's current page controls, and say where we are
          root
            .querySelector<HTMLElement>('.bk-dot[aria-current="true"]')
            ?.focus({ preventScroll: true });
          setAnnounce(
            book.ui.liveTemplate
              .replace("{n}", String(stop))
              .replace("{total}", String(SPREADS.length))
              .replace("{name}", SPREADS[stop - 1]?.name ?? ""),
          );
          resolve();
        }, quiet ? book.settings.transition.reducedFadeMs : RV.settle);
      });

    const slotBox = () => {
      const list = medias();
      if (!list.length) return null;
      const rects = list.map((m) => m.getBoundingClientRect());
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      const main = list.find((m) => m.dataset.side === "r") ?? list[0];
      const clip = main.querySelector(".bk-vclip") ?? main;
      const scale = main.offsetWidth ? rects[list.indexOf(main)].width / main.offsetWidth : 1;
      return {
        rect: new DOMRect(left, top, right - left, bottom - top),
        radius: (parseFloat(getComputedStyle(clip).borderTopRightRadius) || 0) * scale,
      };
    };

    (async () => {
      // ready: fonts loaded, two frames, and the slot in the same place for two frames
      const t0 = performance.now();
      try {
        await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, RV.readyTimeoutMs))]);
      } catch {
        /* ignore */
      }
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      await frame();
      await frame();
      let last = "";
      let same = 0;
      while (!cancelled && performance.now() - t0 < RV.readyTimeoutMs) {
        const b = slotBox()?.rect;
        const key = b ? [b.left, b.top, b.width, b.height].map((v) => v.toFixed(1)).join() : "none";
        same = key === last ? same + 1 : 0;
        last = key;
        if (same >= 2) break;
        await frame();
      }
      if (cancelled) return;
      if (!fly) {
        tx.endArrival();
        void settle();
        return;
      }
      tx.bookReady({
        measureSlot: slotBox,
        handover: (time) => {
          const list = medias();
          list.forEach((m) => {
            const v = m.querySelector("video");
            if (v && time != null) {
              try {
                v.currentTime = time;
              } catch {
                /* ignore */
              }
            }
          });
          list.forEach((m) => (m.style.visibility = ""));
        },
        settle,
      });
    })();

    return () => {
      cancelled = true;
      if (!settled) {
        // left before it finished (or a dev double run): come back to normal
        root.classList.remove("bk-arriving", "bk-settling", "bk-arriving-quiet");
        medias().forEach((m) => (m.style.visibility = ""));
        arrivingRef.current = false;
      }
    };
    // runs once per showing of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetLeaving(); // shown again (for example after Back): the book looks normal
    const sync = (instant: boolean) => {
      if (!bookEnabled()) return; // don't touch the hash while the list is showing
      const h = hashToSpread(window.location.hash);
      goTo(h > 0 ? h : S.startClosed ? 0 : 1, instant);
    };
    sync(true);
    announceOn.current = true;
    const onHash = () => sync(false);
    const onShow = () => sync(true);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    window.addEventListener("pageshow", onShow);
    // the name in the header: close the book to its cover
    const onClose = () => {
      if (bookEnabled()) goTo(0);
    };
    window.addEventListener(CLOSE_BOOK_EVENT, onClose);
    return () => {
      window.removeEventListener(CLOSE_BOOK_EVENT, onClose);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      window.removeEventListener("pageshow", onShow);
    };
  }, [goTo, resetLeaving]);

  useEffect(() => {
    reducedRef.current = reduced;
    const target = spreadRef.current;
    for (let i = 0; i < LEAVES; i++) snap(i, i < target ? 1 : 0);
  }, [reduced, snap]);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  /* ---------- sizes that the engine needs in px, plus the mobile closed scale ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const el = bookRef.current;
    if (!root || !el) return;
    const mql = window.matchMedia(S.desktopQuery);
    const update = () => {
      // bookThickness is a share of the cover height, which is the book's height
      thickPx.current = el.offsetHeight * S.bookThickness;
      // the ID card overlay floats ID_LAYER_Z above the page: scale it back so it projects at
      // exactly the page's size (the camera is over the spine)
      const persp = el.offsetWidth * S.perspectiveOfWidth;
      if (persp > ID_LAYER_Z) {
        root.style.setProperty("--idc-comp", ((persp - ID_LAYER_Z) / persp).toFixed(5));
      }
      for (let i = 0; i < LEAVES; i++) applyLeaf(i);
      applySlabs(true);
      if (!S.mobileBook || mql.matches) {
        root.style.removeProperty("--bk-fit");
        return;
      }
      const pageW = el.offsetWidth / 2;
      const fit = Math.max(1, ((S.mobileClosedCoverVw / 100) * window.innerWidth) / pageW);
      root.style.setProperty("--bk-fit", fit.toFixed(3));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mql.addEventListener("change", update);
    return () => {
      ro.disconnect();
      mql.removeEventListener("change", update);
    };
  }, [applyLeaf, applySlabs]);

  /* ---------- header alignment: the header's side padding follows the side arrows ----------
     Publishes the arrows' distance from the screen edge as --bk-arrow-inset on <html>; the
     header (components/Header.tsx) uses it while the book shows. The arrow's computed `left`
     is read (not its box), so the book's transforms never move it. Hidden (another page is
     showing, the homepage kept alive) or no arrows: the variable is removed. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const html = document.documentElement;
    const update = () => {
      const prev = prevArrowRef.current;
      const left = prev && prev.getClientRects().length ? parseFloat(getComputedStyle(prev).left) : NaN;
      if (Number.isFinite(left) && left > 0) html.style.setProperty("--bk-arrow-inset", `${left.toFixed(1)}px`);
      else html.style.removeProperty("--bk-arrow-inset");
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    return () => {
      ro.disconnect();
      html.style.removeProperty("--bk-arrow-inset");
    };
  }, []);

  /* ---------- mouse tilt: a small, smoothed extra tilt that follows a fine pointer ---------- */
  useEffect(() => {
    const el = parRef.current;
    if (!el || !S.mouseTilt || reduced) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let id = 0;
    const step = () => {
      id = 0;
      cur.x += (target.x - cur.x) * S.mouseTiltEase;
      cur.y += (target.y - cur.y) * S.mouseTiltEase;
      el.style.transform = `rotateX(${cur.y.toFixed(3)}deg) rotateY(${cur.x.toFixed(3)}deg)`;
      if (Math.abs(target.x - cur.x) > 0.01 || Math.abs(target.y - cur.y) > 0.01) {
        id = requestAnimationFrame(step);
      }
    };
    const kick = () => {
      if (!id) id = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = (e.clientX / window.innerWidth - 0.5) * 2 * S.mouseTiltDeg;
      target.y = -(e.clientY / window.innerHeight - 0.5) * 2 * S.mouseTiltDeg;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (id) cancelAnimationFrame(id);
      el.style.transform = "";
    };
  }, [reduced]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!bookEnabled() || arrivingRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const cur = spreadRef.current;
      if (e.key === "ArrowRight") goTo(cur + 1);
      else if (e.key === "ArrowLeft") goTo(cur - 1);
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(LAST);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  /* ---------- wheel / trackpad ---------- */
  useEffect(() => {
    const el = bookRef.current;
    if (!el || !S.wheelFlips) return;
    let acc = 0;
    let lastAt = 0;
    let locked = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const release = () => {
      if (anims.current.size > 0) timer = setTimeout(release, 60);
      else locked = false;
    };
    const onWheel = (e: WheelEvent) => {
      if (reducedRef.current) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (d === 0) return;
      const dir = d > 0 ? 1 : -1;
      const target = spreadRef.current + dir;
      if (target < 0 || target > LAST) return; // no turn possible: let the page scroll
      e.preventDefault();
      if (locked) {
        // swallow inertia until the wheel goes quiet and the flip has landed
        clearTimeout(timer);
        timer = setTimeout(release, 140);
        return;
      }
      const now = performance.now();
      if (now - lastAt > 200 || Math.sign(acc) !== dir) acc = 0;
      lastAt = now;
      acc += d;
      if (Math.abs(acc) >= S.wheelThreshold) {
        acc = 0;
        locked = true;
        goTo(target);
        clearTimeout(timer);
        timer = setTimeout(release, 140);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(timer);
    };
  }, [goTo]);

  /* ---------- pointer drag ---------- */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as Element).closest("a, button, [data-nodrag]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const onRight = e.clientX > rect.left + rect.width / 2;
    const leaf = onRight ? spreadRef.current : spreadRef.current - 1;
    if (leaf < 0 || leaf >= LEAVES) return;
    drag.current = {
      leaf,
      pointerId: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      p0: prog.current[leaf] >= 0.5 ? 1 : 0,
      started: false,
      samples: [{ t: e.timeStamp, x: e.clientX }],
      raw: prog.current[leaf] >= 0.5 ? 1 : 0,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.started) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
      d.started = true;
      anims.current.delete(d.leaf);
      setWillChange(d.leaf, true);
      setMoving(d.leaf, true);
      setSettled(false);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best effort */
      }
      e.currentTarget.classList.add("is-dragging");
      idCardRef.current.beginReturn(); // the ID card goes back as the page starts to turn
    }
    const span = e.currentTarget.offsetWidth * S.dragSpanOfBook;
    let p = clamp(d.p0 - dx / span, 0, 1);
    d.raw = p;
    if (idCardRef.current.remaining() > 0) {
      // until the card is seated: the About page itself stays down, and a leaf turning toward
      // it stops short of the fold
      p = d.leaf === ABOUT_LEAF ? d.p0 : d.p0 === 0 ? Math.min(p, 0.45) : Math.max(p, 0.55);
    }
    prog.current[d.leaf] = p;
    applyLeaf(d.leaf);
    applySlabs();
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    if (!d.started) return;
    e.currentTarget.classList.remove("is-dragging");
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    // decide from the drag the user made, even if the leaf was held back for the ID card
    const p = d.raw;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const v = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
    const moved = Math.abs(p - d.p0);
    const fast = moved > 0.03 && (d.p0 === 0 ? v < -S.flickVelocity : v > S.flickVelocity);
    const finish = !cancelled && (moved > S.dragCommit || fast);
    const to = finish ? 1 - d.p0 : d.p0;
    if (finish) commit(d.p0 === 0 ? d.leaf + 1 : d.leaf);
    // a turn released while the ID card is still going back waits until it is seated
    const wait = finish ? idCardRef.current.remaining() : 0;
    flipTo(d.leaf, to, { settle: finish, delay: wait > 0 ? wait + 40 : 0 });
  };


  /* ---------- derived view state ---------- */
  const stops = Array.from({ length: LAST + 1 }, (_, k) => ({
    id: k === 0 ? "cover" : stopId(k),
    name: stopName(k),
    target: k,
  }));
  const frontActive = (i: number) => spread === i;
  const backActive = (i: number) => spread === i + 1;
  const isOpen = spread > 0 && spread < BACK;
  const isBack = spread === BACK;

  const rootStyle = {
    "--bk-page": book.colors.page,
    "--page-tint-pct": `${S.pageTintPct}%`,
    "--ki-top": `${S.keyImpact.notesTopPct}%`,
    "--ki-bottom": `${S.keyImpact.notesTopPct + S.keyImpact.noteHeightPct}%`,
    "--spine-peak": "32%",
    "--bk-cover": book.colors.cover,
    "--bk-cover-text": book.colors.coverText,
    "--bk-edge": book.colors.edge,
    "--bk-cover-edge": book.colors.coverEdge,
    "--backcover-bg": BACK_COVER_BG,
    "--bk-edge-line": book.colors.edgeLine,
    "--bk-hinge": book.colors.hinge,
    "--bk-note": book.colors.note,
    "--bk-ink": book.colors.ink,
    "--bk-muted": book.colors.muted,
    "--bk-dash": book.colors.dash,
    "--bk-accent": `var(--accent, ${S.accentFallback})`,
    "--bk-green": ID.settings.colors.accent, // the ID card's green, used for a few notes
    "--aspect": S.bookAspect,
    "--book-scale": S.bookScale,
    "--pop-w": S.videoWidthOfSpread,
    "--card-lift": `${S.cardLiftPx}px`,
    "--tab-pull": S.tabPullOfPage,
    "--card-rise-ms": `${S.cardRiseMs}ms`,
    "--card-sink-ms": `${S.cardSinkMs}ms`,
    "--tab-nudge-ms": `${S.tabNudgeMs}ms`,
    "--tab-hint-ms": `${S.tabHintMs}ms`,
    "--flip-ms": `${S.flipMs}ms`,
    "--tx-flatten": `${S.transition.flatten}ms`,
    "--tx-lift": `${S.transition.lift}ms`,
    "--tx-book-scale": S.transition.bookScale,
    "--tx-book-opacity": S.transition.bookOpacity,
    "--rv-settle": `${S.transition.reverse.settle}ms`,
    "--tx-reduced-fade": `${S.transition.reducedFadeMs}ms`,
    "--max-w-vw": S.maxBookWidthVw,
    "--max-w": `${S.maxBookWidthPx}px`,
    "--stage-gap": `${S.stageGapPx}px`,
    "--arrow-space": S.sideArrows ? `${S.sideArrowSpacePx}px` : "0px",
    "--arrow-w": `${S.sideArrowWidthPx}px`,
    "--book-thickness": S.bookThickness,
    "--wt": W_TOTAL,
    "--edge-shade": S.edgeShade,
    "--r-of-w": S.cornerRadiusOfWidth,
    "--r-min": `${S.cornerRadiusMinPx}px`,
    "--hide-delay": `${S.hideDelayMs}ms`,
    "--tilt-ms": `${S.tiltMs}ms`,
    "--tilt-closed-x": `${S.tiltClosed.x}deg`,
    "--tilt-closed-y": `${S.tiltClosed.y}deg`,
    "--tilt-open-x": `${S.tiltOpen.x}deg`,
    "--tilt-open-y": `${S.tiltOpen.y}deg`,
    "--glow-strength": `${S.glowStrength * 100}%`,
    "--glow-reach": `${S.glowReachPct}%`,
    "--n": LEAVES,
    "--eps": `${EPS}px`,
    "--persp-k": S.perspectiveOfWidth,
    "--po-closed": S.perspectiveOriginClosed,
    "--cover-note-color": book.cover.noteColor,
  } as CSSProperties;

  const pageApi = useMemo<BookPageApi>(
    () => ({
      spread,
      settled,
      reduced,
      hintFor,
      openCaseStudy,
      prefetch: (href) => router.prefetch(href),
      isBusy: () => (tx?.isBusy() ?? false) || arrivingRef.current,
      arriving,
      registerTab: (stop, r) => {
        if (r) tabs.current.set(stop, r);
        else tabs.current.delete(stop);
      },
      idCard,
      idCardId: ID_CARD_ID,
    }),
    [spread, settled, reduced, hintFor, openCaseStudy, router, tx, idCard, arriving],
  );

  const arrow = (
    <svg viewBox="0 0 72 40" fill="none" aria-hidden="true">
      <path
        d="M4 25 C 18 15, 40 11, 64 19"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M53 9 C 58 13, 62 16, 65 19 C 61 22, 57 26, 54 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      ref={rootRef}
      className={[
        "bk-root",
        reduced ? "bk-reduced" : "",
        isOpen ? "is-open" : "",
        isBack ? "is-back" : "",
        S.stageGlow ? "has-glow" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-video-spread={SPREADS[spread - 1]?.type === "case-study" ? "" : undefined}
      data-key-impact={(() => {
        const cs = SPREADS[spread - 1];
        return cs?.type === "case-study" && cs.keyImpact ? "" : undefined;
      })()}
      style={{ ...rootStyle, ...spineStyle(SPREADS[spread - 1]) } as CSSProperties}
    >
      <BookPageCtx.Provider value={pageApi}>
      {/* the page's heading, for screen readers (the cover itself carries no title) */}
      <h1 className="sr-only">{siteContent.title}</h1>
      <nav className="bk-skip" aria-label={book.ui.skipHeading}>
        <p>{book.ui.skipHeading}</p>
        <ul>
          {book.skipLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={stageRef} className="bk-stage">
        {S.sideArrows && (
          <button
            ref={prevArrowRef}
            type="button"
            className="bk-side bk-side-prev"
            aria-label={book.ui.prevLabel}
            disabled={spread === 0}
            onClick={() => goTo(spreadRef.current - 1)}
          >
            {arrow}
          </button>
        )}

        <div className="bk-tilt">
          <div ref={parRef} className="bk-par">
            <div
              ref={bookRef}
              className="bk-book"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => endDrag(e, false)}
              onPointerCancel={(e) => endDrag(e, true)}
              onClickCapture={(e) => {
                if (suppressClick.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="bk-floor" aria-hidden="true" />

              {/* two solid blocks; their depth is set from the leaf progress values */}
              {S.showThickness &&
                (["l", "r"] as const).map((side) => (
                <div
                  key={side}
                  ref={side === "l" ? slabL : slabR}
                  className={`bk-slab bk-slab-${side}`}
                  aria-hidden="true"
                >
                  {EDGE_FACES[side].map((f, k) => (
                    <i
                      key={k}
                      className="bk-ef"
                      style={
                        {
                          left: f.left,
                          top: f.top,
                          width: f.width,
                          "--ang": `${f.angle.toFixed(3)}deg`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              ))}

              {Array.from({ length: LEAVES }, (_, i) => (
                <div
                  key={i}
                  className="bk-leaf"
                  data-leaf={i}
                  ref={(el) => {
                    leafEls.current[i] = el;
                  }}
                  style={{ "--i": i, "--w": LEAF_W(i) } as CSSProperties}
                >
                  <i className="bk-ledge bk-ledge-b" aria-hidden="true" />
                  <i className="bk-ledge bk-ledge-s" aria-hidden="true" />
                  {i === 0 ? (
                    <Face
                      side="front"
                      className="bk-cover"
                      active={frontActive(0)}
                      button={book.ui.openBook}
                      onClick={() => spreadRef.current === 0 && goTo(1)}
                    >
                      <CoverNotes />
                      <CoverContributions />
                    </Face>
                  ) : i === LEAVES - 1 ? (
                    // the back board: the inside is the last spread's right page, a chalk
                    // sketch of Vidhana Soudha under the current Bengaluru sky
                    <Face side="front" className="bk-board-face" active={frontActive(i)}>
                      <BackCoverScene stop={i} />
                    </Face>
                  ) : (
                    <Face side="front" active={frontActive(i)} tint={tintOf(SPREADS[i - 1])}>
                      <RightPage spread={SPREADS[i - 1]} stop={i} />
                    </Face>
                  )}
                  {i === LEAVES - 1 ? (
                    // the outside of the back board: shows when the book is closed at the end
                    <Face
                      side="back"
                      className="bk-cover bk-back-cover"
                      active={backActive(i)}
                      button={book.ui.openBook}
                      onClick={() => spreadRef.current === BACK && goTo(BACK - 1)}
                    >
                      <div
                        className="bk-back-note"
                        style={
                          {
                            "--back-note-size": `min(${book.cover.backNoteSizePx}px, ${(
                              (book.cover.backNoteSizePx / 530) *
                              100
                            ).toFixed(3)}cqw)`,
                          } as CSSProperties
                        }
                      >
                        <svg viewBox="0 0 32 28" fill="none" aria-hidden="true">
                          <path
                            d="M16 25 C 9 19, 3 14, 4 8.5 C 5 4, 10 2.5, 13 5.5 C 14.5 7, 15.5 8.5, 16 10 C 16.8 7.6, 18.5 5, 21.5 4 C 26 2.8, 29.5 6.5, 28 11.5 C 26.5 16.5, 21 20.5, 16 25 Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p>{book.cover.backNote}</p>
                      </div>
                    </Face>
                  ) : (
                    <Face side="back" active={backActive(i)} tint={tintOf(SPREADS[i])}>
                      <LeftPage spread={SPREADS[i]} stop={i + 1} />
                    </Face>
                  )}
                </div>
              ))}

              {Array.from({ length: LEAVES }, (_, i) => (
                <div
                  key={i}
                  className="bk-cast"
                  data-side="r"
                  aria-hidden="true"
                  ref={(el) => {
                    castEls.current[i] = el;
                  }}
                />
              ))}

              <div className="bk-spine" aria-hidden="true" />

              {/* the raised video card, one per case-study spread (see SpreadCard) */}
              {SPREADS.map((sp, idx) =>
                sp.type === "case-study" ? (
                  <SpreadCard key={sp.id} spread={sp} stop={idx + 1} />
                ) : null,
              )}
              {/* the ID card while it is out of its holder: over the About spread's left page,
                  outside the page so nothing clips it (see IdCardHolder) */}
              {ABOUT_STOP > 0 && (
                <div className="idc-layer" inert={spread !== ABOUT_STOP}>
                  <IdCardHolder
                    data={ID.card}
                    settings={ID.settings}
                    ctl={idCard}
                    layer="overlay"
                    cardId={ID_CARD_ID}
                  />
                </div>
              )}
              <div className="bk-note" aria-hidden="true">
                <span>{book.ui.openNote}</span>
                <svg viewBox="0 0 60 50" fill="none">
                  <path
                    d="M6 8 C 30 2, 50 14, 42 40"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M33 33 L42 42 L49 31"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {S.sideArrows && (
          <button
            type="button"
            className="bk-side bk-side-next"
            aria-label={book.ui.nextLabel}
            disabled={spread === LAST}
            onClick={() => goTo(spreadRef.current + 1)}
          >
            {arrow}
          </button>
        )}
      </div>

      <nav className="bk-dots" aria-label={book.ui.dotsLabel}>
        <ul>
          {stops.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className="bk-dot"
                aria-label={`${book.ui.jumpPrefix} ${d.name}`}
                aria-current={spread === d.target ? "true" : undefined}
                onClick={() => goTo(d.target)}
              >
                <span className="bk-tip" aria-hidden="true">
                  {d.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announce}
      </div>
      </BookPageCtx.Provider>
    </div>
  );
}
