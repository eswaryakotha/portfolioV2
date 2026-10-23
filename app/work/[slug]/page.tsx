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
    title: study.pageTitle,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) notFound();
  return <CaseStudyTemplate study={study} />;
}
