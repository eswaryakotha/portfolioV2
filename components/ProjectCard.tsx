import Link from "next/link";
import type { Project } from "@/data/content";

export default function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <div className="border border-gray-200 flex flex-col h-full">
      {/* thumbnail placeholder */}
      <div className="bg-gray-100 w-full aspect-video" />
      <div className="p-5 flex flex-col gap-2 flex-1">
        <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
          {project.tags.join(" · ")}
        </p>
        <h3 className="text-base font-semibold text-gray-900">{project.title}</h3>
        <p className="text-sm text-gray-600">{project.summary}</p>
        {project.slug && (
          <span className="mt-auto font-mono text-xs text-gray-900 underline">
            View case study →
          </span>
        )}
        {!project.slug && (
          <span className="mt-auto font-mono text-xs text-gray-400">Coming soon</span>
        )}
      </div>
    </div>
  );

  if (project.slug) {
    return (
      <Link href={`/work/${project.slug}`} className="block hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    );
  }
  return <div className="opacity-70">{inner}</div>;
}
