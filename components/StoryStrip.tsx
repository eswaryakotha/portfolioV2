import fs from "fs";
import path from "path";
import * as LucideIcons from "lucide-react";
import type { StoryStripData, StripColumn } from "@/data/content";
import DecorativeQuote from "@/components/DecorativeQuote";
import ProcessFlowchart from "@/components/ProcessFlowchart";
import StripScene from "@/components/StripScene";
import ProcessSteps from "@/components/ProcessSteps";

const ACCENT = "var(--accent)";
const HANDWRITING = "var(--accent-bright, var(--accent))";
const IMAGE_EXTS = ["png", "webp", "jpg", "svg"] as const;

function findImage(baseName: string): string | null {
  for (const ext of IMAGE_EXTS) {
    const abs = path.join(process.cwd(), "public", "comic", `${baseName}.${ext}`);
    if (fs.existsSync(abs)) return `/comic/${baseName}.${ext}`;
  }
  return null;
}

function Icon({
  name,
  size = 40,
  color = "#626469",
  strokeWidth = 1.5,
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (LucideIcons as any)[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={strokeWidth} color={color} />;
}

const placeholderBox: React.CSSProperties = {
  background: "#F2F2F0",
  border: "1px dashed #C0C0C0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  boxSizing: "border-box",
};

const placeholderText: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: 10,
  color: "#888",
  textAlign: "center",
  lineHeight: 1.6,
};

function Column({ col }: { col: StripColumn }) {
  const hasBox = col.box !== false;
  const text = (
    <p
      className="text-sm text-gray-700 leading-relaxed"
      style={{
        marginTop: "auto",
        paddingTop: 16,
        marginBottom: col.textMarginBottom,
        textAlign: "center",
      }}
    >
      {col.text}
    </p>
  );

  return (
    <div
      className={hasBox ? "border border-gray-200" : undefined}
      style={{ padding: 16, display: "flex", flexDirection: "column" }}
    >
      {col.icons && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: col.iconsAlign ?? "center",
            gap: col.iconsGap ?? 10,
            paddingTop: 40,
          }}
        >
          {col.icons.map((icon, i) =>
            icon.label ? (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <Icon name={icon.name} size={icon.size ?? 40} />
                <span style={{ fontSize: 10, color: "#777", fontFamily: "'Courier New', monospace", letterSpacing: "0.03em" }}>
                  {icon.label}
                </span>
              </div>
            ) : (
              <Icon key={i} name={icon.name} size={icon.size ?? 40} />
            )
          )}
        </div>
      )}
      {!col.icons && col.image && (
        <img
          src={col.image.src}
          alt={col.image.alt}
          width={col.image.width}
          height={col.image.height}
          style={{
            width: "42%",
            height: "auto",
            display: "block",
            margin: "0 auto",
            mixBlendMode: col.image.blend ? "multiply" : undefined,
          }}
        />
      )}
      {!col.icons && !col.image && (
        <div
          role="img"
          aria-label="Illustration placeholder"
          style={{ ...placeholderBox, width: "42%", aspectRatio: "287 / 400", margin: "0 auto" }}
        >
          <span style={placeholderText}>[illustration]</span>
        </div>
      )}
      {text}
    </div>
  );
}

