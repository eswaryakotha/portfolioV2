"use client";

import Link from "next/link";
import { book, type BookBlock, type BookSpread, type BookTextBlock } from "@/data/content";
import { interceptLink, useBookPage } from "./bookCtx";
import VideoHalf from "./SpreadVideo";
import KeyImpact from "./KeyImpact";
import { richText } from "./richText";
import StickyNote from "./StickyNote";
import Polaroid from "./Polaroid";

const FONTS: Record<NonNullable<BookTextBlock["font"]>, string> = {
  advercase: "var(--font-advercase), Georgia, serif",
  sans: "var(--font-geist-sans), sans-serif",
  mono: "var(--font-geist-mono), monospace",
  handwriting: "var(--font-caveat), cursive",
};
/** full-size desktop page width that sizePx refers to; smaller pages scale it down */
const DESIGN_PAGE_PX = 530;

/** px on a full-size page, scaled down with smaller pages */
const scaled = (px: number) => {
  const cq = `${((Math.abs(px) / DESIGN_PAGE_PX) * 100).toFixed(3)}cqw`;
  return px < 0 ? `calc(-1 * min(${-px}px, ${cq}))` : `min(${px}px, ${cq})`;
};

/** A text block placed on a page (see BookBlock in data/content.ts). */
export function Block({ block }: { block: BookBlock }) {
  if (block.kind === "list") {
    return (
      <ul
        className="bk-list-block"
        style={{
          fontSize: block.sizePx ? scaled(block.sizePx) : undefined,
          color: block.color,
          marginTop: block.offsetYPx ? scaled(block.offsetYPx) : undefined,
        }}
      >
        {block.items.map((t) => (
          <li key={t}>{richText(t)}</li>
        ))}
      </ul>
    );
  }
  if (block.kind === "box") {
    return (
      <div
        className={`bk-box${block.dashed ? " is-dashed" : ""}`}
        style={{
          width: block.widthPx ? scaled(block.widthPx) : undefined,
          minHeight: block.minHeightPx ? scaled(block.minHeightPx) : undefined,
          marginTop: block.offsetYPx ? scaled(block.offsetYPx) : undefined,
          rotate: block.tiltDeg ? `${block.tiltDeg}deg` : undefined,
          borderColor: block.borderColor,
        }}
      >
        {block.children.map((c, i) => (
          <Block key={i} block={c} />
        ))}
      </div>
    );
  }
  const Tag = block.tag ?? "p";
  const size = block.sizePx;
  return (
    <Tag
      className={`bk-block${block.caps ? " is-caps" : ""}${block.oneLine ? " is-one-line" : ""}`}
      style={{
        fontFamily: block.font ? FONTS[block.font] : undefined,
        fontSize: size ? scaled(size) : undefined,
        fontWeight: block.weight,
        color: block.color,
        marginTop: block.offsetYPx ? scaled(block.offsetYPx) : undefined,
      }}
    >
      {block.text}
    </Tag>
  );
}

/** The part of a one-line title that runs past the fold. The left page clips the title at
    the fold, so the right page draws the same title in the same place (shifted one page to
    the left) and shows the rest of it. Hidden from screen readers: the left copy is read. */
function FoldCrossingTitle({ spread }: { spread: BookSpread }) {
  if (spread.type !== "case-study") return null;
  const first = spread.leftPage?.[0];
  if (!first || first.kind === "box" || first.kind === "list" || !first.oneLine) return null;
  return (
    <div className="bk-fold-title" aria-hidden="true">
      <Block block={{ ...first, tag: "p" }} />
    </div>
  );
}

