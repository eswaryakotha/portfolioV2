import NameLink from "@/components/NameLink";
import HeaderNav from "@/components/HeaderNav";
import HeaderInset from "@/components/HeaderInset";
import { siteContent } from "@/data/content";

/** The site header: on the left the name in a script face and a capsule saying I'm open to
    roles; on the right Work, Play and Resume. On narrow phones the links wrap to a second row. */
export default function Header() {
  return (
    <header className="relative z-40 bg-[#f9f9f7]">
      {/* side padding: lined up with the homepage book's side arrows on every page (the book
          measures them as --bk-arrow-inset; elsewhere HeaderInset works out where they would
          be as --header-inset), never under 24px */}
      <div className="px-[max(24px,var(--bk-arrow-inset,var(--header-inset,clamp(24px,5vw,96px))))] py-3 [@media(max-height:520px)]:py-1 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 max-[400px]:px-5">
        <div className="flex items-center gap-4 max-[400px]:gap-3">
          <NameLink
            // all lowercase; Sacramento has one weight, so a thin outline in the same colour
            // makes the strokes heavier
            className="font-[family-name:var(--font-sacramento)] text-[38px] [@media(max-height:520px)]:text-[28px] leading-none whitespace-nowrap max-[641px]:py-[3px] [@media(max-height:520px)]:py-2 lowercase text-[#1F5C45] [-webkit-text-stroke:0.6px_currentColor] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900"
          >
            {siteContent.name}
          </NameLink>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#1F5C45]/25 bg-[#1F5C45]/[0.07] px-3 py-1.5 text-[12.5px] max-[400px]:px-2.5 max-[400px]:text-[12px] [@media(max-height:520px)]:py-1 [@media(max-height:520px)]:text-[11px] font-medium leading-none text-[#1F5C45]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#1F5C45] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1F5C45]" />
            </span>
            {siteContent.status}
          </span>
        </div>
        <HeaderNav />
      </div>
      <HeaderInset />
    </header>
  );
}
