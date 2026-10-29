"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";

// Decorative animated icon scenes for the story-strip boxes. CSS keyframes only,
// animating transform and opacity. A scene starts when its box is 30% visible, runs
// its pop-in once, and keeps its loops going only while the box is in view. The
// default (server) state is the final static one, so reduced motion and no-JS show
// every scene at rest. All of it is aria-hidden; the box text carries the meaning.

const BRIGHT = "var(--accent-bright, var(--accent))";
const MAIN = "var(--accent)";
const GRAY = "#9CA3AF";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type SceneKind = "coinDrop" | "pile" | "question";

function Icon({ name, size, color, style }: { name: string; size: number; color: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={1.5} color={color} style={{ display: "block", ...style }} />;
}

const CSS = `
.ss-wrap{position:relative;width:120px;height:120px;margin:0 auto;flex-shrink:0}
.ss{position:absolute;left:0;top:0;width:120px;height:120px;transform-origin:0 0}
.ss *{will-change:auto}
.ss .a{position:absolute}
@media (max-width:767px){.ss-wrap{width:90px;height:90px}.ss{transform:scale(.75)}}

/* final static state is the default; "armed" hides the animated bits until the box is seen */
.ss[data-state="armed"] .coin,.ss[data-state="armed"] .dollar,.ss[data-state="armed"] .pop,.ss[data-state="armed"] .qm{opacity:0}
.ss[data-state="armed"] .pop{transform:scale(.6)}
.ss[data-state="run"] *{animation-play-state:running}
.ss[data-play="paused"] *{animation-play-state:paused !important}

.ss .coin{opacity:1;transform:translateY(8px)}
.ss .dollar{opacity:.8}
.ss[data-state="run"] .coin{animation:ss-coin 2.6s ease-in infinite}
.ss[data-state="run"] .wallet{animation:ss-squash 2.6s ease-in-out infinite}
.ss[data-state="run"] .dollar{animation:ss-dollar 2.6s ease-out infinite}
@keyframes ss-coin{0%{opacity:0;transform:translateY(-22px)}12%{opacity:1}58%{opacity:1;transform:translateY(14px)}72%{opacity:0;transform:translateY(24px)}100%{opacity:0;transform:translateY(24px)}}
@keyframes ss-squash{0%,58%{transform:scale(1)}66%{transform:scale(.96)}76%,100%{transform:scale(1)}}
@keyframes ss-dollar{0%,55%{opacity:0;transform:translateY(0)}68%{opacity:.8}100%{opacity:0;transform:translateY(-22px)}}

.ss[data-state="run"] .pop{animation:ss-pop 250ms ease-out both;animation-delay:var(--d)}
@keyframes ss-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
.ss[data-state="run"] .float{animation:ss-float var(--fd) ease-in-out infinite;animation-delay:calc(var(--d) + 250ms)}
@keyframes ss-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

.ss[data-state="run"] .bob{animation:ss-bob 3.6s ease-in-out infinite}
@keyframes ss-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-6px) rotate(3deg)}}
.ss .qm{opacity:.7}
.ss[data-state="run"] .qm{animation:ss-qm 3.2s ease-in-out infinite;animation-delay:var(--d)}
@keyframes ss-qm{0%{opacity:0;transform:scale(.6)}15%{opacity:.8;transform:scale(1)}55%{opacity:.8;transform:scale(1)}80%,100%{opacity:0;transform:scale(1)}}

@media (prefers-reduced-motion:reduce){.ss *{animation:none !important}}
`;

function Pile({ icons }: { icons: string[] }) {
  // [sticky A, sticky B, chat A, chat B], scattered like a messy pile
  const spec = [
    { left: 10, top: 12, size: 44, rot: -8, d: 0, fd: 3.2, color: MAIN },
    { left: 52, top: 54, size: 44, rot: 6, d: 250, fd: 3.8, color: BRIGHT },
    { left: 14, top: 62, size: 40, rot: 0, d: 500, fd: 2.8, color: BRIGHT },
    { left: 60, top: 8, size: 40, rot: 0, d: 750, fd: 3.4, color: BRIGHT },
  ];
  return (
    <>
      {icons.slice(0, 4).map((name, i) => {
        const s = spec[i];
        return (
          <span key={i} className="a pop" style={{ left: s.left, top: s.top, ["--d" as string]: `${s.d}ms` }}>
            <span className="float" style={{ display: "block", ["--fd" as string]: `${s.fd}s` }}>
              <Icon name={name} size={s.size} color={s.color} style={{ transform: s.rot ? `rotate(${s.rot}deg)` : undefined }} />
            </span>
          </span>
        );
      })}
    </>
  );
}

export default function StripScene({ kind, icons }: { kind: SceneKind; icons: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "armed" | "run">("static");
  const [play, setPlay] = useState<"running" | "paused">("running");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    setState("armed");
    const box = el.closest("li") ?? el;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("run");
          setPlay("running");
        } else {
          setPlay("paused");
        }
      },
      { threshold: 0.3 }
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const [a, b] = icons;
  return (
    <div className="ss-wrap" aria-hidden="true">
      <style>{CSS}</style>
      <div ref={ref} className="ss" data-state={state} data-play={play}>
        {kind === "coinDrop" && (
          <>
            <span className="a wallet" style={{ left: 28, top: 44, transformOrigin: "50% 100%" }}>
              <Icon name={a} size={64} color={MAIN} />
            </span>
            <span className="a coin" style={{ left: 48, top: 10 }}>
              <Icon name={b} size={24} color={BRIGHT} />
            </span>
            <span className="a dollar font-mono" style={{ left: 92, top: 44, fontSize: 14, color: GRAY }}>
              $
            </span>
          </>
        )}
        {kind === "pile" && <Pile icons={icons} />}
        {kind === "question" && (
          <>
            <span className="a bob" style={{ left: 28, top: 30 }}>
              <Icon name={a} size={64} color={MAIN} />
            </span>
            <span className="a qm" style={{ left: 92, top: 14, fontFamily: "var(--font-caveat), cursive", fontSize: 26, color: GRAY, ["--d" as string]: "0s" }}>
              ?
            </span>
            <span className="a qm" style={{ left: 10, top: 78, fontFamily: "var(--font-caveat), cursive", fontSize: 22, color: GRAY, ["--d" as string]: "1.4s" }}>
              ?
            </span>
          </>
        )}
      </div>
    </div>
  );
}
