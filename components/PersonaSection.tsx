import type { PersonaData } from "@/data/content";
import FocusOutline from "@/components/FocusOutline";

// "Segmentation & Targeting": intro and segment list, persona table (1100px+) or
// stacked persona cards (below), opportunities as pill tags, and the MVP focus.

const DASH = "1px dashed #D1D5DB";
const BRIGHT = "var(--accent-bright, var(--accent))";

const mono: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: 12,
  fontWeight: 600,
  color: "#6B7280",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const bodyText: React.CSSProperties = { fontSize: 15, lineHeight: 1.625, color: "#1F2937" };

function Cell({ value }: { value: string | string[] }) {
  if (typeof value === "string") return <p style={{ margin: 0, fontSize: 12 }}>{value}</p>;
  return (
    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, listStyleType: "disc", display: "flex", flexDirection: "column", gap: 12 }}>
      {value.map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  );
}

function Avatar({
  a,
  className,
}: {
  a: PersonaData["personas"][number]["avatar"];
  className?: string;
}) {
  return (
    <img
      src={a.src}
      alt={a.alt}
      width={a.width}
      height={a.height}
      className={className}
      style={{ width: "auto", mixBlendMode: a.blend ? "multiply" : undefined }}
    />
  );
}

export default function PersonaSection({ data }: { data: PersonaData }) {
  const { personas, rows, focusIndex } = data;

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>
      <p className="text-sm text-gray-800 leading-relaxed">{data.intro}</p>
      <ol className="text-sm text-gray-800 leading-relaxed list-decimal pl-5 flex flex-col gap-2" style={{ marginTop: 12 }}>
        {data.segments.map((seg) => (
          <li key={seg.name}>
            <strong className="font-semibold">{seg.name}:</strong> {seg.text}
          </li>
        ))}
      </ol>

      {/* Persona table: 1100px and wider, may break out of the text column */}
      <div
        className="hidden min-[1100px]:block"
        style={{
          // centered without a transform, so the avatars' multiply blend sees the page
          position: "relative",
          left: "50%",
          marginLeft: "calc(min(1000px, 100vw - 32px) / -2)",
          width: "min(1000px, 100vw - 32px)",
          marginTop: 32,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", ...bodyText }}>
          <colgroup>
            <col style={{ width: 150 }} />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <td style={{ borderBottom: DASH }} />
              {personas.map((p, i) => (
                <th
                  key={p.name}
                  scope="col"
                  data-focus={i === focusIndex ? "persona" : undefined}
                  style={{ padding: "8px 16px 20px", borderBottom: DASH, textAlign: "center", verticalAlign: "top", fontWeight: 400 }}
                >
                  <div style={{ ...mono, marginBottom: 12 }}>{p.role}</div>
                  <Avatar a={p.avatar} className="h-[120px] mx-auto block" />
                  <div style={{ ...bodyText, fontSize: 12, fontWeight: 700, marginTop: 12 }}>{p.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  style={{ ...mono, padding: "20px 16px 20px 0", textAlign: "left", verticalAlign: "middle", borderBottom: ri < rows.length - 1 ? DASH : undefined }}
                >
                  {row.label}
                </th>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    data-focus={ci === focusIndex ? "persona" : undefined}
                    style={{ padding: "20px 16px", verticalAlign: "middle", borderBottom: ri < rows.length - 1 ? DASH : undefined }}
                  >
                    <Cell value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <FocusOutline selector='[data-focus="persona"]' inset={6} />
      </div>

      {/* Stacked persona cards: below 1100px */}
      <div className="min-[1100px]:hidden flex flex-col gap-6" style={{ marginTop: 32, position: "relative" }}>
        {personas.map((p, pi) => (
          <div
            key={p.name}
            data-focus={pi === focusIndex ? "persona" : undefined}
            className="border border-gray-200"
            style={{ padding: 20 }}
          >
            <div style={{ textAlign: "center", paddingBottom: 16 }}>
              <div style={{ ...mono, marginBottom: 12 }}>{p.role}</div>
              <Avatar a={p.avatar} className="h-[90px] min-[768px]:h-[120px] mx-auto block" />
              <div style={{ ...bodyText, fontSize: 12, fontWeight: 700, marginTop: 12 }}>{p.name}</div>
            </div>
            {rows.map((row) => (
              <div key={row.label} style={{ borderTop: DASH, padding: "16px 0 4px" }}>
                <div style={{ ...mono, marginBottom: 8 }}>{row.label}</div>
                <div style={bodyText}>
                  <Cell value={row.cells[pi]} />
                </div>
              </div>
            ))}
          </div>
        ))}
        <FocusOutline selector='[data-focus="persona"]' inset={6} />
      </div>

      {/* Opportunities */}
      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 40 }}>
        {data.opportunities.leadIn}
      </p>
      <div
        className="grid grid-cols-1 min-[768px]:grid-cols-3"
        style={{ columnGap: 24, rowGap: 48, marginTop: 44, position: "relative" }}
      >
        {data.opportunities.cards.map((card, i) => (
          <div
            key={card.title}
            data-focus={i === focusIndex ? "card" : undefined}
            className="relative border border-gray-200 bg-white"
            style={{ padding: 20, borderRadius: 4 }}
          >
            {i === focusIndex && (
              <div
                aria-hidden="true"
                style={{ position: "absolute", top: -40, left: 12, display: "flex", alignItems: "flex-start", gap: 4, pointerEvents: "none" }}
              >
                <span
                  style={{
                    color: BRIGHT,
                    fontFamily: "var(--font-caveat), cursive",
                    fontSize: 17,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    transform: "rotate(-3deg)",
                  }}
                >
                  {data.focusNote}
                </span>
                <svg width="26" height="24" viewBox="0 0 26 24" fill="none" stroke={BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible", marginTop: 4 }}>
                  <path d="M 2,2 C 16,0 24,9 20,21" />
                  <path d="M 15,16 L 20,22 L 25,15" />
                </svg>
              </div>
            )}
            <p style={{ ...mono, marginBottom: 14 }}>{card.title}</p>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", margin: 0, padding: 0 }}>
              {card.items.map((item) => (
                <li
                  key={item}
                  style={{ border: `1px solid ${BRIGHT}`, borderRadius: 4, padding: "4px 10px", fontSize: 13, lineHeight: 1.4, color: "#1F2937" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <FocusOutline selector='[data-focus="card"]' inset={5} />
      </div>

      <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 32 }}>
        {data.closing}
      </p>
    </div>
  );
}
