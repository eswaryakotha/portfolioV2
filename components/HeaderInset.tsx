"use client";

import { useEffect } from "react";
import { arrowInset } from "@/lib/arrowInset";

/** Sets --header-inset on <html>: where the homepage book's side arrows sit (lib/arrowInset),
    so the header lines up with them on every page, not only where the book is showing. The
    book's own measurement (--bk-arrow-inset) wins while it is on screen. Renders nothing. */
export default function HeaderInset() {
  useEffect(() => {
    const html = document.documentElement;
    const header = document.querySelector("body > header");
    const update = () => {
      const headerH = header instanceof HTMLElement ? header.offsetHeight : 62;
      html.style.setProperty("--header-inset", `${arrowInset(window.innerWidth, window.innerHeight, headerH).toFixed(1)}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      html.style.removeProperty("--header-inset");
    };
  }, []);
  return null;
}
