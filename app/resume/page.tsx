export default function ResumePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="border-b border-gray-200 pb-8 mb-10 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Resume</p>
          <h1 className="text-2xl font-semibold text-gray-900">Resume</h1>
        </div>
        <a
          href="/resume.pdf"
          download
          className="font-mono text-xs uppercase tracking-widest border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Download PDF ↓
        </a>
      </div>

      <div className="border border-gray-200 w-full">
        <iframe
          src="/resume.pdf"
          className="w-full"
          style={{ height: "80vh" }}
          title="Resume PDF"
        />
      </div>

      <p className="font-mono text-xs text-gray-400 mt-4 text-center">
        If the viewer doesn&apos;t load,{" "}
        <a href="/resume.pdf" className="underline hover:text-gray-700" download>
          download the PDF directly
        </a>
        .
      </p>
    </div>
  );
}
