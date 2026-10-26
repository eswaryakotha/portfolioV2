import { Check, X } from "lucide-react";
import type { ToolsAnalysisData, MatrixStatus } from "@/data/content";

// Sub-section "02. Why existing tools weren't enough": intro, tools table, lead-ins,
// feature matrix with two stat callouts, and a closing line. Table styles follow
// the Market Research table (1px light gray rules, small gray monospace uppercase
// header, no fills) without touching that component.

const RULE = "1px solid #E5E7EB";
const GREEN = "#16A34A";
const YELLOW = "#EAB308";
const RED = "#DC2626";

const th: React.CSSProperties = {
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
};

const STATUS_WORD: Record<MatrixStatus, string> = { yes: "Yes", partial: "Partial", no: "No" };

function StatusIcon({ status }: { status: MatrixStatus }) {
  if (status === "yes") {
    return (
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: GREEN,
        }}
      >
        <Check size={12} strokeWidth={2.5} color="#fff" />
      </span>
    );
  }
  if (status === "partial") {
    return (
      <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8.25" fill="none" stroke={YELLOW} strokeWidth="1.5" />
        {/* left half filled */}
        <path d="M 10 1.75 A 8.25 8.25 0 0 0 10 18.25 Z" fill={YELLOW} />
      </svg>
    );
  }
  return <X aria-hidden="true" size={18} strokeWidth={1.75} color={RED} />;
}

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

export default function ToolsAnalysis({ data }: { data: ToolsAnalysisData }) {
  const { matrix } = data;
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed">{data.intro}</p>

      {/* Table 1 */}
      <div style={{ overflowX: "auto", marginTop: 16, position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
          <thead>
            <tr>
              {data.tableHeaders.map((h) => (
                <th key={h} scope="col" style={{ ...th, whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableRows.map((row) => (
              <tr key={row.tool}>
                <th
                  scope="row"
                  style={{ padding: "8px 12px", borderBottom: RULE, color: "#111", fontWeight: 500, textAlign: "left", verticalAlign: "top" }}
                >
                  {row.tool}
                </th>
                <td style={{ padding: "8px 12px", borderBottom: RULE, color: "#374151", verticalAlign: "top" }}>
                  {row.purpose}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: RULE, color: "#374151", verticalAlign: "top" }}>
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead-ins */}
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        {data.leadIns.map((line) => (
          <p key={line} className="text-sm text-gray-800 leading-relaxed">
            {line}
          </p>
        ))}
      </div>

      {/* Matrix + stats */}
      <div className="flex flex-col min-[1000px]:flex-row min-[1000px]:items-center" style={{ gap: 32, marginTop: 24 }}>
        <div className="min-w-0 min-[1000px]:w-[70%]">
          <div style={{ overflowX: "auto", position: "relative" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
              <caption style={srOnly}>{matrix.caption}</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    style={{ ...th, position: "sticky", left: 0, background: "#f9f9f7", zIndex: 1 }}
                  >
                    <span style={srOnly}>Feature</span>
                  </th>
                  {matrix.columns.map((c) => (
                    <th key={c} scope="col" style={{ ...th, textAlign: "center" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row) => (
                  <tr key={row.feature}>
                    <th
                      scope="row"
                      style={{
                        position: "sticky",
                        left: 0,
                        background: "#f9f9f7",
                        zIndex: 1,
                        padding: "14px 12px",
                        borderBottom: RULE,
                        color: "#111",
                        fontWeight: 500,
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.feature}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={i} style={{ padding: "14px 12px", borderBottom: RULE, textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <StatusIcon status={cell.status} />
                          <span style={srOnly}>{STATUS_WORD[cell.status]}</span>
                          {cell.note && (
                            <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.2 }}>{cell.note}</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* legend */}
          <ul
            style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 12, listStyle: "none", padding: 0, fontSize: 12, color: "#6B7280" }}
          >
            {(["yes", "partial", "no"] as MatrixStatus[]).map((s) => (
              <li key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <StatusIcon status={s} />
                {STATUS_WORD[s]}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-1 min-[1000px]:w-[30%]" style={{ gap: 48 }}>
          {data.stats.map((stat) => (
            <div key={stat.value}>
              <p style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 600, color: "var(--accent-bright, var(--accent))", margin: 0 }}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed" style={{ marginTop: 4 }}>
                {stat.text}
              </p>
              {stat.source && (
                <p className="text-xs text-gray-400" style={{ marginTop: 4 }}>
                  {stat.source}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 32 }}>
        {data.closing}
      </p>
    </div>
  );
}
