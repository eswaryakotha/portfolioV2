import React from "react";
import type { ProblemItem, SummaryGridData } from "@/data/content";
import InsertionMark from "@/components/InsertionMark";
import NoteArrow from "@/components/NoteArrow";

function renderWithBold(body: string, boldPhrases?: string[]) {
  if (!boldPhrases?.length) return body;
  const matches = boldPhrases
    .map((p) => ({ start: body.indexOf(p), end: body.indexOf(p) + p.length, text: p }))
    .filter((m) => m.start !== -1)
    .sort((a, b) => a.start - b.start);
  const nodes: (string | React.JSX.Element)[] = [];
  let pos = 0;
  for (const { start, end, text } of matches) {
    if (pos < start) nodes.push(body.slice(pos, start));
    nodes.push(<strong key={start} className="font-semibold text-gray-900">{text}</strong>);
    pos = end;
  }
  if (pos < body.length) nodes.push(body.slice(pos));
  return nodes;
}

// Bolds text between ** markers.
function renderMarkdownBold(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-gray-900">{part}</strong>
    ) : (
      part
    )
  );
}

// Wraps `phrase` in a relatively positioned span holding a decorative squiggly
// underline. The SVG is aria-hidden, absolutely positioned, and non-interactive,
// so the sentence still reads, wraps, and copies as plain text.
function AnnotatedText({ text, phrase }: { text: string; phrase?: string }) {
  const idx = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || idx === -1) return <>{text}</>;
  return (
    <>
      {/* final state is the default, so the star shows with reduced motion or no JS */}
      <style>{`
.squiggle-star{transform:rotate(12deg);transform-origin:center;animation:star-pop 250ms ease-out 400ms both}
@keyframes star-pop{from{opacity:0;transform:rotate(12deg) scale(.6)}to{opacity:1;transform:rotate(12deg) scale(1)}}
@media (prefers-reduced-motion:reduce){.squiggle-star{animation:none}}
`}</style>
      {text.slice(0, idx)}
      <span data-sg="phrase" style={{ position: "relative", display: "inline" }}>
        {phrase}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            left: 0,
            bottom: -5,
            width: "100%",
            height: 6,
            overflow: "visible",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <path
            d="M 0,3.2 C 3,0.4 6,0.8 10,3.4 S 17,5.6 22,3 S 29,0.6 35,3.1 S 42,5.7 48,3.3 S 56,0.5 62,3 S 70,5.5 76,3.2 S 84,0.7 90,3.1 S 96,5 100,3"
            fill="none"
            stroke="var(--accent-bright, var(--accent))"
            strokeWidth="1.75"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 16 16"
          className="squiggle-star"
          style={{
            position: "absolute",
            left: "calc(100% - 2px)", // star center 6px past the word's right edge
            top: "calc(0.05em - 14px)", // center ~6px above the cap line
            width: 16,
            height: 16,
            overflow: "visible",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <path
            d="M 7.9,1.2 L 8.5,5.6 L 12.3,13.9 L 6.8,9.6 L 1.1,5.5 L 7.6,6.3 L 14.9,5.7 L 9.3,9.2 L 3.7,14.1 L 6.1,7.4 L 8.6,-0.5"
            fill="none"
            stroke="var(--accent-bright, var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {text.slice(idx + phrase.length)}
    </>
  );
}

// Splits "Audiobook production is hard" at after="is" →
//   ["Audiobook production is", "hard"]
function splitHeadlineAt(headline: string, after: string): [string, string] {
  const pattern = " " + after + " ";
  const idx = headline.indexOf(pattern);
  if (idx === -1) return [headline, ""];
  const cut = idx + 1 + after.length;
  return [headline.slice(0, cut), headline.slice(cut + 1)];
}

function ProblemHeadline({ item }: { item: ProblemItem }) {
  if (!item.insertion) {
    return <p className="font-semibold text-gray-900 mb-1">{item.headline}</p>;
  }

  const { word, after, color } = item.insertion;
  const [before, rest] = splitHeadlineAt(item.headline, after);
  const ariaLabel = `${before} ${word} ${rest}`;

  return (
    <p
      className="font-semibold text-gray-900 mb-1"
      aria-label={ariaLabel}
    >
      {before}{" "}
      <InsertionMark word={word} color={color} />
      {" "}<span style={{ marginLeft: "-2px" }}>{rest}</span>
    </p>
  );
}

export default function SummaryGrid({ grid }: { grid: SummaryGridData }) {
  return (
    <div className="relative flex flex-col gap-3" style={{ overflow: "visible" }}>
      {grid.solution.note && (
        <>
          <style>{`
.nk-note{transition:opacity 400ms ease 1000ms}
[data-note-state="hidden"] .nk-note{opacity:0;transition:none}
[data-note-state="shown"] .nk-note{opacity:1}
.nk-long{display:none}
.nk-short{display:block}
@media (min-width:1200px){.nk-long{display:block}.nk-short{display:none}}
@media (max-width:639px){.nk-short{display:none}}
`}</style>
          <NoteArrow />
        </>
      )}
      {/* Row 1: Problem — full width */}
      <div className="border border-gray-200 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">Problem</p>
        {typeof grid.problem === "string" ? (
          <p className="text-sm text-gray-700 leading-relaxed">{grid.problem}</p>
        ) : (
        <ol className="flex flex-col gap-4">
          {(grid.problem as ProblemItem[]).map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-xs text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
              <div>
                <ProblemHeadline item={item} />
                <p className="text-gray-700 leading-relaxed">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        )}
      </div>

      {/* Row 2: Solution + Users — 50/50, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div data-sg="solution" className="border border-gray-200 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">{grid.solution.label ?? "Solution"}</p>
          {grid.solution.strikethrough && (
            <p className="text-sm text-gray-700 mb-2" style={{ textDecoration: "line-through", textDecorationColor: "var(--accent)", textDecorationThickness: "2px" }}>
              {grid.solution.strikethrough}
            </p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            <AnnotatedText text={grid.solution.intro} phrase={grid.solution.squigglePhrase} />
          </p>
          {grid.solution.items && <ol className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
            {grid.solution.items.map((item, i) => (
              <li key={i} className="flex gap-1 text-sm text-gray-700">
                <span className="font-mono text-xs text-gray-400 shrink-0 mt-0.5">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>}
          {grid.solution.closing && (
            <p className="text-sm text-gray-700">{grid.solution.closing}</p>
          )}
        </div>
        <div className="border border-gray-200 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">Users</p>
          {!grid.hideUsersIcons && (
          <div className="flex items-center justify-center gap-3 mb-3">
            <span role="img" aria-label="Writing on paper" className="w-8 h-8 shrink-0" style={{ display: "inline-block", backgroundColor: "var(--accent)", WebkitMaskImage: "url(https://cdn-icons-png.flaticon.com/512/70/70258.png)", WebkitMaskRepeat: "no-repeat", WebkitMaskSize: "contain", WebkitMaskPosition: "center", maskImage: "url(https://cdn-icons-png.flaticon.com/512/70/70258.png)", maskRepeat: "no-repeat", maskSize: "contain", maskPosition: "center" }} />
            <span className="text-sm" style={{ color: "#626469" }}>→</span>
            <span role="img" aria-label="Headphones" className="w-8 h-8 shrink-0" style={{ display: "inline-block", backgroundColor: "var(--accent)", WebkitMaskImage: "url(https://cdn-icons-png.flaticon.com/512/4373/4373376.png)", WebkitMaskRepeat: "no-repeat", WebkitMaskSize: "contain", WebkitMaskPosition: "center", maskImage: "url(https://cdn-icons-png.flaticon.com/512/4373/4373376.png)", maskRepeat: "no-repeat", maskSize: "contain", maskPosition: "center" }} />
          </div>
          )}
          <p className="text-sm text-gray-700 leading-relaxed">{grid.users}</p>
        </div>
      </div>

      {/* Row 3: Results — full width */}
      <div data-sg="results" className="border border-gray-200 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">Results</p>
        {typeof grid.results[0] === "string" ? (
          <ul className="list-disc pl-5 flex flex-col gap-3 marker:text-gray-400">
            {(grid.results as string[]).map((item, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed">
                {renderMarkdownBold(item)}
              </li>
            ))}
          </ul>
        ) : (
        <ul className="flex flex-col gap-3">
          {(grid.results as Exclude<SummaryGridData["results"], string[]>).map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-xs text-gray-400 shrink-0 mt-0.5 w-8">{item.year}</span>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">{item.label}:</span>{" "}
                {renderWithBold(item.body, item.boldPhrases)}
              </p>
            </li>
          ))}
        </ul>
        )}
      </div>
      {grid.solution.note && (
        <div data-sg="note" className="nk-note mt-3 max-w-[520px]">
          <svg
            aria-hidden="true"
            focusable="false"
            className="nk-short"
            width="40"
            height="22"
            viewBox="0 0 40 22"
            fill="none"
            stroke="var(--accent-bright, var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ overflow: "visible", pointerEvents: "none", marginBottom: 2 }}
          >
            <path d="M 2,2 C 6,14 18,18 36,16" />
            <path d="M 30,11 L 37,16 L 29,20" />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 22,
              lineHeight: 1.2,
              color: "var(--accent-bright, var(--accent))",
              transform: "rotate(-1.5deg)",
              transformOrigin: "left center",
              marginBottom: 8,
            }}
          >
            {grid.solution.note.heading}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{grid.solution.note.body}</p>
        </div>
      )}
    </div>
  );
}
