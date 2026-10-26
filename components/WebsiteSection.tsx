import fs from "fs";
import path from "path";
import Image from "next/image";
import type { WebsiteData } from "@/data/content";
import VideoFrame from "@/components/VideoFrame";
import Reveal from "@/components/Reveal";

// "Bringing VeraAI to market": intro, a video placeholder, two browser-framed
// screenshots, and a contribution callout. Images are
// read from /public; a missing file shows a dashed placeholder instead.

const BRIGHT = "var(--accent-bright, var(--accent))";
const BORDER = "#E5E7EB";

// Returns the file's real size for PNGs (from the header), or null if it is missing
// or not a PNG. Missing means "show the placeholder".
function inspect(src: string): { exists: boolean; size: { w: number; h: number } | null } {
  if (!src) return { exists: false, size: null };
  const abs = path.join(process.cwd(), "public", src);
  if (!fs.existsSync(abs)) return { exists: false, size: null };
  try {
    const fd = fs.openSync(abs, "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf.readUInt32BE(0) === 0x89504e47) return { exists: true, size: { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) } };
  } catch {
    /* fall through */
  }
  return { exists: true, size: null };
}

function Placeholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        aspectRatio: ratio,
        width: "100%",
        border: "1px dashed #bbb",
        background: "#f9f9f7",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <span className="font-mono text-xs text-gray-400" style={{ textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: "8px 8px 0 0", overflow: "hidden", background: "#fff" }}>
      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 5, height: 24, padding: "0 10px", background: "#F3F4F6", borderBottom: `1px solid ${BORDER}` }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#C4C8CE" }} />
        ))}
      </div>
      {children}
    </div>
  );
}

export default function WebsiteSection({ data }: { data: WebsiteData }) {
  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">{data.heading}</h2>
      <p className="text-sm text-gray-800 leading-relaxed">{data.intro}</p>

      {/* 01 */}
      <div style={{ marginTop: 32 }}>
        <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.first.subLabel}</p>
        <VideoFrame
          videoUrl={data.first.videoUrl}
          poster={data.first.poster}
          placeholderLabel={data.first.placeholderLabel}
          title="Website walkthrough video (placeholder)"
        />
        <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 16 }}>
          {data.first.caption}
        </p>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", padding: 0, margin: "12px 0 0" }}>
          {data.first.tags.map((t) => (
            <li key={t} className="font-mono text-gray-500" style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", fontSize: 11 }}>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* 02 */}
      <div style={{ marginTop: 40 }}>
        <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.communicating.subLabel}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {data.communicating.blocks.map((b) => {
            const info = inspect(b.src);
            const w = info.size?.w ?? b.width ?? 1600;
            const h = info.size?.h ?? b.height ?? 1000;
            return (
              <Reveal key={b.src}>
                <BrowserFrame>
                  {info.exists ? (
                    <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                      <Image
                        src={b.src}
                        alt={b.alt}
                        width={w}
                        height={h}
                        sizes="(min-width: 1024px) 976px, 100vw"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                      />
                    </div>
                  ) : (
                    <Placeholder label={b.placeholderLabel} ratio="16 / 10" />
                  )}
                </BrowserFrame>
                <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 16 }}>
                  {b.caption}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 40, background: "#F5F5F4", borderLeft: `3px solid ${BRIGHT}`, padding: 20 }}>
        <p className="font-mono text-gray-400 uppercase" style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.06em" }}>
          {data.contribution.label}
        </p>
        <p className="text-sm text-gray-800 leading-relaxed" style={{ margin: 0 }}>
          {data.contribution.text}
        </p>
      </div>
    </section>
  );
}
