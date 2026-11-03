"use client";

import { book } from "@/data/content";
import Book, { useMedia } from "./Book";
import { BookFallback } from "./BookPages";

const S = book.settings;

/* With JavaScript off, show the list at every width and let the page scroll normally. */
const NO_JS_CSS =
  ".bk-root{display:none!important}.bk-list{display:block!important}" +
  "body:has(.bk-home){height:auto!important;overflow:visible!important;display:block!important}";

/** Homepage. At 900px and wider (with JS) the 3D book; below that, or with JS off, the stacked
    list. The list is one server rendered markup; CSS decides which of the two shows, so there
    is no flash in either direction. With mobileBook on, the book shows at every width. */
export default function HomeBook() {
  const desktop = useMedia(S.desktopOnlyQuery, true);
  return (
    <div className={`bk-home${S.mobileBook ? " bk-mobile-book" : ""}`}>
      {(desktop || S.mobileBook) && <Book />}
      <div className="bk-list">
        <BookFallback />
      </div>
      <noscript>
        <style>{NO_JS_CSS}</style>
      </noscript>
    </div>
  );
}
