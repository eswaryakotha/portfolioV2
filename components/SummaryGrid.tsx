import React from "react";
import type { ProblemItem, SummaryGridData } from "@/data/content";
import InsertionMark from "@/components/InsertionMark";

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
    <div className="flex flex-col gap-3">
      {/* Row 1: Problem — full width */}
      <div className="border border-gray-200 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">Problem</p>
        <ol className="flex flex-col gap-4">
          {grid.problem.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-xs text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
              <div>
                <ProblemHeadline item={item} />
                <p className="text-gray-700 leading-relaxed">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Row 2: Solution + Users — 50/50, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="border border-gray-200 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">Solution</p>
          {grid.solution.strikethrough && (
            <p className="text-sm text-gray-700 mb-2" style={{ textDecoration: "line-through", textDecorationColor: "#E07B39", textDecorationThickness: "2px" }}>
              {grid.solution.strikethrough}
            </p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{grid.solution.intro}</p>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
            {grid.solution.items.map((item, i) => (
              <li key={i} className="flex gap-1 text-sm text-gray-700">
                <span className="font-mono text-xs text-gray-400 shrink-0 mt-0.5">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
          {grid.solution.closing && (
            <p className="text-sm text-gray-700">{grid.solution.closing}</p>
          )}
        </div>
        <div className="border border-gray-200 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">Users</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span role="img" aria-label="Writing on paper" className="w-8 h-8 shrink-0" style={{ display: "inline-block", backgroundColor: "#E07B39", WebkitMaskImage: "url(https://cdn-icons-png.flaticon.com/512/70/70258.png)", WebkitMaskRepeat: "no-repeat", WebkitMaskSize: "contain", WebkitMaskPosition: "center", maskImage: "url(https://cdn-icons-png.flaticon.com/512/70/70258.png)", maskRepeat: "no-repeat", maskSize: "contain", maskPosition: "center" }} />
            <span className="text-sm" style={{ color: "#626469" }}>→</span>
            <span role="img" aria-label="Headphones" className="w-8 h-8 shrink-0" style={{ display: "inline-block", backgroundColor: "#E07B39", WebkitMaskImage: "url(https://cdn-icons-png.flaticon.com/512/4373/4373376.png)", WebkitMaskRepeat: "no-repeat", WebkitMaskSize: "contain", WebkitMaskPosition: "center", maskImage: "url(https://cdn-icons-png.flaticon.com/512/4373/4373376.png)", maskRepeat: "no-repeat", maskSize: "contain", maskPosition: "center" }} />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{grid.users}</p>
        </div>
      </div>

      {/* Row 3: Results — full width */}
      <div className="border border-gray-200 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">Results</p>
        <ul className="flex flex-col gap-3">
          {grid.results.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-xs text-gray-400 shrink-0 mt-0.5 w-8">{item.year}</span>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">{item.label}:</span>{" "}
                {renderWithBold(item.body, item.boldPhrases)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
