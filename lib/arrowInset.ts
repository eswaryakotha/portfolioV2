import { book } from "@/data/content";

const S = book.settings;
const ARROW_GAP = 40; // book.css .bk-side-prev: var(--arrow-gap, 40px)
const DOTS_H = 56; // the page dots under the book (book.css .bk-dots); 30 on short screens
const DOTS_H_SHORT = 30;
const MIN_LEFT = 8; // book.css: max(8px, ...)

/**
 * Where the homepage book's side arrows sit, as a distance from the screen edge, for a window
 * of `w` by `h` with a header `headerH` tall. Mirrors book.css (.bk-stage --bw and
 * .bk-side-prev left, with its max-width 899.98px and max-height 520px overrides), so pages
 * without the book can line the header up with where the arrows would be.
 * Keep in step with book.css if the book's sizing changes.
 */
export function arrowInset(w: number, h: number, headerH: number): number {
  const narrow = w < 900;
  const short = h <= 520;
  const bookScale = short ? 0.97 : narrow ? 0.94 : S.bookScale;
  const arrowSpace = S.sideArrows ? (narrow ? 48 : S.sideArrowSpacePx) : 0;
  const arrowW = narrow ? 40 : S.sideArrowWidthPx;
  const stageGap = short ? 12 : S.stageGapPx;
  const stageW = w;
  const stageH = h - headerH - (short ? DOTS_H_SHORT : DOTS_H);
  const bw =
    Math.min(
      (S.maxBookWidthVw / 100) * stageW,
      S.maxBookWidthPx,
      (stageH - stageGap) * S.bookAspect,
      stageW - arrowSpace * 2,
    ) * bookScale;
  return Math.max(MIN_LEFT, (stageW - bw) / 2 - arrowW - ARROW_GAP);
}
