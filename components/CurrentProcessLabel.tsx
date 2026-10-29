// Handwritten "Current process" label with its small curved arrow. Shared by the
// Dolby process row (default, arrow pointing right) and the VeraAI flowchart
// (arrow="down", pointing at the first box, with an optional smaller note).
export default function CurrentProcessLabel({
  color = "var(--accent)",
  arrow = "side",
  note,
  compact = false,
}: {
  color?: string;
  arrow?: "side" | "down";
  note?: string;
  compact?: boolean; // small thin arrow with an open head (MetaMint process row)
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: arrow === "down" ? "flex-start" : "center",
        flexWrap: note ? "wrap" : undefined,
        ...(note ? { columnGap: 6, rowGap: 2 } : { gap: 6 }),
      }}
    >
      <span
        style={{
          color,
          fontFamily: "var(--font-caveat), cursive",
          fontSize: 20,
          lineHeight: 1,
          transform: "rotate(-3deg)",
          transformOrigin: "left center",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        Current process
      </span>
      {compact ? (
        arrow === "side" ? (
          <svg
            viewBox="0 0 44 14"
            width="44"
            height="14"
            aria-hidden="true"
            focusable="false"
            style={{ flexShrink: 0, overflow: "visible", pointerEvents: "none" }}
          >
            <g fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 2,10 Q 22,2 41,8" />
              <path d="M 35,3.5 L 41,8 L 35,12.5" />
            </g>
          </svg>
        ) : (
          <svg
            viewBox="0 0 16 30"
            width="16"
            height="30"
            aria-hidden="true"
            focusable="false"
            style={{ flexShrink: 0, marginTop: 2, overflow: "visible", pointerEvents: "none" }}
          >
            <g fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 3,2 C 14,5 14,17 8,26" />
              <path d="M 3,21 L 8,27 L 13,21" />
            </g>
          </svg>
        )
      ) : arrow === "side" ? (
        /* Curved arrow pointing toward step 1 — desktop only */
        <svg
          viewBox="0 0 80 18"
          width="72"
          height="16"
          aria-hidden="true"
          className="hidden sm:block"
          style={{ flexShrink: 0 }}
        >
          <defs>
            <marker id="cp-head" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M 0,0 L 7,3 L 0,6 Z" fill={color} />
            </marker>
          </defs>
          <path
            d="M 2,9 Q 40,2 76,11"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#cp-head)"
          />
        </svg>
      ) : (
        /* Curved arrow sweeping down toward the first box */
        <svg
          viewBox="0 0 30 40"
          width="24"
          height="32"
          aria-hidden="true"
          focusable="false"
          style={{ flexShrink: 0, marginTop: 4, overflow: "visible", pointerEvents: "none" }}
        >
          <g fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 2,2 C 22,2 26,16 16,34" />
            <path d="M 10,28 L 16,35 L 22,27" />
          </g>
        </svg>
      )}
      {note && (
        <span
          style={{
            color,
            fontFamily: "var(--font-caveat), cursive",
            fontSize: 16,
            lineHeight: 1,
            alignSelf: "flex-start",
            marginTop: 2,
            whiteSpace: "nowrap",
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
}
