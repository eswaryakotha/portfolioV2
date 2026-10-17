const placeholders = [
  { title: "[Side project 1]", description: "[What it is and why you built it]", tags: ["[tag]"] },
  { title: "[Side project 2]", description: "[What it is and why you built it]", tags: ["[tag]"] },
  { title: "[Experiment 1]", description: "[Brief description]", tags: ["[tag]"] },
  { title: "[Experiment 2]", description: "[Brief description]", tags: ["[tag]"] },
  { title: "[Writing / essay]", description: "[Topic]", tags: ["writing"] },
  { title: "[Other thing]", description: "[Brief description]", tags: ["[tag]"] },
];

export default function PlayPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="border-b border-gray-200 pb-8 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Play</p>
        <h1 className="text-2xl font-semibold text-gray-900">Side projects & experiments</h1>
        <p className="text-sm text-gray-500 mt-2">
          Things I build outside of work — for fun, learning, or both.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-gray-200">
        {placeholders.map((item, i) => (
          <div key={i} className="bg-[#f9f9f7] border-0 p-5 flex flex-col gap-2">
            <div className="bg-gray-100 w-full aspect-video mb-2" />
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              {item.tags.join(" · ")}
            </p>
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
