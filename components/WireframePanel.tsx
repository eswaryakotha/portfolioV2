import AnnotatedScreen from "@/components/AnnotatedScreen";
import type { WireframesData } from "@/data/content";

export default function WireframePanel({ data }: { data: WireframesData }) {
  return (
    <div style={{ marginTop: 32 }}>
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
        {data.subLabel}
      </p>
      {data.screens.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 64, marginTop: 40 }}>
          {data.screens.map((screen, i) => (
            <AnnotatedScreen key={i} screen={screen} />
          ))}
        </div>
      )}
    </div>
  );
}
