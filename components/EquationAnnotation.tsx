import type { EquationAnnotationContent } from "@/data/content";

const ORANGE = "#E07B39";

// Coordinate reference (viewBox 0 0 820 132, text at y=85, 18px Georgia normal):
// "UGC audiobook creators"  x 194–≈409  (cx≈302, width≈215px)
// space + "+"               x ≈409–≈424
// space + "AI"              x ≈424–≈447  (AI center ≈ x 438)
// " -> Audiobooks? "        x ≈447–≈560
// " An exploration"         x ≈560–≈660

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
            cx=290, cy=76, rx=118, ry=22
            left edge x≈172, right edge x≈408 (stops before "+" at ≈x424)
            top ≈y54, bottom ≈y98 */}
        <path
          d="M 172,76 C 172,64 225,53 290,55 C 356,53 409,63 409,76 C 409,89 356,99 290,99 C 224,100 172,89 172,76"
          fill="none"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(-3 290 76)"
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

        {/* Short curved arrow — starts above center of "AI" (x≈438, y=65),
            curves up to note at (x≈450, y=43) */}
        <path
          d="M 438,65 Q 443,50 450,43"
          fill="none"
          stroke="#666"
          strokeWidth="1"
          strokeLinecap="round"
          markerEnd="url(#eq-arrow)"
        />

        {/* "Not a villain this time! :)" — repositioned next to arrow tip */}
        <text
          x="454"
          y="42"
          fill="#555"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
        >
          {content.labelNotVillain}
        </text>

        {/* Main equation — serif, normal weight — unchanged */}
        <text
          y="85"
          fontSize="18"
          fontFamily="Georgia, 'Times New Roman', serif"
          fill="#111"
        >
          <tspan x="194">{content.textUGC}</tspan>
          <tspan> {content.textMiddle} </tspan>
          <tspan textDecoration="underline"> {content.textExploration}</tspan>
        </text>

        {/* Caption — centered on ellipse cx=295
            top edge target: ellipse bottom (≈y98) + 4px gap = y102
            baseline: y102 + ~9px cap height = y111 */}
        <text
          x="290"
          y="119"
          fontSize="11"
          fill="#888"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          {content.captionLine1}
        </text>
        <text
          x="290"
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
