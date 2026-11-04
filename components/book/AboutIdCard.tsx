"use client";

import { useEffect, useRef, useState } from "react";
import { book } from "@/data/content";
import IdCardHolder from "@/components/idcard/IdCardHolder";
import { useBookPage } from "./bookCtx";

const ID = book.aboutSpread;
const HINT_KEY = "bk-id-hint-seen";

/** The About spread's left page: the ID card seated in its holder. The book draws the card's
    overlay while it is out; this is the holder and the seated card, inside the page. */
export default function AboutIdCard({ stop }: { stop: number }) {
  const api = useBookPage();
  const [hint, setHint] = useState(false);
  const current = api?.spread === stop && api.settled;
  const autoShow = api?.idCard.autoShow;
  const phase = api?.idCard.phase;
  const shownOut = useRef(false);

  // each time the spread opens and comes to rest, the card comes out by itself and goes back
  // after autoShowMs. Turning the page, or clicking the card, puts it back sooner.
  useEffect(() => {
    if (!current || !autoShow || ID.settings.autoShowMs <= 0) return;
    const t = window.setTimeout(() => autoShow(ID.settings.autoShowMs), 250);
    return () => window.clearTimeout(t);
  }, [current, autoShow]);

  // once per session, after the card has been out and is back in the holder: nudge it and
  // show the handwritten "pick me up" note for 4s
  useEffect(() => {
    if (phase && phase !== "seated") shownOut.current = true;
  }, [phase]);
  useEffect(() => {
    if (!current || phase !== "seated" || !ID.settings.hint || api?.reduced) return;
    if (ID.settings.autoShowMs > 0 && !shownOut.current) return;
    try {
      if (window.sessionStorage.getItem(HINT_KEY)) return;
      window.sessionStorage.setItem(HINT_KEY, "1");
    } catch {
      return; // storage blocked: skip the hint
    }
    const on = window.setTimeout(() => setHint(true), 400);
    const off = window.setTimeout(() => setHint(false), 4600);
    return () => {
      window.clearTimeout(on);
      window.clearTimeout(off);
    };
  }, [current, phase, api?.reduced]);

  if (!api) return null;
  return (
    <div className="bk-content bk-idc-page">
      <IdCardHolder
        data={ID.card}
        settings={ID.settings}
        ctl={api.idCard}
        layer="page"
        cardId={api.idCardId}
        hint={hint}
      />
    </div>
  );
}
