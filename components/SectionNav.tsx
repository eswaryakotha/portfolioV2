"use client";

import { useEffect, useRef, useState } from "react";
import { caseStudyNav } from "@/data/content";
import "./sectionNav.css";

type Item = { id: string; label: string };

/** Turns a section heading into its name in the list: the part before any ":" or "(", or
    the short name from caseStudyNav.short. */
function labelFor(heading: string) {
  const text = heading.replace(/\s+/g, " ").trim();
  const lower = text.toLowerCase();
  for (const [start, short] of Object.entries(caseStudyNav.short)) {
    if (lower.startsWith(start)) return short;
  }
  const cut = text.split(/[:(]/)[0].trim();
  // headings set in capitals in the content read as a sentence in the list
  return cut === cut.toUpperCase() ? cut.charAt(0) + cut.slice(1).toLowerCase() : cut;
}
const idFor = (label: string) =>
  `cs-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

/** The case study's sections, listed in the left white margin (wide screens only, see
    sectionNav.css). It reads the sections from the page itself (each top-level section with
    a heading), so it follows whatever a case study shows. The section you are reading is
    marked by a bar in the case study's colour that slides along the list; a click scrolls
    to that section. It shows once the first section is reached and hides at the end. */
export default function SectionNav() {
  const ref = useRef<HTMLElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const [thumb, setThumb] = useState<{ top: number; height: number } | null>(null);

  // find the sections and give each an id to scroll to
  useEffect(() => {
    const root = ref.current?.closest("[data-cs-root]");
    const sections = [...(root?.querySelectorAll<HTMLElement>("article > section") ?? [])].filter(
      (s) => s.querySelector("h2"),
    );
    const used = new Set<string>();
    const found = sections.map((s) => {
      const label = labelFor(s.querySelector("h2")!.textContent ?? "");
      let id = idFor(label);
      while (used.has(id)) id += "-2";
      used.add(id);
      s.id ||= id;
      return { id: s.id, label };
    });
     
    setItems(found);
  }, []);

  // which section is being read, and whether the list shows at all
  useEffect(() => {
    if (items.length === 0) return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!ref.current || ref.current.getClientRects().length === 0) return; // page kept hidden
      const vh = window.innerHeight;
      const line = vh * 0.35;
      let current = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) current = i;
      });
      const first = els[0].getBoundingClientRect();
      const last = els[els.length - 1].getBoundingClientRect();
      setActive(current);
      setShown(first.top < vh * 0.75 && last.bottom > vh * 0.25);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // the bar follows the current item
  useEffect(() => {
    const li = ref.current?.querySelectorAll<HTMLElement>("li")[active];
     
    if (li) setThumb({ top: li.offsetTop, height: li.offsetHeight });
  }, [active, items]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", `#${id}`);
  };

  return (
    <nav
      ref={ref}
      className={`cs-nav${shown ? " is-shown" : ""}`}
      aria-label={caseStudyNav.label}
      hidden={items.length === 0}
    >
      <p className="cs-nav-label" aria-hidden="true">
        {caseStudyNav.label}
      </p>
      <div className="cs-nav-track">
        {thumb && (
          <span
            className="cs-nav-thumb"
            aria-hidden="true"
            style={{ transform: `translateY(${thumb.top}px)`, height: thumb.height }}
          />
        )}
        <ol className="cs-nav-list">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => go(e, it.id)}
              className={i === active ? "is-active" : undefined}
              aria-current={i === active ? "location" : undefined}
              tabIndex={shown ? undefined : -1}
            >
              {it.label}
            </a>
          </li>
        ))}
        </ol>
      </div>
    </nav>
  );
}
