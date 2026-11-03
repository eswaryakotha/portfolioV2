"use client";

import { useEffect, useRef } from "react";
import { useBookTransition } from "./TransitionLayer";

/** Marks a case study's hero visual (data-hero-media) and registers it as the landing spot
    for the book transition. Renders the same single div the page had before. */
export default function HeroMedia({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tx = useBookTransition();
  useEffect(() => {
    const el = ref.current;
    if (!tx || !el) return;
    tx.registerHero(el);
    return () => tx.unregisterHero(el);
  }, [tx]);
  return (
    <div ref={ref} className={className} data-hero-media="">
      {children}
    </div>
  );
}
