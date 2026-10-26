import * as LucideIcons from "lucide-react";
import type { ProductJobsData } from "@/data/content";

// Product strategy sub-section: paragraph, lead-in, an ordered row of job boxes
// (number, icon, text) with arrows between them on wide screens, and a closing line.
// 4-up at 1000px+, 2x2 at 640px+, one column below. Arrows hide when it wraps.

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp aria-hidden="true" size={40} strokeWidth={1.5} color="var(--accent-bright, var(--accent))" />;
}

export default function ProductJobs({ data }: { data: ProductJobsData }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed">{data.paragraph}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 24 }}>
        {data.leadIn}
      </p>

      <ol
        className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4 list-none p-0 m-0"
        style={{ gap: 24, marginTop: 16 }}
      >
        {data.jobs.map((job, i) => (
          <li
            key={i}
            className="relative border border-gray-200 bg-white flex flex-col"
            style={{ padding: 24, borderRadius: 4, gap: 16 }}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className="hidden min-[1000px]:flex absolute items-center justify-center"
                style={{ left: -24, top: 0, bottom: 0, width: 24, pointerEvents: "none" }}
              >
                <LucideIcons.ArrowRight size={14} strokeWidth={1.5} color="#9CA3AF" />
              </span>
            )}
            <span aria-hidden="true" className="font-mono text-xs text-gray-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Icon name={job.icon} />
            <p className="text-sm text-gray-800 leading-relaxed" style={{ textAlign: "left", margin: 0 }}>
              {job.text}
            </p>
          </li>
        ))}
      </ol>

      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 32 }}>
        <strong className="font-semibold">{data.closing.bold}</strong>
        {data.closing.rest}
      </p>
    </div>
  );
}
