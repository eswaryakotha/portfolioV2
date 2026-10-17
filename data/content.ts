export const siteContent = {
  name: "[Your Name]",
  role: "[Your one-line role, e.g. Product Manager · Building at the intersection of X and Y]",
  bio: [
    "[Your bio paragraph one. e.g. I'm a product manager with 5+ years of experience shipping 0→1 and growth-stage products.]",
    "[Your bio paragraph two. e.g. Previously at Company A and Company B. I care about clean systems, fast shipping, and outcomes over outputs.]",
    "[Your bio paragraph three — optional. Can include interests outside work.]",
  ],
  email: "[your@email.com]",
  linkedin: "[https://linkedin.com/in/yourhandle]",
  github: "[https://github.com/yourhandle]",
  copyright: `© ${new Date().getFullYear()} [Your Name]. All rights reserved.`,
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  slug: string | null; // null = coming soon
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "dolby-labs",
    title: "Dolby Labs",
    summary: "[One-line summary of what you built and its impact]",
    role: "[Your Role]",
    year: "[Year]",
    slug: "dolby-labs",
    tags: ["[Role]", "[Year]", "[Domain, e.g. B2B SaaS]"],
  },
  {
    id: "project-two",
    title: "Project Two",
    summary: "[Coming soon — placeholder for second case study]",
    role: "[Your Role]",
    year: "[Year]",
    slug: null,
    tags: ["[Role]", "[Year]"],
  },
  {
    id: "project-three",
    title: "Project Three",
    summary: "[Coming soon — placeholder for third case study]",
    role: "[Your Role]",
    year: "[Year]",
    slug: null,
    tags: ["[Role]", "[Year]"],
  },
];

export type EquationAnnotationContent = {
  textUGC: string;
  textMiddle: string;
  textExploration: string;
  labelUmWho: string;
  labelNotVillain: string;
  captionLine1: string;
  captionLine2: string;
};

export type ProblemItem = {
  headline: string;
  body: string;
  insertion?: {
    word: string;   // e.g. "very"
    after: string;  // insert after this word, e.g. "is"
    color: string;  // e.g. "#E07B39"
  };
};

export type SummaryGridData = {
  problem: Array<ProblemItem>;
  solution: { strikethrough?: string; intro: string; items: string[]; closing?: string };
  users: string;
  results: Array<{ year: string; label: string; body: string; boldPhrases?: string[] }>;
};

export type ColIcon = { name: string; label?: string; size?: number };

export type AiSubsectionData = {
  subLabel: string;
  bodyText: string;
  quote: string;
  concernsPrefix: string;
  concernsRest: string;
};

export type ProductTableRow = {
  tool: string;
  coreFeature: string;
  useInProduction: string;
};

export type ProductStrategyData = {
  subLabel: string;
  introPrefix: string;
  introRest: string;
  tableHeaders: string[];
  tableRows: ProductTableRow[];
  annotationLine1: string;
  annotationLine2: string;
};

export type WorkflowStep = { label: string; icon: string };

export type AiSolutionSubsectionData = {
  subLabel: string;
  leadBefore: string;
  leadBold: string;
  leadAfter: string;
  introLine: string;
  steps: WorkflowStep[];
  closingPrefix: string;
  closingRest: string;
};

export type ProcessStep = { id: string; label: string };
export type CurrentProcessFlowData = { steps: ProcessStep[] };

export type MeetAllisonData = {
  imageBaseName: string; // base name without extension, e.g. "allison" — tries .png .webp .jpg .svg
  caption: string;
  col2: { text: string; icons: ColIcon[] };
  col3: { text: string; icons: ColIcon[] };
  speechBubble: string;
};

