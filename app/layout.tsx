import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Sacramento } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionLayer from "@/components/transition/TransitionLayer";
import { siteContent } from "@/data/content";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const sacramento = Sacramento({ variable: "--font-sacramento", subsets: ["latin"], weight: "400" });
const advercase = localFont({
  src: "../public/fonts/OTF/Advercase-Regular.otf",
  variable: "--font-advercase",
  weight: "400",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** The site's address, for the full URLs link previews need: Netlify sets URL at build time. */
const SITE_URL = process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteContent.title,
  description: siteContent.description,
  // link previews; each case study replaces these with its own (app/work/[slug]/page.tsx)
  openGraph: {
    type: "website",
    siteName: siteContent.title,
    title: siteContent.title,
    description: siteContent.description,
    images: [{ url: siteContent.shareImage, ...siteContent.shareImageSize, alt: "The cover of Eswarya Kotha's portfolio book" }],
  },
  // the "EK" monogram from the earlier portfolio
  icons: { icon: "/favicon/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${sacramento.variable} ${advercase.variable} font-sans bg-[#f9f9f7] text-gray-900 antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          <TransitionLayer>{children}</TransitionLayer>
        </main>
        <Footer />
      </body>
    </html>
  );
}
