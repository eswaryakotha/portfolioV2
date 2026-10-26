import * as LucideIcons from "lucide-react";
import type { WhatsNextData } from "@/data/content";

// "What's next": two equal cards (icon, small monospace label, text) with optional
// pill tags. Side by side from 768px, stacked below.

const BRIGHT = "var(--accent-bright, var(--accent))";

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp aria-hidden="true" size={36} strokeWidth={1.5} color={BRIGHT} />;
}

export default function WhatsNextSection({ data }: { data: WhatsNextData }) {
  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">{data.heading}</h2>
      <ul className="grid grid-cols-1 min-[768px]:grid-cols-2 list-none p-0 m-0" style={{ gap: 24 }}>
        {data.cards.map((c) => (
          <li
            key={c.label}
            className="border border-gray-200 bg-white flex flex-col"
            style={{ padding: 24, borderRadius: 4, gap: 12 }}
          >
            <Icon name={c.icon} />
            <p className="font-mono text-xs tracking-widest text-gray-400 uppercase" style={{ margin: 0 }}>
              {c.label}
            </p>
            <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
              {c.text}
            </p>
            {c.tags && c.tags.length > 0 && (
              <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", padding: 0, margin: "4px 0 0" }}>
                {c.tags.map((t) => (
                  <li
                    key={t}
                    style={{ border: `1px solid ${BRIGHT}`, borderRadius: 4, padding: "4px 10px", fontSize: 13, lineHeight: 1.4, color: "#1F2937" }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
