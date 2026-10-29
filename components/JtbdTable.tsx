import * as LucideIcons from "lucide-react";
import type { JtbdData } from "@/data/content";

// Jobs to be done: a semantic table on wide screens, stacked cards below 768px.
// Each type gets a small tag with a word and an icon, never color alone.

const TAG_STYLE = {
  outline: { border: "1px solid var(--accent-bright, var(--accent))", background: "transparent", color: "var(--accent)" },
  tint: { border: "1px solid transparent", background: "color-mix(in srgb, var(--accent) 10%, white)", color: "var(--accent)" },
  gray: { border: "1px solid transparent", background: "#F3F4F6", color: "#374151" },
} as const;

function TypeTag({ type, types }: { type: string; types: JtbdData["types"] }) {
  const t = types[type];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = t ? (LucideIcons as any)[t.icon] : null;
  return (
    <span
      className="inline-flex items-center"
      style={{ gap: 6, padding: "2px 8px", borderRadius: 4, fontSize: 13, lineHeight: 1.5, whiteSpace: "nowrap", ...TAG_STYLE[t?.style ?? "gray"] }}
    >
      {Icon && <Icon aria-hidden="true" size={14} strokeWidth={1.5} />}
      {type}
    </span>
  );
}

const TH: React.CSSProperties = {
  textAlign: "left",
  verticalAlign: "top",
  fontFamily: "'Courier New', monospace",
  fontSize: 12,
  fontWeight: 600,
  color: "#6B7280",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "8px 12px",
  borderTop: "1px solid #E5E7EB",
  borderBottom: "1px solid #E5E7EB",
};
const TD: React.CSSProperties = { verticalAlign: "top", padding: "12px", borderBottom: "1px solid #E5E7EB" };
const WIDTHS = ["6%", "14%", "30%", "50%"];

export default function JtbdTable({ data }: { data: JtbdData }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed" style={{ maxWidth: 720, marginBottom: 16 }}>
        {data.intro}
      </p>

      <table className="hidden min-[768px]:table" style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 13, background: "#FAFAF9" }}>
        <colgroup>
          {WIDTHS.map((w) => (
            <col key={w} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {data.headers.map((h) => (
              <th key={h} scope="col" style={TH}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.number + row.job}>
              <td style={{ ...TD, fontFamily: "'Courier New', monospace", fontSize: 12, color: "#9CA3AF" }}>{row.number}</td>
              <td style={TD}>
                <TypeTag type={row.type} types={data.types} />
              </td>
              <td style={{ ...TD, color: "#111827", fontWeight: 600, lineHeight: 1.5 }}>{row.job}</td>
              <td style={{ ...TD, color: "#374151", lineHeight: 1.5 }}>{row.jtbd}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="min-[768px]:hidden list-none p-0 m-0 flex flex-col" style={{ gap: 16 }}>
        {data.rows.map((row) => (
          <li key={row.number + row.job} style={{ border: "1px solid #E5E7EB", background: "#FAFAF9", padding: 16, borderRadius: 4 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span className="font-mono text-gray-400" style={{ fontSize: 12 }}>{row.number}</span>
              <TypeTag type={row.type} types={data.types} />
            </div>
            <p className="text-gray-900" style={{ margin: "12px 0 0", fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{row.job}</p>
            <p className="text-gray-700" style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5 }}>{row.jtbd}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
