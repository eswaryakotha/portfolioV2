"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Fired on window when the name is clicked on the homepage: the book closes to its cover. */
export const CLOSE_BOOK_EVENT = "bk:close";

/** The name in the header. Elsewhere it is a plain link home (which opens on the cover);
    on the homepage a plain click closes the book with the usual page turns. */
export default function NameLink({ className, children }: { className: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new Event(CLOSE_BOOK_EVENT));
  };
  return (
    <Link href="/" onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
