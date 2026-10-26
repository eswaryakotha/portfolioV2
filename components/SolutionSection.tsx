"use client";

import type { ReactNode, CSSProperties } from "react";
import { Play } from "lucide-react";
import EngineeringDecision from "@/components/EngineeringDecision";
import type { SolutionData, DiagramStep, SolutionTechCard } from "@/data/content";

const ORANGE = "var(--accent)";
const NEAR_BLACK = "#111"; // used only outside the board (e.g. video play icon)
const CARD_BORDER = "#e5e7eb";
const FRAME_BG = "#eeeeec";
const COL_GAP = 14;

// Board-scoped soft-black tokens — resolved via CSS variables set on the board container
const BOARD_INK = "var(--board-ink)";  // text: step/card titles, bold labels
const BOARD_LINE = "var(--board-line)"; // borders: step cards, dark insight cards

// Fixed per-index rotations for sticky-note cards (degrees)
const ROTATIONS = [-0.4, 0.3, -0.5, 0.2, -0.3, 0.4, -0.2, 0.5, -0.4, 0.3, -0.5, 0.2, -0.3, 0.4, -0.2];
const rot = (i: number) => `${ROTATIONS[i % ROTATIONS.length]}deg`;

const BOARD_STYLE = {
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: 8,
  backgroundColor: "#f9f9f7",
  backgroundImage: "radial-gradient(circle, #bebebb 1px, transparent 1px)",
  backgroundSize: "24px 24px",
  padding: 16,
  "--board-line": "#3A3A3A",
  "--board-ink": "#2B2B2B",
} as CSSProperties;

// ── helpers ──────────────────────────────────────────────────

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  const lo = url.match(/loom\.com\/share\/([a-f0-9]+)/);
  if (lo) return `https://www.loom.com/embed/${lo[1]}`;
  return null;
}

// ── Miro frame ────────────────────────────────────────────────

function MiroFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{
      position: "relative",
      border: `1px solid ${CARD_BORDER}`,
      borderRadius: 4,
      background: FRAME_BG,
      padding: 14,
      paddingTop: 28,
    }}>
      <span style={{
        position: "absolute",
        top: -1,
        left: -1,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 9,
        color: "#888",
        background: FRAME_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderBottom: `1px solid ${FRAME_BG}`,
        padding: "2px 8px 3px",
        borderRadius: "3px 3px 0 0",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        lineHeight: 1,
        userSelect: "none",
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

// ── Sticky insight card ───────────────────────────────────────

function InsightCard({ title, body, rotIdx, darkBorder }: {
  title: string;
  body: string;
  rotIdx: number;
  darkBorder: boolean;
}) {
  return (
    <li style={{
      border: `1px solid ${darkBorder ? BOARD_LINE : CARD_BORDER}`,
      borderRadius: 4,
      padding: "10px 12px",
      background: "#fff",
      listStyle: "none",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      transform: `rotate(${rot(rotIdx)})`,
    }}>
      <strong style={{ fontSize: 12, display: "block", marginBottom: 5, color: BOARD_INK, lineHeight: 1.4 }}>
        {title}
      </strong>
      <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.5 }}>
        {body}
      </p>
    </li>
  );
}

// ── TechCard ──────────────────────────────────────────────────

function TechCard({ card, rotIdx }: { card: SolutionTechCard; rotIdx: number }) {
  return (
    <li style={{
      border: `1px solid ${card.isAI ? ORANGE : CARD_BORDER}`,
      borderRadius: 4,
      padding: "5px 7px",
      background: "#fff",
      listStyle: "none",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      transform: `rotate(${rot(rotIdx)})`,
      position: "relative",
    }}>
      {card.isAI && <span className="sr-only">Uses an outside AI service. </span>}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
        {card.isAI && (
          <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
        )}
        <strong style={{ fontSize: 11, fontWeight: 700, color: BOARD_INK, lineHeight: 1.3 }}>
          {card.name}
        </strong>
      </div>
      <p style={{ fontSize: 11, color: "#666", margin: 0, lineHeight: 1.4 }}>
        {card.description}
      </p>
    </li>
  );
}

// ── Step card (desktop) ───────────────────────────────────────

function StepCardDesktop({ step, index }: { step: DiagramStep; index: number }) {
  return (
    <div style={{
      border: `1px solid ${BOARD_LINE}`,
      borderRadius: 4,
      padding: "8px 10px",
      height: "100%",
      boxSizing: "border-box",
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      transform: `rotate(${rot(index)})`,
    }}>
      <span className="font-mono" style={{ fontSize: 10, color: ORANGE, display: "block", marginBottom: 4 }}>
        {String(step.number).padStart(2, "0")}
      </span>
      <strong style={{ fontSize: 13, display: "block", marginBottom: 3, color: BOARD_INK }}>
        {step.title}
      </strong>
      <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.4 }}>
        {step.description}
      </p>
    </div>
  );
}

// ── Video part ────────────────────────────────────────────────