function Person({ person, imageWidth = "40%" }: { person: StoryStripData["person"]; imageWidth?: string }) {
  const imageSrc = person.imageBaseName ? findImage(person.imageBaseName) : person.image?.src ?? null;
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        {(() => {
          const label = (
            <span
              style={{
                color: person.arrow ? HANDWRITING : ACCENT,
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 17,
                lineHeight: 1,
              }}
            >
              {person.label}
            </span>
          );
          if (!person.arrow) return label;
          return (
            <span style={{ position: "relative", display: "inline-block" }}>
              {label}
              <svg
                aria-hidden="true"
                focusable="false"
                width="26"
                height="24"
                viewBox="0 0 26 24"
                fill="none"
                stroke={HANDWRITING}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: "absolute",
                  left: "100%",
                  top: "40%",
                  marginLeft: 4,
                  overflow: "visible",
                  pointerEvents: "none",
                }}
              >
                <path d="M 2,2 C 16,0 24,9 20,21" />
                <path d="M 15,16 L 20,22 L 25,15" />
              </svg>
            </span>
          );
        })()}
      </div>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={person.alt}
          width={person.image?.width}
          height={person.image?.height}
          style={{
            width: imageWidth,
            aspectRatio: "2 / 3",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
            background: "transparent",
            mixBlendMode: person.image?.blend ? "multiply" : undefined,
          }}
        />
      ) : (
        <div
          role="img"
          aria-label={`${person.name} character placeholder`}
          style={{ ...placeholderBox, width: "100%", aspectRatio: "2 / 3" }}
        >
          <span style={placeholderText}>
            [Drop {person.name}&apos;s cartoon here:
            <br />
            /public/comic/{person.imageBaseName}.png]
          </span>
        </div>
      )}

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
        {person.caption}
      </p>
    </div>
  );
}

