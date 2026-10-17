import { aboutContent } from "@/data/content";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="border-b border-gray-200 pb-8 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">About</p>
        <h1 className="text-2xl font-semibold text-gray-900">{aboutContent.headline}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-12">
        {/* left: bio + background + skills */}
        <div className="flex flex-col gap-10">
          {/* bio */}
          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
              Bio
            </h2>
            <div className="flex flex-col gap-3">
              {aboutContent.bio.map((p, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* background */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
              Background
            </h2>
            <ul className="flex flex-col gap-4">
              {aboutContent.background.map((item, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="text-sm font-semibold text-gray-900">{item.org}</span>
                  <span className="text-sm text-gray-600">{item.role}</span>
                  <span className="font-mono text-xs text-gray-400 sm:ml-auto">{item.period}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* skills */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
              Skills
            </h2>
            <div className="flex flex-col gap-6">
              {Object.entries(aboutContent.skills).map(([category, items]) => (
                <div key={category}>
                  <p className="font-mono text-xs text-gray-500 mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="border border-gray-200 px-3 py-1 text-xs text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* right: photo placeholder */}
        <div>
          <div className="bg-gray-100 border border-gray-200 aspect-[3/4] w-full flex items-end justify-center pb-4">
            <span className="font-mono text-xs text-gray-400">[Photo placeholder]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
