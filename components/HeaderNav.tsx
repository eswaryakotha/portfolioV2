"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { book, projects } from "@/data/content";
import { useBookTransition } from "@/components/transition/TransitionLayer";

/** The case studies under Work, in this order (titles come from `projects`). */
const WORK_SLUGS = ["veraai", "metamint", "dolby-labs"];
const WORK = WORK_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
  (p): p is (typeof projects)[number] => !!p,
);

/** The Playground spread in the book. */
const PLAY_ID = book.spreads.find((s) => s.type === "experiments")?.id ?? "playground";

/** The resume link from the book's contact page. */
const RESUME_HREF = book.spreads
  .flatMap((s) => ("links" in s && Array.isArray(s.links) ? s.links : []))
  .find((l: { kind?: string }) => l.kind === "resume")?.href as string | undefined;

const CLOSE_DELAY_MS = 150; // lets the cursor cross the gap between Work and its menu

const ITEM =
  "rounded-sm text-[14px] font-medium leading-none text-gray-700 hover:text-[#1F5C45] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900";

/** Work (a menu of case studies, opened on hover or click), Play and Resume, in Geist. */
export default function HeaderNav() {
  const pathname = usePathname();
  const tx = useBookTransition();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const wrap = useRef<HTMLDivElement>(null);
  const hoverOpened = useRef(false); // a click right after hovering keeps the menu open

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  // close on Escape, or a tap or click anywhere else (touch screens have no hover)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // a route change (clicking a case study) closes the menu
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // on the homepage the book follows the hash, but <Link> updates it without a hashchange
  // event, so set it directly (and nudge the book if it is already #playground)
  const onPlay = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash === `#${PLAY_ID}`) window.dispatchEvent(new HashChangeEvent("hashchange"));
    else window.location.hash = PLAY_ID;
  };

  // a case study from the menu: a short fade between the pages (TransitionLayer.runPage);
  // new-tab clicks, the page already shown, or a transition already running go the plain way
  const onWork = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    if (tx?.runPage(href)) e.preventDefault();
  };

  return (
    <nav aria-label="Main" className="font-[family-name:var(--font-geist-sans)] flex items-center gap-6 max-[400px]:gap-5">
      <div
        ref={wrap}
        className="relative"
        onMouseEnter={() => {
          hoverOpened.current = !open;
          show();
        }}
        onMouseLeave={hideSoon}
      >
        <button
          type="button"
          className={`${ITEM} inline-flex items-center gap-1 ${open ? "text-[#1F5C45]" : ""}`}
          aria-expanded={open}
          aria-controls="header-work-menu"
          onClick={() => {
            if (hoverOpened.current) hoverOpened.current = false;
            else setOpen((o) => !o);
          }}
          onFocus={show}
        >
          Work
          <svg
            aria-hidden="true"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* pt-3 is a hover bridge: the cursor stays inside while moving down to the menu */}
        <div
          id="header-work-menu"
          className={`absolute left-0 top-full z-50 pt-3 transition-[opacity,translate] duration-150 ${
            open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1"
          }`}
          onBlur={(e) => {
            if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
          }}
        >
          <ul className="min-w-[168px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            {WORK.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  onClick={onWork(`/work/${p.slug}`)}
                  className="block rounded-md px-3 py-2.5 text-[14px] font-medium leading-none text-gray-700 hover:bg-[#1F5C45]/[0.07] hover:text-[#1F5C45] focus-visible:bg-[#1F5C45]/[0.07] focus-visible:text-[#1F5C45] focus-visible:outline-none"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link href={`/#${PLAY_ID}`} onClick={onPlay} className={ITEM}>
        Play
      </Link>
      {RESUME_HREF ? (
        <a href={RESUME_HREF} target="_blank" rel="noopener noreferrer" className={ITEM}>
          Resume
        </a>
      ) : null}
    </nav>
  );
}
