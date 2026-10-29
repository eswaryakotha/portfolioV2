import * as LucideIcons from "lucide-react";
import type { ProcessRowData } from "@/data/content";
import CurrentProcessLabel from "@/components/CurrentProcessLabel";

// "Current process" row: the handwritten label plus a row of icon steps. Same label
// as the Dolby page. 1100+: label and four steps in one row, arrows in the gaps.
// 768-1099: label above (arrow pointing down), steps in a 2 by 2 grid, no arrows.
// <768: one column, with a small down arrow between steps.

const BRIGHT = "var(--accent-bright, var(--accent))";
const GRAY = "#9CA3AF";

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={40} strokeWidth={1.5} color={BRIGHT} aria-hidden="true" style={{ display: "block" }} />;
}

function altFromPath(src: string): string {
  return (src.split("/").pop() ?? "").replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

export default function ProcessSteps({ data }: { data: ProcessRowData }) {
  const last = data.steps.length - 1;
  return (
    <div className="flex flex-col min-[1100px]:flex-row min-[1100px]:items-start gap-4 min-[1100px]:gap-3" style={{ marginTop: 32 }}>
      {/* label: arrow points right at step 1 on wide screens, down at the steps otherwise */}
      {/* wide: the label sits in the icon row and its small arrow ends 12px before the first icon */}
      <div className="hidden min-[1100px]:flex shrink-0 w-[168px] justify-end items-center" style={{ height: 40 }}>
        <CurrentProcessLabel color={BRIGHT} compact />
      </div>
      <div className="min-[1100px]:hidden">
        <CurrentProcessLabel color={BRIGHT} arrow="down" compact />
      </div>

      <ol className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[1100px]:grid-cols-4 list-none p-0 m-0 flex-1 min-w-0" style={{ columnGap: 24, rowGap: 24 }}>
        {data.steps.map((step, i) => (
          // each step spans four shared rows (icon, number, title, text) so they line up across the row
          <li key={step.title} className="relative row-span-4 grid grid-rows-subgrid" style={{ rowGap: 8 }}>
            {step.logos && step.logos.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, height: 28 }}>
                {step.logos.map((src) => (
                  <img key={src} src={src} alt={altFromPath(src)} style={{ height: 28, width: "auto", objectFit: "contain" }} />
                ))}
              </div>
            )}
            <div className="flex items-center" style={{ gap: 8, minHeight: 40 }}>
              <Icon name={step.icon} />
              {data.showManualTags && step.manual && (
                <span className="font-mono text-gray-500" style={{ fontSize: 12, lineHeight: 1 }}>
                  manual
                </span>
              )}
            </div>
            <span aria-hidden="true" className="font-mono text-gray-400" style={{ fontSize: 12, lineHeight: 1.2 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-semibold text-gray-900" style={{ margin: 0, fontSize: 14, lineHeight: 1.4 }}>
              {step.title}
            </p>
            <p className="text-gray-700" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              {step.text}
            </p>
            {data.showStepArrows && i < last && (
              <>
                {/* thin right arrow in the gap (1100+) */}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="hidden min-[1100px]:block"
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  stroke={GRAY}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: "absolute", left: "100%", top: 24, pointerEvents: "none" }}
                >
                  <path d="M 5,6 H 18 M 14,2 L 18.5,6 L 14,10" />
                </svg>
                {/* small down arrow between stacked steps (<768) */}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="block min-[768px]:hidden"
                  width="12"
                  height="24"
                  viewBox="0 0 12 24"
                  fill="none"
                  stroke={GRAY}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: "absolute", left: 0, top: "100%", pointerEvents: "none" }}
                >
                  <path d="M 6,5 V 18 M 2,14 L 6,18.5 L 10,14" />
                </svg>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
