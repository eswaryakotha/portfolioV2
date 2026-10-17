"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/data/content";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/play", label: "Play" },
  { href: "/resume", label: "Resume" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-[#f9f9f7]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-gray-900">
          {siteContent.name}
        </Link>
        <nav className="flex gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`font-mono text-xs tracking-widest uppercase ${
                  isActive
                    ? "text-gray-900 border-b border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
