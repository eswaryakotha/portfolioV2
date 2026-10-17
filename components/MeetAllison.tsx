import fs from "fs";
import path from "path";
import * as LucideIcons from "lucide-react";
import type { MeetAllisonData } from "@/data/content";
import DecorativeQuote from "@/components/DecorativeQuote";

const ORANGE = "#E07B39";
const IMAGE_EXTS = ["png", "webp", "jpg", "svg"] as const;

function findImage(baseName: string): string | null {
  for (const ext of IMAGE_EXTS) {
    const abs = path.join(process.cwd(), "public", "comic", `${baseName}.${ext}`);
    if (fs.existsSync(abs)) return `/comic/${baseName}.${ext}`;
  }
  return null;
}

function Icon({ name, size = 40 }: { name: string; size?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={1.5} color="#626469" />;
}

export default function MeetAllison({ data }: { data: MeetAllisonData }) {
  const imageSrc = findImage(data.imageBaseName);

  return (
    <div>
      {/* section label */}
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
        01. Making an audiobook
      </p>

      {/* three columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>

        {/* ── Col 1: image, no border ── */}
        <div>
          {/* centered label above image */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span
              style={{
                color: ORANGE,
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 17,
                lineHeight: 1,
              }}
            >
              Meet Allison!
            </span>
          </div>

          {/* image or placeholder */}
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Allison — writer and content creator"
              style={{
                width: "40%",
                aspectRatio: "2 / 3",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
                background: "transparent",
              }}
            />
          ) : (
            <div
              role="img"
              aria-label="Allison character placeholder"
              style={{
                width: "100%",
                aspectRatio: "2 / 3",
                background: "#F2F2F0",
                border: "1px dashed #C0C0C0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 10,
                  color: "#888",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                [Drop Allison&apos;s cartoon here:
                <br />
                /public/comic/{data.imageBaseName}.png]
              </span>
            </div>
          )}

          {/* caption */}
          <p
            style={{
              marginTop: 8,
              fontSize: 11,
              color: "#777",
              fontFamily: "'Courier New', monospace",
              textAlign: "center",
              letterSpacing: "0.03em",
            }}
          >
            {data.caption}
          </p>
        </div>

        {/* ── Col 2: stories → audiobooks ── */}
        <div
          className="border border-gray-200"
          style={{ padding: 16, display: "flex", flexDirection: "column" }}
        >
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            paddingTop: 40,
          }}>
            {data.col2.icons.map((icon, i) => (
              <Icon key={i} name={icon.name} size={icon.size ?? 40} />
            ))}
          </div>
          <p
            className="text-sm text-gray-700 leading-relaxed"
            style={{ marginTop: "auto", paddingTop: 16, textAlign: "center" }}
          >
            {data.col2.text}
          </p>
        </div>

        {/* ── Col 3: recording / editing / production ── */}
        <div
          className="border border-gray-200"
          style={{ padding: 16, display: "flex", flexDirection: "column" }}
        >
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 20,
            paddingTop: 40,
          }}>
            {data.col3.icons.map((icon, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <Icon name={icon.name} size={icon.size ?? 40} />
                {icon.label && (
                  <span style={{
                    fontSize: 10,
                    color: "#777",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.03em",
                  }}>
                    {icon.label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p
            className="text-sm text-gray-700 leading-relaxed"
            style={{ marginTop: "auto", paddingTop: 16, marginBottom: 16, textAlign: "center" }}
          >
            {data.col3.text}
          </p>
        </div>
      </div>

      {/* ── Decorative quote ── */}
      <div style={{ marginTop: 36 }}>
        <DecorativeQuote text={data.speechBubble} />
      </div>
    </div>
  );
}