function VideoPart({ data }: { data: SolutionData["part1"] }) {
  const { videoUrl, videoPoster, subLabel } = data;
  const isMp4 = !!videoUrl && videoUrl.endsWith(".mp4");
  const embed = videoUrl && !isMp4 ? toEmbedUrl(videoUrl) : null;
  const showPlaceholder = !videoUrl || (!isMp4 && !embed);

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-4">{subLabel}</p>
      <div
        className="aspect-video w-full"
        style={{
          border: showPlaceholder ? "1px dashed #bbb" : "none",
          background: showPlaceholder ? "#f9f9f7" : "#000",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {showPlaceholder ? (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Play size={40} strokeWidth={1.5} color={NEAR_BLACK} />
            <span className="font-mono text-xs text-gray-400">[Demo video coming soon]</span>
          </div>
        ) : isMp4 ? (
          <video
            controls playsInline preload="metadata"
            src={videoUrl!} poster={videoPoster || undefined}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        ) : (
          <iframe
            src={embed!} title="Demo video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
        )}
      </div>
    </div>
  );
}

// ── Workflow part ─────────────────────────────────────────────

function WorkflowPart({ data }: { data: SolutionData["part2"] }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{data.introLine}</p>

      {/* ── Desktop board (≥1100px) ─────────────────────── */}
      <div className="hidden min-[1100px]:block">
        <div style={BOARD_STYLE}>

          {/* AUTHOR JOURNEY frame */}
          <MiroFrame label="AUTHOR JOURNEY">
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: COL_GAP }}>
              {data.steps.map((step, i) => (
                <li key={step.number} style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
                  <StepCardDesktop step={step} index={i} />
                  {i < data.steps.length - 1 && (
                    <svg
                      aria-hidden="true"
                      width="20" height="10" viewBox="0 0 20 10"
                      style={{ position: "absolute", right: -17, top: "50%", transform: "translateY(-50%)" }}
                    >
                      <line x1="1" y1="5" x2="16" y2="5" stroke="#ccc" strokeWidth="1" />
                      <path d="M 13,2.5 L 17,5 L 13,7.5" fill="none" stroke="#ccc" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              ))}
            </ol>

            {/* Handwritten annotation with curved arrow toward step 3 */}
            <div aria-hidden="true" style={{ position: "relative", marginTop: 10, height: 34 }}>
              <span style={{
                position: "absolute",
                left: "calc(16% + 25px)",
                top: 14,
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 14,
                color: ORANGE,
                whiteSpace: "nowrap",
              }}>
                The AI suggests, the author decides
              </span>
              {/* Curved arrow pointing up-right toward "Decide" (step 3) */}
              <svg
                aria-hidden="true"
                width="44" height="36" viewBox="0 0 44 36"
                style={{ position: "absolute", left: "calc(38% + 12px)", top: -10, overflow: "visible" }}
              >
                <path d="M 4,32 Q 16,12 38,4" fill="none" stroke={ORANGE} strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 35,2 L 39,4 L 35,8" fill="none" stroke={ORANGE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </MiroFrame>

          {/* Step → card vertical connectors */}
          <div aria-hidden="true" style={{ display: "flex", gap: COL_GAP, height: 18, padding: "0 15px" }}>
            {data.steps.map((step) => (
              <div key={step.number} style={{ flex: "1 1 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <svg width="8" height="14" viewBox="0 0 8 14">
                  <line x1="4" y1="0" x2="4" y2="10" stroke="#ccc" strokeWidth="1" />
                  <path d="M 2,8 L 4,12 L 6,8" fill="none" stroke="#ccc" strokeWidth="1" />
                </svg>
              </div>
            ))}
          </div>

          {/* UNDER THE HOOD frame */}
          <MiroFrame label="UNDER THE HOOD">
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <strong className="font-mono" style={{ fontSize: 11, color: BOARD_INK }}>
                {data.underTheHoodTitle}
              </strong>
              <span className="font-mono" style={{ fontSize: 11, color: "#666" }}>
                {data.underTheHoodSubtitle}
              </span>
            </div>
            <div style={{ display: "flex", gap: COL_GAP }}>
              {data.steps.map((step, si) => (
                <div key={step.number} style={{ flex: "1 1 0", minWidth: 0 }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    {step.cards.map((card, ci) => (
                      <TechCard key={card.name} card={card} rotIdx={si * 5 + ci + 7} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Legend chip */}
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fff", border: `1px solid ${CARD_BORDER}`,
                borderRadius: 4, padding: "3px 8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                <span aria-hidden="true" style={{ width: 10, height: 10, border: `1.5px solid ${ORANGE}`, borderRadius: 2, flexShrink: 0 }} />
                <span className="font-mono" style={{ fontSize: 10, color: "#666" }}>{data.legendLabel}</span>
              </div>
            </div>
          </MiroFrame>

          {/* WHAT SETS IT APART frame */}
          <div style={{ marginTop: 8 }}>
            <MiroFrame label="WHAT SETS IT APART">
              <p className="font-mono" style={{ fontSize: 11, color: "#666", marginBottom: 10, marginTop: 0 }}>
                {data.whatSetsApart.subtitle}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {data.whatSetsApart.cards.map((card, i) => (
                  <InsightCard key={card.title} title={card.title} body={card.body} rotIdx={i} darkBorder />
                ))}
              </ul>
            </MiroFrame>
          </div>

          {/* AROUND THE BUILD frame */}
          <div style={{ marginTop: 8 }}>
            <MiroFrame label="AROUND THE BUILD">
              <p className="font-mono" style={{ fontSize: 11, color: "#666", marginBottom: 10, marginTop: 0 }}>
                {data.aroundTheBuild.subtitle}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {data.aroundTheBuild.cards.map((card, i) => (
                  <InsightCard key={card.title} title={card.title} body={card.body} rotIdx={i + 4} darkBorder={false} />
                ))}
              </ul>
            </MiroFrame>
          </div>

        </div>
      </div>

      {/* ── Mobile board (<1100px) ───────────────────────── */}
      <div className="block min-[1100px]:hidden">
        <div style={BOARD_STYLE}>

          {/* Steps + tech cards combined */}
          <MiroFrame label="WORKFLOW">
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0 }}>
              {data.steps.map((step, i) => (
                <li key={step.number}>
                  <div style={{
                    border: `1px solid ${BOARD_LINE}`, borderRadius: 4,
                    padding: "8px 12px", display: "flex", gap: 10, alignItems: "flex-start",
                    background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}>
                    <span className="font-mono" style={{ fontSize: 10, color: ORANGE, paddingTop: 2, flexShrink: 0 }}>
                      {String(step.number).padStart(2, "0")}
                    </span>
                    <div>
                      <strong style={{ fontSize: 13, display: "block", marginBottom: 2, color: BOARD_INK }}>
                        {step.title}
                      </strong>
                      <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.4 }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ borderLeft: `2px solid ${CARD_BORDER}`, marginLeft: 14, paddingLeft: 12, paddingTop: 6, paddingBottom: i < data.steps.length - 1 ? 6 : 0 }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                      {step.cards.map((card, ci) => (
                        <TechCard key={card.name} card={card} rotIdx={i * 5 + ci} />
                      ))}
                    </ul>
                  </div>
                  {i < data.steps.length - 1 && (
                    <div aria-hidden="true" style={{ paddingLeft: 10, paddingTop: 2, paddingBottom: 2 }}>
                      <span style={{ color: "#bbb", fontSize: 14, lineHeight: 1 }}>↓</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            {/* Legend chip */}
            <div style={{ marginTop: 12 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fff", border: `1px solid ${CARD_BORDER}`,
                borderRadius: 4, padding: "3px 8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                <span aria-hidden="true" style={{ width: 10, height: 10, border: `1.5px solid ${ORANGE}`, borderRadius: 2, flexShrink: 0 }} />
                <span className="font-mono" style={{ fontSize: 10, color: "#666" }}>{data.legendLabel}</span>
              </div>
            </div>
          </MiroFrame>

          {/* WHAT SETS IT APART */}
          <div style={{ marginTop: 8 }}>
            <MiroFrame label="WHAT SETS IT APART">
              <p className="font-mono" style={{ fontSize: 11, color: "#666", marginBottom: 10, marginTop: 0 }}>
                {data.whatSetsApart.subtitle}
              </p>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ listStyle: "none", padding: 0, margin: 0, gap: 8 }}
              >
                {data.whatSetsApart.cards.map((card, i) => (
                  <InsightCard key={card.title} title={card.title} body={card.body} rotIdx={i} darkBorder />
                ))}
              </ul>
            </MiroFrame>
          </div>

          {/* AROUND THE BUILD */}
          <div style={{ marginTop: 8 }}>
            <MiroFrame label="AROUND THE BUILD">
              <p className="font-mono" style={{ fontSize: 11, color: "#666", marginBottom: 10, marginTop: 0 }}>
                {data.aroundTheBuild.subtitle}
              </p>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ listStyle: "none", padding: 0, margin: 0, gap: 8 }}
              >
                {data.aroundTheBuild.cards.map((card, i) => (
                  <InsightCard key={card.title} title={card.title} body={card.body} rotIdx={i + 4} darkBorder={false} />
                ))}
              </ul>
            </MiroFrame>
          </div>

        </div>
      </div>
    </div>
  );
}


// ── Main export ───────────────────────────────────────────────

export default function SolutionSection({ data }: { data: SolutionData }) {
  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-6">
        {data.sectionLabel}
      </h2>
      <div className="flex flex-col gap-10">
        <VideoPart data={data.part1} />
        <WorkflowPart data={data.part2} />
        <section className="border-t border-gray-200 pt-6">
          <p className="font-mono text-xs tracking-widest text-gray-400 mb-6">{data.part3.subLabel}</p>
          <EngineeringDecision data={data.part3} />
        </section>
      </div>
    </section>
  );
}