export type CaseStudy = {
  company: string;
  role: string;
  timeline: string;
  team: string;
  tools: string;
  equationAnnotation?: EquationAnnotationContent;
  overviewGrid?: SummaryGridData;
  meetAllison?: MeetAllisonData;
  currentProcessFlow?: CurrentProcessFlowData;
  aiSubsection?: AiSubsectionData;
  aiSolutionSubsection?: AiSolutionSubsectionData;
  productStrategy?: ProductStrategyData;
  overview: string;
  problem: string;
  myRole: string;
  process: string[];
  solution: string;
  impact: string[];
  learnings: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  "dolby-labs": {
    company: "Dolby Laboratories",
    role: "[Your Title, e.g. Senior Product Manager]",
    timeline: "[e.g. Jan 2022 – Dec 2023]",
    team: "[e.g. 3 engineers, 1 designer, 1 data scientist]",
    tools: "[e.g. Figma, JIRA, Mixpanel, Amplitude]",
    equationAnnotation: {
      textUGC: "UGC audiobook creators",
      textMiddle: "+ AI -> Audiobooks?",
      textExploration: "An exploration",
      labelUmWho: "Um, who?",
      labelNotVillain: "Not a villain this time! :)",
      captionLine1: "UGC (User-Generated Content) creators who",
      captionLine2: "write books and want to make audiobooks",
    },
    overviewGrid: {
      problem: [
        {
          headline: "Audiobook production is hard",
          body: "Audiobooks are one of the fastest growing media formats, but their creation is time-consuming, expensive and inaccessible for independent novice authors.",
          insertion: { word: "very", after: "is", color: "#E07B39" },
        },
        {
          headline: "Authors don't know where to start",
          body: "Independent book authors are gaining visibility through UGC platforms (BookTok/TikTok, Wattpad, Instagram), but face major challenges in converting their written works into accessible, high-quality audio formats.",
        },
      ],
      solution: {
        strikethrough: "AI voice generation tool",
        intro: "An AI-assisted audiobook creation tool that helps authors to:",
        items: [
          "Annotate scripts",
          "Guide narration",
          "Fix recording mistakes",
          "Enhance audio",
        ],
        closing: "while preserving their creative control.",
      },
      users:
        "Independent authors wanting to convert their written works into audiobooks.",
      results: [
        {
          year: "2023",
          label: "User research",
          body: "Users highlighted that the new workflow could reduce the time spent learning tools and setting up by at least 10 hours per project.",
          boldPhrases: ["at least 10 hours per project."],
        },
        {
          year: "2026",
          label: "AI evaluation",
          body: "Built an AI audiobook narration tool and evaluated it against an 18-case test suite across three runs per case, increasing the share of cases passing every run from 20% to 50%.",
          boldPhrases: ["20% to 50%"],
        },
      ],
    },
    meetAllison: {
      imageBaseName: "allison",
      caption: "Writer and content creator",
      col2: {
        text: "She wants to turn her written stories into high-quality audiobooks and reach listeners on platforms like Audible.",
        icons: [
          { name: "BookOpen" },
          { name: "ArrowRight", size: 16 },
          { name: "Headphones" },
        ],
      },
      col3: {
        text: "But where does she start? Recording. Editing. Production. Too many tools to learn.",
        icons: [
          { name: "Mic", label: "Recording" },
          { name: "Scissors", label: "Editing" },
          { name: "Layers", label: "Production" },
        ],
      },
      speechBubble: "Why does it take so many apps just to make an audiobook?",
    },
    aiSubsection: {
      subLabel: "02. So, should AI do the talking?",
      bodyText: "Dolby Labs’ initial brief was to explore AI voice generation for narrating audiobooks. But stakeholder conversations surfaced a different concern:",
      quote: "Why is AI chasing after our artistic careers?",
      concernsPrefix: "The concerns:",
      concernsRest: " Voice ownership. Human expression. Artistic integrity.",
    },
    productStrategy: {
      subLabel: "01. Market Research",
      introPrefix: "Key features observed:",
      introRest: " Audio Enhancement, Audio/Speech to text, General Audio Editor, Audio Restoration, AI-Generated Sounds",
      tableHeaders: ["Tools", "Core Feature", "Use in Production"],
      tableRows: [
        { tool: "Adobe Podcast (Beta)", coreFeature: "Audio Enhancement (noise reduction, voice clarity)", useInProduction: "Clean recordings and improve narrator audio quality" },
        { tool: "AlteredAI", coreFeature: "AI-Generated Sounds (voice transformation and generation)", useInProduction: "Prototype or experiment with different narration voices" },
        { tool: "MyEdit", coreFeature: "General Audio Editor & Proofing (cleaning up recordings)", useInProduction: "Refine recordings and ensure clarity for publishing" },
        { tool: "Auphonic", coreFeature: "Audio Restoration & Leveling (automatic mastering, noise reduction)", useInProduction: "Balance audio levels and finalize polished tracks" },
        { tool: "Descript", coreFeature: "Audio/Speech-to-Text & Editing (transcription + text-based edits)", useInProduction: "Edit narration quickly and correct mistakes efficiently" },
      ],
      annotationLine1: "Biggest design influences",
      annotationLine2: "Descript and Auphonic shaped our design choices more than any other AI tool we analyzed.",
    },
    aiSolutionSubsection: {
      subLabel: "03. Now, what if AI supported the creator instead?",
      leadBefore: "AI shouldn’t replace the creator. It should ",
      leadBold: "support them",
      leadAfter: ".",
      introLine: "An AI-assisted audiobook workflow that helps authors:",
      steps: [
        { label: "Annotate scripts", icon: "NotebookPen" },
        { label: "Guide narration", icon: "AudioLines" },
        { label: "Improve recordings", icon: "AudioWaveform" },
      ],
      closingPrefix: "The goal:",
      closingRest: " Make audiobook production easier while helping authors keep in control.",
    },
    currentProcessFlow: {
      steps: [
        { id: "01", label: "Prepare" },
        { id: "02", label: "Narrate" },
        { id: "03", label: "Edit & Proof" },
        { id: "04", label: "Master & Validate" },
        { id: "05", label: "Publish" },
      ],
    },
    overview:
      "[2–3 sentences describing the product and the work you did. What was it, who was it for, and what was the business context?]",
    problem: "",
    myRole:
      "[Describe your specific responsibilities. Were you the sole PM? Did you own discovery, delivery, or both? What decisions were yours to make?]",
    process: [
      "[Process step 1 — e.g. Ran 20 user interviews to map the current workflow and identify friction points]",
      "[Process step 2 — e.g. Synthesized findings into an opportunity map and prioritized with the team]",
      "[Process step 3 — e.g. Ran two discovery sprints to test assumptions before committing to a solution]",
      "[Process step 4 — e.g. Shipped an MVP in 6 weeks, then iterated based on usage data]",
    ],
    solution:
      "[Describe what you shipped. What does it do? How does it address the problem you defined?]",
    impact: [
      "[Impact metric 1 — e.g. Reduced onboarding time from 14 days to 3 days]",
      "[Impact metric 2 — e.g. Increased feature adoption by 40% in 60 days post-launch]",
      "[Impact metric 3 — e.g. $2M ARR attributed to the new capability in first year]",
    ],
    learnings: [
      "[Learning 1 — e.g. Shipping earlier surfaced assumptions we had held for months]",
      "[Learning 2 — e.g. Alignment with the sales team was the hidden critical path]",
      "[Learning 3 — optional — e.g. I'd invest more time in a North Star metric earlier]",
    ],
  },
};

export const aboutContent = {
  headline: "[Your Name] — [Your Role]",
  bio: [
    "[Bio paragraph one. Start with where you are now: what you do, where, and what you care about in your work.]",
    "[Bio paragraph two. Background: where you've been, what shaped your perspective, what problems you love working on.]",
    "[Bio paragraph three. Outside of work: a few genuine interests that make you a rounded person.]",
  ],
  background: [
    { org: "[Company or School 1]", role: "[Role]", period: "[Dates]" },
    { org: "[Company or School 2]", role: "[Role]", period: "[Dates]" },
    { org: "[Company or School 3]", role: "[Role]", period: "[Dates]" },
  ],
  skills: {
    "Product craft": [
      "Discovery & research",
      "Roadmapping",
      "Spec writing",
      "Metrics & analytics",
      "[Add your own]",
    ],
    "Working style": [
      "Cross-functional collaboration",
      "Stakeholder alignment",
      "Workshop facilitation",
      "[Add your own]",
    ],
    "Tools & tech": [
      "Figma",
      "JIRA / Linear",
      "SQL",
      "Amplitude / Mixpanel",
      "[Add your own]",
    ],
  },
};
