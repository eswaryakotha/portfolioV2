import type { EquationAnnotationContent } from "@/data/content";

const ORANGE = "#E07B39";

// Coordinate reference (viewBox 0 0 820 140, text at y=85, 18px Advercase normal):
// "UGC audiobook creators"  x 194–≈364  (cx≈268, ellipse right x=364)
// space + "+"               x ≈364–≈424 (approx, Advercase may vary)
// space + "AI"              x ≈388–≈420 (AI arrow start x=388)
// " -> Audiobooks? "        x ≈420–≈540
// " An exploration"         x ≈540–≈640

export default function EquationAnnotation({
  content,
}: {
  content: EquationAnnotationContent;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 820 140"
        width="100%"
        style={{ minWidth: "440px" }}
        role="img"
        aria-label="Equation: UGC audiobook creators + AI → Audiobooks? An exploration"
      >
        <defs>
          <marker
            id="eq-arrow"
            markerWidth="6"
            markerHeight="5"
            refX="5"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L6,2.5 L0,5 Z" fill="#666" />
          </marker>
        </defs>

        {/* Hand-drawn orange ellipse
            left edge x=172 (unchanged), right edge x=400 (was 394, +6px)
            cx=286 (was 283), ry unchanged — top ≈y54, bottom ≈y98 */}
        <path
          d="M 172,76 C 172,64 222,53 286,55 C 347,53 400,63 400,76 C 400,89 347,99 286,99 C 221,100 172,89 172,76"
          fill="none"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(-3 286 76)"
        />

        {/* "Um, who?" — x unchanged, y moved down 2px */}
        <text
          x="172"
          y="42"
          fill={ORANGE}
          fontSize="16"
          fontFamily="var(--font-caveat), cursive"
          letterSpacing="0.03em"
        >
          {content.labelUmWho}
        </text>

        {/* Short curved arrow — shifted 30px right from previous position
            was: M 388,65 Q 393,50 400,43
            now: M 418,65 Q 423,50 430,43  (start x=418, over "A"/"I" of "AI") */}
        <path
          d="M 418,65 Q 423,50 430,43"
          fill="none"
          stroke="#666"
          strokeWidth="1"
          strokeLinecap="round"
          markerEnd="url(#eq-arrow)"
        />

        {/* "Not a villain this time! :)" — shifted 30px right with arrow
            was: x=404  now: x=434 */}
        <text
          x="434"
          y="42"
          fill="#555"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
        >
          {content.labelNotVillain}
        </text>

        {/* Main equation — Advercase Regular, weight 400 */}
        <text
          y="85"
          fontSize="18"
          fontFamily="var(--font-advercase), Georgia, 'Times New Roman', serif"
          fontWeight="400"
          fill="#111"
        >
          <tspan x="194">{content.textUGC}</tspan>
          <tspan> {content.textMiddle} </tspan>
          <tspan textDecoration="underline"> {content.textExploration}</tspan>
        </text>

        {/* Caption — centered on new ellipse cx=286 (was 283)
            top edge target: ellipse bottom (≈y98) + 4px gap = y102
            baseline: y102 + ~9px cap height = y111 */}
        <text
          x="286"
          y="119"
          fontSize="11"
          fill="#888"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          {content.captionLine1}
        </text>
        <text
          x="286"
          y="133"
          fontSize="11"
          fill="#888"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          {content.captionLine2}
        </text>
      </svg>
    </div>
  );
}
