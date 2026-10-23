import Link from "next/link";
import type { CaseStudy } from "@/data/content";
import SummaryGrid from "@/components/SummaryGrid";
import EquationAnnotation from "@/components/EquationAnnotation";
import MeetAllison from "@/components/MeetAllison";
import CurrentProcessFlow from "@/components/CurrentProcessFlow";
import DecorativeQuote from "@/components/DecorativeQuote";
import AiSolutionSection from "@/components/AiSolutionSection";
import MarketResearchTable from "@/components/MarketResearchTable";
import KeyFeaturesTable from "@/components/KeyFeaturesTable";
import WireframePanel from "@/components/WireframePanel";
import SolutionSection from "@/components/SolutionSection";
import EvaluationSection from "@/components/EvaluationSection";

export default function CaseStudyTemplate({ study }: { study: CaseStudy }) {
  const show = (key: keyof NonNullable<CaseStudy["showSections"]>) =>
    study.showSections?.[key] !== false;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/work"
        className="font-mono text-xs text-gray-500 hover:text-gray-900 uppercase tracking-widest"
      >
        ← Back to work
      </Link>

      {/* hero placeholder */}
      <div className="mt-8 bg-gray-100 w-full aspect-[21/9] border border-gray-200" />

      <div className={`mt-10 border-t border-gray-200 ${study.hideSidebar ? "" : "grid grid-cols-1 md:grid-cols-[220px_1fr] gap-0"}`}>
        {/* sidebar */}
        {!study.hideSidebar && (
          <aside className="border-r border-gray-200 pr-8 pt-8 pb-8">
            <dl className="flex flex-col gap-5">
              {[
                ["Company", study.company],
                ["Role", study.role],
                ["Timeline", study.timeline],
                ["Team", study.team],
                ["Tools", study.tools],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">
                    {label}
                  </dt>
                  <dd className="text-sm text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}

        {/* main content */}
        <article className={`${study.hideSidebar ? "" : "pl-0 md:pl-10"} pt-8 flex flex-col gap-10`}>
          <section>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{study.pageTitle}</h1>
            {study.subtitle && (
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">{study.subtitle}</p>
            )}
            {study.tagline && (
              <p className="text-sm text-gray-500 mt-2">{study.tagline}</p>
            )}
            {study.equationAnnotation && (
              <div className="mt-8">
                <EquationAnnotation content={study.equationAnnotation} />
              </div>
            )}
          </section>

          {show("overview") && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                Overview
              </h2>
              {study.overviewGrid ? (
                <SummaryGrid grid={study.overviewGrid} />
              ) : (
                <p className="text-sm text-gray-800 leading-relaxed">{study.overview}</p>
              )}
            </section>
          )}

          {show("problem") && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                Problem
              </h2>
              {study.problem && (
                <p className="text-sm text-gray-800 leading-relaxed">{study.problem}</p>
              )}
              {study.meetAllison && (
                <MeetAllison data={study.meetAllison} />
              )}
              {study.problemBlocks && (
                <div className="flex flex-col gap-8">
                  {study.problemBlocks.map((block) => (
                    <div key={block.label}>
                      <p className="font-mono text-xs tracking-widest text-gray-400 mb-2">
                        {block.label}
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">{block.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {study.currentProcessFlow && (
            <CurrentProcessFlow data={study.currentProcessFlow} />
          )}

          {study.aiSubsection && (
            <div style={{ marginTop: 32 }}>
              <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
                {study.aiSubsection.subLabel}
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {study.aiSubsection.bodyText}
              </p>
              <div style={{ marginTop: 32, marginBottom: 24 }}>
                <DecorativeQuote text={study.aiSubsection.quote} />
              </div>
              <p className="text-sm text-gray-800 leading-relaxed text-center">
                <strong className="font-semibold">{study.aiSubsection.concernsPrefix}</strong>
                {study.aiSubsection.concernsRest}
              </p>
            </div>
          )}

          {study.aiSolutionSubsection && (
            <AiSolutionSection data={study.aiSolutionSubsection} />
          )}

          {show("productStrategy") && (
            study.productStrategy ? (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Product Strategy and Insights
                </h2>
                <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
                  {study.productStrategy.subLabel}
                </p>
                <p className="text-sm text-gray-800 leading-relaxed mb-4">
                  <strong className="font-semibold">{study.productStrategy.introPrefix}</strong>
                  {study.productStrategy.introRest}
                </p>
                <MarketResearchTable
                  headers={study.productStrategy.tableHeaders}
                  rows={study.productStrategy.tableRows}
                  annotationLine1={study.productStrategy.annotationLine1}
                  annotationLine2={study.productStrategy.annotationLine2}
                />
                {study.productStrategy.keyFeatures && (
                  <KeyFeaturesTable data={study.productStrategy.keyFeatures} />
                )}
                {study.productStrategy.wireframes && (
                  <WireframePanel data={study.productStrategy.wireframes} />
                )}
              </section>
            ) : study.productStrategyBlocks ? (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Product Strategy and Insights
                </h2>
                <div className="flex flex-col gap-8">
                  {study.productStrategyBlocks.map((block) => (
                    <div key={block.label}>
                      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
                        {block.label}
                      </p>
                      {block.type === "table" ? (
                        <div className="border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[120px] p-8">
                          <p className="text-sm text-gray-400">{block.text}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 w-full aspect-video border border-gray-200 flex items-center justify-center">
                          <p className="text-sm text-gray-400">{block.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  My role
                </h2>
                <p className="text-sm text-gray-800 leading-relaxed">{study.myRole}</p>
              </section>
            )
          )}

          {show("solution") && (
            study.solutionSection ? (
              <SolutionSection data={study.solutionSection} />
            ) : study.solutionBlocks ? (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Solution
                </h2>
                <div className="flex flex-col gap-10">
                  {study.solutionBlocks.map((block) => (
                    <div key={block.label}>
                      <p className="font-mono text-xs tracking-widest text-gray-400 mb-3">
                        {block.label}
                      </p>
                      {(block.type === "video" || block.type === "diagram") && (
                        <div className="bg-gray-100 w-full aspect-video border border-gray-200 flex items-center justify-center">
                          <p className="text-sm text-gray-400">{block.text}</p>
                        </div>
                      )}
                      {block.type === "decision" && (
                        <div className="border border-gray-200 rounded overflow-hidden">
                          {["Decision", "Trade-off", "Reasoning", "Challenge"].map((row, i) => (
                            <div
                              key={row}
                              className={`flex gap-4 p-3 text-sm${i > 0 ? " border-t border-gray-200" : ""}`}
                            >
                              <span className="font-mono text-xs text-gray-400 w-24 shrink-0 mt-0.5">
                                {row}
                              </span>
                              <p className="text-gray-400">{block.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Solution
                </h2>
                <p className="text-sm text-gray-800 leading-relaxed">{study.solution}</p>
              </section>
            )
          )}

          {show("evaluation") && (
            study.evaluationSection ? (
              <EvaluationSection data={study.evaluationSection} />
            ) : study.evaluationText ? (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Evaluation and Observability
                </h2>
                <p className="text-sm text-gray-800 leading-relaxed">{study.evaluationText}</p>
              </section>
            ) : null
          )}

          {study.process && study.process.length > 0 && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                Process
              </h2>
              <ol className="flex flex-col gap-3">
                {study.process.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-800">
                    <span className="font-mono text-xs text-gray-400 mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {study.impact && study.impact.length > 0 && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                Impact / Results
              </h2>
              <ul className="flex flex-col gap-2">
                {study.impact.map((item, i) => (
                  <li key={i} className="text-sm text-gray-800 flex gap-2">
                    <span className="text-gray-300 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {show("learnings") && (study.learningItems || (study.learnings && study.learnings.length > 0)) && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                Learnings
              </h2>
              {study.learningItems ? (
                <ol className="flex flex-col gap-8">
                  {study.learningItems.map((item, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:gap-6">
                      <span className="font-mono text-xs text-gray-400 mb-1 sm:mb-0 sm:mt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <strong className="text-sm font-semibold text-gray-900 block mb-1">
                          {item.title}
                        </strong>
                        <p className="text-sm text-gray-800 leading-relaxed">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="flex flex-col gap-2">
                  {study.learnings!.map((item, i) => (
                    <li key={i} className="text-sm text-gray-800 flex gap-2">
                      <span className="text-gray-300 shrink-0">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
