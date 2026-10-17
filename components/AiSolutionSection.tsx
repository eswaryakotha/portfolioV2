import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { AiSolutionSubsectionData } from "@/data/content";

function Icon({ name, size = 40 }: { name: string; size?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={1.5} color="#E07B39" />;
}

export default function AiSolutionSection({ data }: { data: AiSolutionSubsectionData }) {
  return (
    <div style={{ marginTop: 32 }}>
      {/* Sub-label */}
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
        {data.subLabel}
      </p>

      {/* Lead text */}
      <p className="text-sm text-gray-800 leading-relaxed mb-3">
        {data.leadBefore}
        <strong className="font-semibold">{data.leadBold}</strong>
        {data.leadAfter}
      </p>

      {/* Intro line */}
      <p className="text-sm text-gray-800 leading-relaxed mb-6">
        {data.introLine}
      </p>

      {/* Workflow: icons on top, labels below, arrows between — vertically centered with icons */}
      <div className="flex flex-col sm:flex-row">
        {data.steps.map((step, i) => (
          <Fragment key={step.label}>
            {i > 0 && (
              <div
                aria-hidden="true"
                className="flex justify-center items-center py-2 sm:py-0 sm:pt-[13px] sm:items-start"
                style={{ flexShrink: 0, width: 24 }}
              >
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  color="#9CA3AF"
                  className="rotate-90 sm:rotate-0"
                />
              </div>
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Icon name={step.icon} size={40} />
              <span style={{ fontSize: 13, color: "#111", textAlign: "center" }}>
                {step.label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Closing line */}
      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 24 }}>
        <strong className="font-semibold">{data.closingPrefix}</strong>
        {data.closingRest}
      </p>
    </div>
  );
}
