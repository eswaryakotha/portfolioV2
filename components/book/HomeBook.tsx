"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { book } from "@/data/content";

const S = book.settings;
const RESIZE_DEBOUNCE_MS = 150;

/* The book (its 3D code, videos and sky) is its own download, fetched only when it mounts. */
const Book = dynamic(() => import("./Book"), { ssr: false });

/* With JavaScript off, show the phone page at every width and let the page scroll normally. */
const NO_JS_CSS =
  ".bk-root{display:none!important}.ph-home{display:block!important}" +
  "body:has(.bk-home){height:auto!important;overflow:visible!important;display:block!important}";

/** Whether the book should be mounted: only where book.settings.desktopOnlyQuery matches
    (laptops, desktops, tablets), checked after hydration, so phones never load it. Rotating
    or resizing switches modes without a reload, once the size has settled for 150ms. */
function useBookMode() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(S.desktopOnlyQuery);
    const read = () => S.mobileBook || mql.matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the first read, after hydration
    setOn(read());
    let t = 0;
    const later = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setOn(read()), RESIZE_DEBOUNCE_MS);
    };
    mql.addEventListener("change", later);
    window.addEventListener("resize", later);
    return () => {
      window.clearTimeout(t);
      mql.removeEventListener("change", later);
      window.removeEventListener("resize", later);
    };
  }, []);
  return on;
}

/** Homepage. Laptops, desktops and tablets get the 3D book; phones (either way up), and
    every width with JavaScript off, get the phone page. The phone page is server rendered and
    phone.css decides when it shows, so neither mode flashes on first paint. */
export default function HomeBook({ phone }: { phone: ReactNode }) {
  const bookMode = useBookMode();
  return (
    <div className={`bk-home${S.mobileBook ? " bk-mobile-book" : ""}`}>
      {bookMode && <Book />}
      {phone}
      <noscript>
        <style>{NO_JS_CSS}</style>
      </noscript>
    </div>
  );
}
