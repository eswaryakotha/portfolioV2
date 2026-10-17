import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import { caseStudies } from "@/data/content";

export default function DolbyLabsPage() {
  const study = caseStudies["dolby-labs"];
  return (
    <CaseStudyTemplate
      title="How might we help UGC authors confidently bring their stories to audio?"
      subtitle="Dolby Labs X Purdue [2023] | Independent [2026]"
      hideSidebar
      tagline="(Spoiler: Not the way Dolby originally thought)"
      study={study}
    />
  );
}
