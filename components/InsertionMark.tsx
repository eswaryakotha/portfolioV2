type Props = {
  word: string;
  color?: string;
};

// Tuning reference:
//   caretWidth:  10  — SVG viewport width  (px)
//   caretHeight: 9   — SVG viewport height (px)
//   caretStroke: 1.5 — stroke-width
//   wordSize:    0.7em relative to surrounding text
//   wordRotate:  -5deg
//   wordGap:     1px between word bottom and caret apex (via marginBottom on label)
//   wordGap (marginBottom): 4px between word bottom and caret apex

export default function InsertionMark({ word, color = "#E07B39" }: Props) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "text-bottom",
      }}
    >
      {/* inserted word floated above the caret */}
      <span
        style={{
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) rotate(-5deg)",
          marginBottom: "8px",
          color,
          fontSize: "16px",
          fontStyle: "normal",
          fontFamily: "var(--font-caveat), Georgia, cursive",
          whiteSpace: "nowrap",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {word}
      </span>

      {/* hand-drawn style caret */}
      <svg
        width="10"
        height="9"
        viewBox="0 0 10 9"
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d="M 1.5,8.5 Q 5,0.5 8.5,8.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
