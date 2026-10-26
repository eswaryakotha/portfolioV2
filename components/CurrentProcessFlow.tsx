import fs from "fs";
import path from "path";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { CurrentProcessFlowData } from "@/data/content";
import CurrentProcessLabel from "@/components/CurrentProcessLabel";

const PROCESS_DIR = path.join(process.cwd(), "public", "process");

function getStepLogos(stepCount: number): string[][] {
  const groups: string[][] = Array.from({ length: stepCount }, () => []);
  if (!fs.existsSync(PROCESS_DIR)) return groups;
  const files = fs.readdirSync(PROCESS_DIR).sort();
  for (const file of files) {
    const match = file.match(/^step-(\d+)-/i);
    if (!match) continue;
    const idx = parseInt(match[1], 10) - 1;
    if (idx >= 0 && idx < stepCount) groups[idx].push(file);
  }
  return groups;
}

function altFromFilename(file: string): string {
  return file
    .replace(/^step-\d+-/i, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ");
}

export default function CurrentProcessFlow({ data }: { data: CurrentProcessFlowData }) {
  const logos = getStepLogos(data.steps.length);

  return (
    <div style={{ marginTop: 32 }}>
      <div className="flex flex-col sm:flex-row sm:items-end" style={{ gap: 12 }}>

        {/* ── Handwritten label + arrow ── */}
        <div className="flex-shrink-0 sm:w-[140px]" style={{ marginBottom: 30 }}>
          <CurrentProcessLabel />
        </div>

        {/* ── Flow: logos on top, label on bottom, arrows between ── */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-end">
          {data.steps.map((step, i) => (
            <Fragment key={step.id}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="flex justify-center items-center py-2 sm:py-0"
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
                {/* Logos */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, alignItems: "center", minHeight: 38 }}>
                  {logos[i].length > 0 ? (
                    logos[i].map((file) => (
                      <img
                        key={file}
                        src={`/process/${file}`}
                        alt={altFromFilename(file)}
                        style={{ height: 38, width: "auto", objectFit: "contain" }}
                      />
                    ))
                  ) : (
                    <div
                      aria-label="[logo]"
                      style={{ width: 38, height: 38, background: "#E0E0E0", borderRadius: 4 }}
                    />
                  )}
                </div>
                {/* Step label */}
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#9CA3AF" }}>
                    {step.id}.
                  </span>{" "}
                  <span style={{ fontSize: 14, color: "#111" }}>{step.label}</span>
                </div>
              </div>
            </Fragment>
          ))}
        </div>

      </div>
    </div>
  );
}
