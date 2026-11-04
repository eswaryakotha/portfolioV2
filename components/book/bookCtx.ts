import { createContext, useContext } from "react";
import type { IdCardCtl } from "@/components/idcard/useIdCard";

/** What the page components inside the book need from the book. */
export type BookPageApi = {
  spread: number; // current stop
  settled: boolean; // no leaf is moving
  reduced: boolean;
  hintFor: number | null; // stop that shows the one-time "pull" hint
  /** start the transition into this stop's case study (ignored if not current or busy) */
  openCaseStudy: (stop: number) => void;
  prefetch: (href: string) => void;
  isBusy: () => boolean;
  /** arriving back from a case study: the video card stays down until the book settles */
  arriving: boolean;
  /** each case-study page registers how to finish and how to undo its tab pull */
  registerTab: (stop: number, r: { finish: (ms: number) => void; reset: () => void } | null) => void;
  /** the ID card on the About spread (its overlay is drawn by the book) */
  idCard: IdCardCtl;
  idCardId: string;
};

export const BookPageCtx = createContext<BookPageApi | null>(null);
export const useBookPage = () => useContext(BookPageCtx);

/** Normal click on a link: run the book transition. Modifier keys and middle clicks are left
    to the browser (new tab, new window, download). */
export function interceptLink(
  e: React.MouseEvent<HTMLAnchorElement>,
  api: BookPageApi | null,
  stop: number,
) {
  if (!api || e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  api.openCaseStudy(stop);
}