/** Left-hand page content of a spread (the back of a leaf). */
export function LeftPage({ spread, stop }: { spread: BookSpread; stop: number }) {
  switch (spread.type) {
    case "about":
      return (
        <div className="bk-content bk-fill">
          <div className="bk-dashed bk-photo">{spread.photoPlaceholder}</div>
        </div>
      );
    case "case-study":
      return (
        <div className="bk-content">
          {spread.leftPage ? (
            spread.leftPage.map((b, i) => <Block key={i} block={b} />)
          ) : (
            <>
              <p className="bk-label">{spread.label}</p>
              <h2 className="bk-title">{spread.title}</h2>
              <p className="bk-hook">{spread.hook}</p>
              <ul className="bk-results">
                {spread.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
          {/* the "View case study" pull tab on the video opens the case study */}
          <VideoHalf spread={spread} stop={stop} side="l" />
          <KeyImpact spread={spread} side="l" />
        </div>
      );
    case "experiments":
      return (
        <div className="bk-content">
          <p className="bk-label">{spread.label}</p>
          <p className="bk-intro">{spread.intro}</p>
        </div>
      );
    case "coming-soon":
      return (
        <div className="bk-content bk-center">
          <h2 className="bk-big">{spread.heading}</h2>
          <p className="bk-hook">{spread.sub}</p>
        </div>
      );
  }
}

/** Right-hand page content of a spread (the front of the next leaf). */
export function RightPage({ spread, stop }: { spread: BookSpread; stop: number }) {
  const api = useBookPage();
  switch (spread.type) {
    case "about":
      return (
        <div className="bk-content bk-center bk-left-align">
          <p className="bk-label">{spread.label}</p>
          <p className="bk-intro">{spread.intro}</p>
          <Link href={spread.cta.href} className="bk-btn">
            {spread.cta.label}
          </Link>
        </div>
      );
    case "case-study":
      // the video is printed across the fold: its right half lives on this page
      return (
        <div className="bk-content bk-center">
          <VideoHalf spread={spread} stop={stop} side="r" />
          <KeyImpact spread={spread} side="r" />
          <FoldCrossingTitle spread={spread} />
          <StickyNote spread={spread} />
          <Polaroid spread={spread} />
          <Link
            href={spread.href}
            className="bk-btn bk-cta-mobile"
            onClick={(e) => interceptLink(e, api, stop)}
          >
            {spread.cta}
          </Link>
        </div>
      );
    case "experiments":
      return (
        <div className="bk-content bk-center">
          <div className="bk-grid">
            {Array.from({ length: spread.cells }, (_, i) => (
              <div key={i} className="bk-dashed bk-cell">
                {spread.placeholder}
              </div>
            ))}
          </div>
          <Link href={spread.cta.href} className="bk-btn">
            {spread.cta.label}
          </Link>
        </div>
      );
    case "coming-soon":
      return null;
  }
}

/** Plain stacked list: shown below 900px and with JavaScript off. One markup for both. */
export function BookFallback() {
  const spreads: BookSpread[] = book.spreads;
  return (
    <div className="bk-fallback">
      <header>
        <h1>{book.cover.title}</h1>
        <p>{book.cover.subtitle}</p>
      </header>
      {spreads.map((s) => (
        <section key={s.id} aria-label={s.name}>
          <p className="bk-fb-label">{s.label}</p>
          {s.type === "about" && (
            <>
              <p>{s.intro}</p>
              <Link href={s.cta.href}>{s.cta.label}</Link>
            </>
          )}
          {s.type === "case-study" && (
            <>
              {s.leftPage ? (
                s.leftPage
                  .flatMap((b) => (b.kind === "box" ? b.children : [b]))
                  .map((b, i) => {
                    if (b.kind === "list") {
                      return (
                        <ul key={i}>
                          {b.items.map((t) => (
                            <li key={t}>{richText(t)}</li>
                          ))}
                        </ul>
                      );
                    }
                    const Tag = b.tag ?? "p";
                    return <Tag key={i}>{b.text}</Tag>;
                  })
              ) : (
                <>
                  <h2>{s.title}</h2>
                  <p>{s.hook}</p>
                  <ul aria-label={book.ui.resultsLabel}>
                    {s.results.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </>
              )}
              {s.stickyNote && (
                <>
                  <h3>{s.stickyNote.label}</h3>
                  <p>{s.stickyNote.text}</p>
                </>
              )}
              {s.keyImpact && (
                <>
                  <h3>{s.keyImpact.label}</h3>
                  <ul>
                    {s.keyImpact.items.map((t) => (
                      <li key={t}>{richText(t)}</li>
                    ))}
                  </ul>
                  {s.keyImpact.footnote ? <p>{s.keyImpact.footnote}</p> : null}
                </>
              )}
              <Link href={s.href}>{s.cta}</Link>
            </>
          )}
          {s.type === "experiments" && (
            <>
              <p>{s.intro}</p>
              <Link href={s.cta.href}>{s.cta.label}</Link>
            </>
          )}
          {s.type === "coming-soon" && (
            <>
              <h2>{s.heading}</h2>
              <p>{s.sub}</p>
            </>
          )}
        </section>
      ))}
    </div>
  );
}
