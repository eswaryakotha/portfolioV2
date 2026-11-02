import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies } from "@/data/content";
import CaseStudyTemplate from "@/components/CaseStudyTemplate";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) return {};
  return {
    title: study.metaTitle ?? study.pageTitle,
    description: study.metaDescription ?? study.summary,
  };
}

// The page itself does not read `params`; the child below does, inside <Suspense>,
// so navigating into a case study can show the page shell straight away.
export default function CaseStudyPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-6 py-12" />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}

async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) notFound();
  return <CaseStudyTemplate study={study} />;
}