// Story row for any number of boxes: the person first, then numbered boxes.
// 1100+: person in a left column spanning both rows (vertically centered), boxes
// 2-up beside it. 768–1099: person centered
// on top, boxes 2-up below. <768: stacked. DOM order stays person, 01, 02, ...
// so screen readers read the story in order.
function StepsRow({ data }: { data: StoryStripData }) {
  return (
    <ol
      className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[1100px]:grid-cols-[224px_240px_240px] min-[1100px]:justify-center min-[1100px]:auto-rows-fr list-none p-0 m-0"
      style={{ gap: 16, marginTop: 40 }}
    >
      <li className="relative min-[768px]:col-span-2 min-[768px]:justify-self-center min-[768px]:w-1/2 min-[1100px]:col-span-1 min-[1100px]:col-start-1 min-[1100px]:row-start-1 min-[1100px]:row-span-2 min-[1100px]:w-full min-[1100px]:self-center min-[1100px]:justify-self-stretch">
        <Person person={data.person} imageWidth="60%" />
      </li>
      {data.columns.map((col, i) => {
        const hasImage = !!col.image?.src;
        return (
          <li
            key={i}
            className="relative border border-gray-200 flex flex-col"
            style={{ padding: 16, paddingTop: 28 }}
          >
            <span
              aria-hidden="true"
              className="font-mono text-gray-400"
              style={{ position: "absolute", top: 10, left: 12, fontSize: 11, letterSpacing: "0.05em" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {col.icon ? (
              <div
                aria-hidden="true"
                style={{
                  width: "42%",
                  aspectRatio: "287 / 400",
                  margin: "0 auto",
                  display: "flex",
                  position: "relative",
                }}
              >
                {/* wider than the image area so the note can sit beside the icon */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "-40%",
                    right: "-40%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transform: col.iconOffsetY ? `translateY(${col.iconOffsetY}px)` : undefined,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {col.iconLead && (
                      <Icon
                        name={col.iconLead.name ?? "Check"}
                        size={col.iconLead.size ?? 28}
                        color={col.iconLead.color}
                        strokeWidth={2.25}
                      />
                    )}
                    <Icon name={col.icon.name} size={col.icon.size ?? 48} />
                    {col.badge && (
                      <span
                        style={{
                          fontFamily: "var(--font-caveat), cursive",
                          fontSize: 26,
                          lineHeight: 1,
                          color: HANDWRITING,
                          transform: "rotate(-4deg)",
                        }}
                      >
                        {col.badge}
                      </span>
                    )}
                  </div>
                  {col.iconCaption && (
                    <span className="text-sm font-bold text-gray-900" style={{ lineHeight: 1.2 }}>
                      {col.iconCaption}
                    </span>
                  )}
                </div>
              </div>
            ) : hasImage ? (
              <img
                src={col.image!.src}
                alt={col.image!.alt}
                width={col.image!.width}
                height={col.image!.height}
                style={{
                  width: "42%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  mixBlendMode: col.image!.blend ? "multiply" : undefined,
                }}
              />
            ) : (
              <div
                role="img"
                aria-label="Illustration placeholder"
                style={{ ...placeholderBox, width: "42%", aspectRatio: "287 / 400", margin: "0 auto" }}
              >
                <span style={placeholderText}>[illustration]</span>
              </div>
            )}
            <p
              className="text-sm text-gray-700 leading-relaxed"
              style={{
                marginTop: "auto",
                paddingTop: 16,
                textAlign: "center",
                transform: col.textOffsetY ? `translateY(${col.textOffsetY}px)` : undefined,
              }}
            >
              {col.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

// Person plus a single row of boxes, each with an animated icon scene (or an
// optional image) on top and the text lined up at the bottom. 1100+: all in one row.
// 768-1099: the person centered on top, boxes in a row below. <768: one column.
function RowSteps({ data }: { data: StoryStripData }) {
  return (
    <ol
      className="grid grid-cols-1 min-[768px]:grid-cols-3 min-[1100px]:grid-cols-4 list-none p-0 m-0"
      style={{ gap: 16, marginTop: 40 }}
    >
      <li className="relative min-[768px]:col-span-3 min-[768px]:justify-self-center min-[768px]:w-1/3 min-[1100px]:col-span-1 min-[1100px]:w-full">
        <Person person={data.person} imageWidth="70%" />
      </li>
      {data.columns.map((col, i) => (
        <li key={i} className="relative border border-gray-200 flex flex-col" style={{ padding: 16, paddingTop: 28 }}>
          <span
            aria-hidden="true"
            className="font-mono text-gray-400"
            style={{ position: "absolute", top: 10, left: 12, fontSize: 11, letterSpacing: "0.05em" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          {col.image?.src ? (
            <img
              src={col.image.src}
              alt={col.image.alt}
              width={col.image.width}
              height={col.image.height}
              style={{ width: 120, maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }}
            />
          ) : col.scene ? (
            <StripScene kind={col.scene.kind} icons={col.scene.icons} />
          ) : null}
          <p
            className="text-gray-700 leading-relaxed"
            style={{ marginTop: "auto", paddingTop: 16, textAlign: "center", fontSize: 14 }}
          >
            {col.text}
          </p>
          {i < data.columns.length - 1 && (
            <svg
              aria-hidden="true"
              focusable="false"
              className="hidden min-[768px]:block"
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: "absolute", left: "100%", top: "50%", marginTop: -6, pointerEvents: "none" }}
            >
              <path d="M 1,6 H 14 M 10,2 L 14.5,6 L 10,10" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function StoryStrip({ data }: { data: StoryStripData }) {
  const { person } = data;
  const ariaDescription = data.ariaDescription
    ? ({ "aria-description": data.ariaDescription } as Record<string, string>)
    : {};

  return (
    <div {...(data.ariaDescription ? { role: "group", "aria-label": data.ariaLabel ?? data.subLabel } : {})} {...ariaDescription}>
      {/* section label */}
      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">{data.subLabel}</p>

      {data.layout === "row" ? (
        <RowSteps data={data} />
      ) : data.layout === "steps" ? (
        <StepsRow data={data} />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>
        <Person person={person} />

        {data.columns.map((col, i) => (
          <Column key={i} col={col} />
        ))}
      </div>
      )}

      {data.quote && (
        <div style={{ marginTop: 36 }}>
          <DecorativeQuote text={data.quote} maxWidth={data.quoteMaxWidth} />
        </div>
      )}

      {data.processRow && <ProcessSteps data={data.processRow} />}

      {data.closingText && (
        <p className="text-sm text-gray-800 leading-relaxed" style={{ marginTop: 24 }}>
          {data.closingText}
        </p>
      )}

      {data.flowchart && <ProcessFlowchart data={data.flowchart} />}

      {data.afterFlowchartText && (
        <p className="text-sm text-gray-800 leading-relaxed">{data.afterFlowchartText}</p>
      )}

      {data.afterFlowchartQuote && (
        <div style={{ marginTop: 36 }}>
          <DecorativeQuote text={data.afterFlowchartQuote} maxWidth={600} />
        </div>
      )}
    </div>
  );
}
