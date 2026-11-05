"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Book, BookOpen } from "lucide-react";
import { book, bookHashForSlug } from "@/data/content";
import { useBookTransition } from "./TransitionLayer";

const S = book.settings;

/** "Back to Book" at the top of a case study: a real link to this project's spread in the
    homepage book. On desktop a plain click plays the zoom back into the book; with a modifier
    key or a middle click it is an ordinary link. In phone mode (where the book is not shown) it
    reads "All projects" instead, with the label swapped by the same media query as the
    homepage (transition.css), and is an ordinary link to the project's card on the phone page. */
export default function BackToBook({ slug }: { slug: string }) {
  const router = useRouter();
  const tx = useBookTransition();
  const hash = bookHashForSlug(slug);
  const spread = book.spreads.find((s) => s.type === "case-study" && s.slug === slug);
  const href = hash ? `/#${hash}` : "/";
  const name = spread?.name ?? slug;
  const placeholder = spread?.type === "case-study" ? spread.videoPlaceholder : "";

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab, window, download
    if (!window.matchMedia(S.desktopOnlyQuery).matches) return; // plain navigation where the book is not shown
    e.preventDefault();
    if (tx?.isBusy()) return; // one transition at a time
    if (!S.reverseZoom || !tx || !hash) {
      router.push(href);
      return;
    }
    if (!tx.runReverse({ href, slug, placeholder })) router.push(href);
  };
  const prefetch = () => router.prefetch("/");

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      className="group inline-flex items-center gap-2 rounded-sm font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 focus-visible:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900"
    >
      {/* laptops, desktops, tablets: back into the book */}
      <span className="btb-book inline-flex items-center gap-2">
        <Book
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className="group-hover:hidden group-focus-visible:hidden"
        />
        <BookOpen
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className="hidden group-hover:block group-focus-visible:block"
        />
        <span aria-hidden="true">{book.ui.backToBook}</span>
        <span className="sr-only">{book.ui.backToBookLabel.replace("{project}", name)}</span>
      </span>
      {/* phones: back to the project's card */}
      <span className="btb-phone items-center gap-2">
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />
        <span aria-hidden="true">{book.phone.backLink}</span>
        <span className="sr-only">{book.phone.backLinkLabel.replace("{project}", name)}</span>
      </span>
    </a>
  );
}
