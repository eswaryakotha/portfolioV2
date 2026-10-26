import * as LucideIcons from "lucide-react";
import type { StatusCard } from "@/data/content";

// Status cards for the Solution box: a dashed card for the vision and a solid,
// tinted card for what is built, plus a handwritten "foundation" arrow between them.
// The status is always real text in the tag, never only the border style.

const BRIGHT = "var(--accent-bright, var(--accent))";

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={32} strokeWidth={1.5} color={BRIGHT} aria-hidden="true" style={{ flexShrink: 0 }} />;
}

export default function SolutionCards({ cards, note }: { cards: StatusCard[]; note?: string }) {
  return (
    <div>
      <ul className="grid grid-cols-1 min-[768px]:grid-cols-2 list-none p-0 m-0" style={{ gap: 12 }}>
        {cards.map((c) => (
          <li
            key={c.title}
            className="flex flex-col"
            style={{
              padding: 20,
              borderRadius: 4,
              border: `1px ${c.status === "vision" ? "dashed" : "solid"} ${BRIGHT}`,
              background: c.status === "vision" ? "rgba(255,255,255,0.7)" : "color-mix(in srgb, var(--accent) 7%, white)",
            }}
          >
            <span
              className="font-mono text-gray-500 uppercase self-start"
              style={{ border: "1px solid #D1D5DB", borderRadius: 4, padding: "2px 8px", fontSize: 11, letterSpacing: "0.06em", lineHeight: 1.4 }}
            >
              {c.tag}
            </span>
            <div className="flex items-center" style={{ gap: 12, marginTop: 12 }}>
              <Icon name={c.icon} />
              <p className="font-semibold text-gray-900 text-sm" style={{ margin: 0 }}>
                {c.title}
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed" style={{ margin: "8px 0 0" }}>
              {c.text}
            </p>
          </li>
        ))}
      </ul>

      {/* arrow from card 2 up and left to card 1, with a handwritten note (desktop only) */}
      {note && (
        <div aria-hidden="true" className="hidden min-[768px]:block" style={{ position: "relative", height: 52 }}>
          <svg
            width="96"
            height="46"
            viewBox="0 0 96 46"
            fill="none"
            stroke={BRIGHT}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", left: "calc(50% - 88px)", top: 2, overflow: "visible", pointerEvents: "none" }}
          >
            <path d="M 94,34 C 66,44 22,38 8,6" />
            <path d="M 1,14 L 7,5 L 15,12" />
          </svg>
          <span
            style={{
              position: "absolute",
              left: "calc(50% + 16px)",
              top: 16,
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 22,
              lineHeight: 1.2,
              color: BRIGHT,
              transform: "rotate(-2deg)",
              whiteSpace: "nowrap",
            }}
          >
            {note}
          </span>
        </div>
      )}
    </div>
  );
}
