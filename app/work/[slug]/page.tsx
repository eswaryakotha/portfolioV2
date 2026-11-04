import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { book, caseStudies, type CaseStudy } from "@/data/content";
import { veraai } from "@/data/veraai.server";
import { isProtected, isUnlocked } from "@/lib/caseStudyAccess";
import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import PasswordGate from "@/components/PasswordGate";

/** Every case study, including the password-protected ones kept in server-only modules. */
const allCaseStudies: Record<string, CaseStudy> = { ...caseStudies, veraai };

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(allCaseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = allCaseStudies[slug];
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
  const study = allCaseStudies[slug];
  if (!study) notFound();
  // a protected study is only rendered (and so only sent) once its password has been entered
  if (isProtected(slug) && !(await isUnlocked(slug))) {
    const name = book.spreads.find((s) => s.type === "case-study" && s.slug === slug)?.name ?? slug;
    return <PasswordGate slug={slug} name={name} />;
  }
  return <CaseStudyTemplate study={study} slug={slug} />;
}
