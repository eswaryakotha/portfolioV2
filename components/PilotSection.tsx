"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { PilotData } from "@/data/content";
import VideoFrame from "@/components/VideoFrame";
import LoopClip from "@/components/LoopClip";

// "Building and validating the pilot": video frame, intro, stat strip, four cards
// (they fade up in sequence when 30% visible).
// The final state is the default, so it shows with reduced motion or no JS.

const BRIGHT = "var(--accent-bright, var(--accent))";
const STEP_MS = 150;

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp aria-hidden="true" size={30} strokeWidth={1.5} color={BRIGHT} />;
}

export default function PilotSection({ data }: { data: PilotData }) {
  const list = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<"final" | "hidden" | "shown">("final");

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    setPhase("hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPhase("shown");
        io.disconnect();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cardStyle = (i: number): React.CSSProperties =>
    phase === "final"
      ? {}
      : {
          opacity: phase === "hidden" ? 0 : 1,
          transform: phase === "hidden" ? "translateY(8px)" : "translateY(0)",
          transition: phase === "hidden" ? "none" : `opacity 250ms ease ${i * STEP_MS}ms, transform 250ms ease ${i * STEP_MS}ms`,
        };

  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">{data.heading}
        {data.videoNote && (
          <span className="normal-case tracking-normal" style={{ marginLeft: 8 }}>
            ({data.videoNote})
          </span>
        )}
      </h2>

      {data.clips && data.clips.length > 0 ? (
        <ul className="list-none p-0 m-0 flex flex-col" style={{ gap: 12 }}>
          {data.clips.map((c, i) => (
            <Fragment key={c.videoUrl}>
              <li>
                <h3 className="text-sm font-semibold text-gray-900" style={{ margin: "0 0 4px" }}>
                  {c.title}
                </h3>
                <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: "0 0 12px" }}>
                  {c.text}
                </p>
                <LoopClip src={c.videoUrl} poster={c.poster} label={c.title} crop={c.crop} notes={c.notes} />
              </li>
              {/* flow arrow to the next step, same thin accent stroke and open head as the process flowcharts */}
              {i < data.clips!.length - 1 && (
                <li aria-hidden="true" role="presentation" style={{ display: "flex", justifyContent: "center", listStyle: "none" }}>
                  <svg width="16" height="36" viewBox="0 0 16 36" fill="none" style={{ display: "block", overflow: "visible" }}>
                    <g stroke={BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 8,2 L 8,33" />
                      <path d="M 3,27 L 8,34 L 13,27" />
                    </g>
                  </svg>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      ) : (
        <VideoFrame
          videoUrl={data.videoUrl}
          poster={data.poster}
          crop={data.videoCrop}
          placeholderLabel="[Pilot demo video coming soon]"
          title={data.videoUrl ? "Pilot demo video" : "Pilot demo video (placeholder)"}
        />
      )}
      {data.showDetails !== false && (
        <>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 40 }}>
        {data.intro}
      </p>

      <ul className="grid grid-cols-1 min-[600px]:grid-cols-3 list-none p-0 m-0" style={{ gap: 24, marginTop: 32 }}>
        {data.stats.map((s) => (
          <li key={s.label}>
            <span style={{ display: "block", fontSize: 40, lineHeight: 1.1, fontWeight: 600, color: "var(--accent)" }}>{s.value}</span>
            <span className="font-mono text-gray-400 uppercase" style={{ display: "block", marginTop: 6, fontSize: 11, letterSpacing: "0.06em" }}>
              {s.label}
            </span>
          </li>
        ))}
      </ul>

      <ul
        ref={list}
        className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[768px]:auto-rows-fr list-none p-0 m-0"
        style={{ gap: 20, marginTop: 32 }}
      >
        {data.cards.map((c, i) => (
          <li
            key={c.title}
            className="border border-gray-200 bg-white flex flex-col"
            style={{ padding: 18, borderRadius: 4, gap: 8, ...cardStyle(i) }}
          >
            <Icon name={c.icon} />
            <h3 className="text-base font-semibold text-gray-900" style={{ margin: 0 }}>
              {c.title}
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
              {c.text}
            </p>
          </li>
        ))}
      </ul>
        </>
      )}
    </section>
  );
}
