import Link from "next/link";
import { siteContent } from "@/data/content";

/** The site header: the name in a script face, and a capsule saying I'm open to roles. */
export default function Header() {
  return (
    <header className="bg-[#f9f9f7]">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-center gap-4">
        <Link
          href="/"
          // all lowercase; Sacramento has one weight, so a thin outline in the same colour
          // makes the strokes heavier
          className="font-[family-name:var(--font-sacramento)] text-[38px] leading-none lowercase text-[#1F5C45] [-webkit-text-stroke:0.6px_currentColor] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900"
        >
          {siteContent.name}
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1F5C45]/25 bg-[#1F5C45]/[0.07] px-3 py-1.5 text-[12.5px] font-medium leading-none text-[#1F5C45]">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#1F5C45] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1F5C45]" />
          </span>
          {siteContent.status}
        </span>
      </div>
    </header>
  );
}
