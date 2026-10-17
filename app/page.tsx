import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { siteContent, projects } from "@/data/content";

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* intro */}
      <section className="border-b border-gray-200 pb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
          {siteContent.role}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">{siteContent.name}</h1>
        <div className="flex flex-col gap-3 max-w-2xl">
          {siteContent.bio.map((p, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <a
            href={`mailto:${siteContent.email}`}
            className="font-mono text-xs uppercase tracking-widest border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Get in touch →
          </a>
        </div>
      </section>

      {/* selected work */}
      <section className="pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400">
            Selected work
          </h2>
          <Link
            href="/work"
            className="font-mono text-xs text-gray-500 hover:text-gray-900"
          >
            All projects →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {featured.map((project) => (
            <div key={project.id} className="bg-[#f9f9f7]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
