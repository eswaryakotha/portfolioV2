import type { KeyFeaturesData } from "@/data/content";

export default function KeyFeaturesTable({ data }: { data: KeyFeaturesData }) {
  return (
    <div style={{ marginTop: 32 }}>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
        {data.subLabel}
      </p>
      <p className="text-sm text-gray-800 leading-relaxed mb-4">
        {data.introLine}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 520 }}>
          <colgroup>
            <col style={{ width: "62%" }} />
            <col style={{ width: "38%" }} />
          </colgroup>
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: "left",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6B7280",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: i === 1 ? "8px 12px 8px 20px" : "8px 12px",
                  borderTop: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#374151", verticalAlign: "top" }}>
                  <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    color: "#9CA3AF",
                    marginRight: 4,
                  }}>
                    {row.marker}
                  </span>
                  {row.jtbd}
                </td>
                <td style={{ padding: "10px 12px 10px 20px", borderBottom: "1px solid #E5E7EB", color: "#374151", verticalAlign: "top" }}>
                  {row.feature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
