"use client";
import { usePathname } from "next/navigation";
import { siteContent } from "@/data/content";

/** The footer on every page but the homepage: the copyright line, on the right. */
export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null; // the homepage book fills the viewport

  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex justify-end">
        <p className="font-mono text-xs text-gray-400">{siteContent.copyright}</p>
      </div>
    </footer>
  );
}
