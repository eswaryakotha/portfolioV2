import { siteContent } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-6">
          <a
            href={`mailto:${siteContent.email}`}
            className="font-mono text-xs text-gray-500 hover:text-gray-900"
          >
            {siteContent.email}
          </a>
          <a
            href={siteContent.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-500 hover:text-gray-900"
          >
            LinkedIn
          </a>
          <a
            href={siteContent.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-500 hover:text-gray-900"
          >
            GitHub
          </a>
        </div>
        <p className="font-mono text-xs text-gray-400">{siteContent.copyright}</p>
      </div>
    </footer>
  );
}
