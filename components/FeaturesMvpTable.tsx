import type { FeaturesMvpData } from "@/data/content";

// JTBD / Feature / MVP table. Same styles as the Key Features table (thin light
// gray rules, small gray monospace uppercase header, no fills, top-aligned cells),
// with a third column; scrolls horizontally on narrow screens.

const RULE = "1px solid #E5E7EB";
const WIDTHS = ["46%", "27%", "27%"];

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

export default function FeaturesMvpTable({ data }: { data: FeaturesMvpData }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{data.intro}</p>
      <div style={{ overflowX: "auto", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640, tableLayout: "fixed" }}>
          <colgroup>
            {WIDTHS.map((w, i) => (
              <col key={w + i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  style={{
                    textAlign: "left",
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6B7280",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: i === 0 ? "8px 12px" : "8px 12px 8px 20px",
                    borderTop: RULE,
                    borderBottom: RULE,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.marker}>
                <td style={{ padding: "10px 12px", borderBottom: RULE, color: "#374151", verticalAlign: "top" }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#9CA3AF", marginRight: 4 }}>
                    {row.marker}
                  </span>
                  {row.jtbd}
                </td>
                <td style={{ padding: "10px 12px 10px 20px", borderBottom: RULE, color: "#374151", verticalAlign: "top" }}>
                  {row.feature}
                </td>
                <td style={{ padding: "10px 12px 10px 20px", borderBottom: RULE, color: "#374151", verticalAlign: "top" }}>
                  {row.mvp ? (
                    row.mvp
                  ) : (
                    <>
                      <span aria-hidden="true" style={{ color: "#9CA3AF" }}>
                        -
                      </span>
                      <span style={srOnly}>No MVP entry</span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
