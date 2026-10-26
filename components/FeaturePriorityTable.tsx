import { Check, Minus, X } from "lucide-react";
import type { FeaturePriorityData, PriorityLevel, LevelValue } from "@/data/content";

// Feature prioritization table: level markers for Impact/Effort, priority tags,
// a summary sentence computed from the rows, and a legend. Table styles match the
// other tables on this page; same width as the Key Features table (text column).

const RULE = "1px solid #E5E7EB";
const OUTLINE = "#D1D5DB"; // light gray for empty squares
const BRIGHT = "var(--accent-bright, var(--accent))";
const WIDTHS = ["22%", "14%", "14%", "18%", "32%"];
const LEVELS: LevelValue[] = ["Low", "Medium", "High"];
const PRIORITIES: PriorityLevel[] = ["Must-Have", "Should-Have", "Could-Have", "Won’t-Have"];

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function Squares({ level }: { level: LevelValue }) {
  const n = LEVELS.indexOf(level) + 1;
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", gap: 2, marginRight: 8, verticalAlign: "middle" }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            boxSizing: "border-box",
            background: i <= n ? BRIGHT : "transparent",
            border: `1px solid ${i <= n ? BRIGHT : OUTLINE}`,
          }}
        />
      ))}
    </span>
  );
}

function HalfCircle() {
  return (
    <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 7 1.25 A 5.75 5.75 0 0 0 7 12.75 Z" fill="currentColor" />
    </svg>
  );
}

function PriorityTag({ priority }: { priority: PriorityLevel }) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 4,
    padding: "4px 10px",
    fontSize: 13,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };
  const icon = { size: 14, strokeWidth: 1.5, "aria-hidden": true } as const;
  switch (priority) {
    case "Must-Have":
      return (
        <span style={{ ...base, background: BRIGHT, color: "#fff", border: `1px solid ${BRIGHT}` }}>
          <Check {...icon} />
          {priority}
        </span>
      );
    case "Should-Have":
      return (
        <span style={{ ...base, border: `1px solid ${BRIGHT}`, color: BRIGHT }}>
          <HalfCircle />
          {priority}
        </span>
      );
    case "Could-Have":
      return (
        <span style={{ ...base, border: "1px dashed #9CA3AF", color: "#6B7280" }}>
          <Minus {...icon} />
          {priority}
        </span>
      );
    default:
      return (
        <span style={{ ...base, background: "#E5E7EB", border: "1px solid #E5E7EB", color: "#4B5563" }}>
          <X {...icon} />
          {priority}
        </span>
      );
  }
}

const headStyle: React.CSSProperties = {
  textAlign: "left",
  fontFamily: "'Courier New', monospace",
  fontSize: 12,
  fontWeight: 600,
  color: "#6B7280",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "8px 12px",
  borderTop: RULE,
  borderBottom: RULE,
  whiteSpace: "nowrap",
};

export default function FeaturePriorityTable({ data }: { data: FeaturePriorityData }) {
  const counts = PRIORITIES.map((p) => [p, data.rows.filter((r) => r.priority === p).length] as const);
  const summary = `${data.rows.length} ${data.rows.length === 1 ? "feature" : "features"} reviewed: ${counts
    .map(([p, n]) => `${n} ${p}`)
    .join(", ")}.`;

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{summary}</p>

      <div
        style={{
          position: "relative",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 760, tableLayout: "fixed" }}>
          <colgroup>
            {WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  style={{ ...headStyle, ...(i === 0 ? { position: "sticky", left: 0, background: "#f9f9f7", zIndex: 1 } : {}) }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => {
              const wont = row.priority === "Won’t-Have";
              const cell: React.CSSProperties = { padding: "10px 12px", borderBottom: RULE, color: "#374151", verticalAlign: "top" };
              return (
                <tr key={row.feature}>
                  <th
                    scope="row"
                    style={{
                      ...cell,
                      position: "sticky",
                      left: 0,
                      background: "#f9f9f7",
                      zIndex: 1,
                      textAlign: "left",
                      fontWeight: 500,
                      color: wont ? "#6B7280" : "#111",
                    }}
                  >
                    {row.feature}
                  </th>
                  <td style={cell}>
                    <Squares level={row.impact} />
                    {row.impact}
                  </td>
                  <td style={cell}>
                    <Squares level={row.effort} />
                    {row.effort}
                  </td>
                  <td style={cell}>
                    <PriorityTag priority={row.priority} />
                  </td>
                  <td style={cell}>
                    {row.notes ? (
                      row.notes
                    ) : (
                      <>
                        <span aria-hidden="true" style={{ color: "#9CA3AF" }}>
                          -
                        </span>
                        <span style={srOnly}>No notes</span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* legend */}
        <div
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 20px", marginTop: 12, fontSize: 12, color: "#6B7280" }}
        >
          <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            {LEVELS.map((l) => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center" }}>
                <Squares level={l} />
                {l}
              </span>
            ))}
          </span>
          <span aria-hidden="true" style={{ color: "#D1D5DB" }}>
            |
          </span>
          <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {PRIORITIES.map((p) => (
              <PriorityTag key={p} priority={p} />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
