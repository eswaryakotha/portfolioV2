import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/content";

export default function WorkPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="border-b border-gray-200 pb-8 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Work</p>
        <h1 className="text-2xl font-semibold text-gray-900">Selected projects</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#f9f9f7]">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
