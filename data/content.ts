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

export const ACCENTS = {
  dolby: "#E07B39",
  veraai: "#081A4A",
} as const;

// Brighter companion used for hand-drawn annotations; falls back to the accent.
export const ACCENTS_BRIGHT: Record<string, string> = {
  veraai: "#2F6BFF",
};

export type Project = {
  id: string;
  accent: string;
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
    accent: ACCENTS.dolby,
    title: "Dolby Labs",
    summary: "[One-line summary of what you built and its impact]",
    role: "[Your Role]",
    year: "[Year]",
    slug: "dolby-labs",
    tags: ["[Role]", "[Year]", "[Domain, e.g. B2B SaaS]"],
  },
  {
    id: "veraai",
    accent: ACCENTS.veraai,
    title: "VeraAI",
    summary: "[Add one-line summary]",
    role: "[Your Role]",
    year: "[Year]",
    slug: "veraai",
    tags: ["[Role]", "[Year]"],
  },
  {
    id: "metamint",
    accent: ACCENTS.dolby,
    title: "MetaMint",
    summary: "[Add one-line summary]",
    role: "[Your Role]",
    year: "[Year]",
    slug: "metamint",
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
  // numbered points, or a single paragraph
  problem: Array<ProblemItem> | string;
  solution: {
    label?: string; // box label, default "Solution"
    strikethrough?: string;
    intro: string;
    note?: { heading: string; body: string }; // margin note under the Results box
    squigglePhrase?: string; // phrase inside intro to underline with a hand-drawn squiggle
    items?: string[];
    closing?: string;
  };
  users: string;
  hideUsersIcons?: boolean;
  // year-labeled items, or plain bullets (**bold** markers supported)
  results: Array<{ year: string; label: string; body: string; boldPhrases?: string[] }> | string[];
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

export type CalloutTarget = { x: number; y: number; w: number; h: number }; // % of image

export type AnnotatedCallout = {
  text: string;
  side: "left" | "right" | "top" | "bottom";
  target: CalloutTarget;
};

export type ScreenHeader = {
  jtbd?: string;  // e.g. "JTBD #1" — shown in monospace orange above the title
  title: string;
};

export type AnnotatedScreenData = {
  image: string; // path from /public/, e.g. "/wireframes/Dolby_SB6.png"
  alt: string;
  header?: ScreenHeader;
  callouts: AnnotatedCallout[];
};

export type WireframesData = {
  subLabel: string;
  screens: AnnotatedScreenData[];
};

export type JtbdRow = {
  marker: string;
  jtbd: string;
  feature: string;
};

export type KeyFeaturesData = {
  subLabel: string;
  introLine: string;
  headers: [string, string];
  rows: JtbdRow[];
};

export type ProductStrategyData = {
  subLabel: string;
  introPrefix: string;
  introRest: string;
  tableHeaders: string[];
  tableRows: ProductTableRow[];
  annotationLine1: string;
  annotationLine2: string;
  keyFeatures?: KeyFeaturesData;
  wireframes?: WireframesData;
};

export type WorkflowStep = { label: string; icon: string };

export type SolutionTechCard = {
  name: string;
  description: string;
  isAI?: boolean;
};

export type DiagramStep = {
  number: number;
  title: string;
  description: string;
  cards: SolutionTechCard[];
};

export type SolutionInsightCard = { title: string; body: string };

export type EngineeringDecisionData = {
  subLabel: string;
  headline: string;
  decision: { label: string; body: string };
  tradeoff: { label: string; items: string[]; closing: string };
  reasoning: {
    label: string;
    phrase1: string;
    phrase2: string;
    ariaDescription: string;
  };
  challenge: { label: string; body: string };
  whatWasBuilt: {
    label: string;
    boxes: Array<{ heading: string; body: string }>;
  };
  whatImproved: {
    label: string;
    caption: string;
    before: { count: number; total: number; rowLabel?: string };
    after: { count: number; total: number; rowLabel?: string };
    annotation: string;
    ariaLabel: string;
  };
};

export type SolutionData = {
  sectionLabel: string;
  part1: { subLabel: string; videoUrl?: string; videoPoster?: string };
  part2: {
    subLabel: string;
    introLine: string;
    steps: DiagramStep[];
    underTheHoodTitle: string;
    underTheHoodSubtitle: string;
    legendLabel: string;
    showMoreLabel: string;
    showLessLabel: string;
    whatSetsApart: { title: string; subtitle: string; cards: SolutionInsightCard[] };
    aroundTheBuild: { title: string; subtitle: string; cards: SolutionInsightCard[] };
  };
  part3: EngineeringDecisionData;
};

// ── Evaluation & Observability ────────────────────────────────

export type EvaluationRunData = {
  run: string;
  cases: number;
  passed: number;
  flaky: number;
  failed: number;
  validFirst: { count: number; total: number };
  changed: string;
  sharedPassed?: number;
  hasFootnote?: boolean;
};

export type EvaluationData = {
  sectionLabel: string;
  // 01
  label01: string;
  stats: Array<{ value: string; label: string }>;
  intro: string;
  caseGroups: Array<{ label: string; count: number }>;
  checkCards: Array<{ title: string; body: string }>;
  bookNote: string;
  // 02
  label02: string;
  statusCards: Array<{ status: "PASS" | "FLAKY" | "FAIL"; runs: boolean[]; description: string }>;
  flakyNote: string;
  // 04
  label04: string;
  modelCallsRows: Array<{ case: string; calls: number; isTotal?: boolean }>;
  runs: EvaluationRunData[];
  footnote: string;
  legendPass: string;
  legendFlaky: string;
  legendFail: string;
  // 05
  label05: string;
  failingGroupLabel: string;
  failingCards: Array<{ title: string; detail: string; important?: boolean }>;
  importantNote: string;
  authorNote: string;
  flakyGroupLabel: string;
  flakyDetailCards: Array<{ title: string; detail: string }>;
  // 06
  label06: string;
  limits: string[];
};

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

export type ProcessFlowchartData = {
  note?: string; // smaller handwritten note beside the "Current process" label
  steps: string[][]; // main row; each box is a list of paragraphs
  loop: { from: number; to: number }; // 0-based: arrow from the top of `from` back into the top of `to`
  branch: { text: string; rejoin: number }; // box under `loop.from`; elbow arrow into the left of box `rejoin`
};

export type MatrixStatus = "yes" | "partial" | "no";

export type ToolsAnalysisData = {
  subLabel: string;
  intro: string;
  tableHeaders: string[];
  tableRows: Array<{ tool: string; purpose: string; description: string }>;
  leadIns: string[];
  matrix: {
    caption: string; // visually hidden
    columns: string[];
    rows: Array<{ feature: string; cells: Array<{ status: MatrixStatus; note?: string }> }>;
  };
  stats: Array<{ value: string; text: string; source?: string }>; // source: shown only if filled in
  closing: string;
};

export type ProductJobsData = {
  subLabel: string;
  paragraph: string;
  leadIn: string;
  jobs: Array<{ icon: string; text: string }>; // icon = Lucide icon name
  closing: { bold: string; rest: string };
};

export type PersonaData = {
  subLabel: string;
  intro: string;
  segments: Array<{ name: string; text: string }>; // name is shown bold, followed by ":"
  personas: Array<{
    role: string;
    name: string;
    avatar: { src: string; alt: string; width: number; height: number; blend?: boolean };
  }>;
  rows: Array<{ label: string; cells: Array<string | string[]> }>; // string[] = bullet list
  opportunities: {
    leadIn: string;
    cards: Array<{ title: string; items: string[] }>;
  };
  focusIndex: number; // persona / opportunity card to highlight (0-based)
  focusNote: string; // handwritten annotation pointing at that card
  closing: string;
};

export type FeaturesMvpData = {
  subLabel: string;
  intro: string;
  headers: [string, string, string];
  rows: Array<{ marker: string; jtbd: string; feature: string; mvp: string }>; // empty mvp shows a gray hyphen
};

export type LevelValue = "Low" | "Medium" | "High";
export type PriorityLevel = "Must-Have" | "Should-Have" | "Could-Have" | "Won’t-Have";

export type FeaturePriorityData = {
  subLabel: string;
  headers: [string, string, string, string, string];
  rows: Array<{
    feature: string;
    impact: LevelValue;
    effort: LevelValue;
    priority: PriorityLevel;
    notes: string; // empty shows a gray hyphen
  }>;
};

export type PivotsData = {
  heading: string;
  note: string; // handwritten annotation beside the current pivot
  pivots: Array<{
    label: string;
    title: string;
    body: string;
    calloutLabel: string;
    calloutText: string;
    status: "dropped" | "current";
    statusLabel: string;
    icon: string; // Lucide icon name
  }>;
  closing: string;
};

export type PilotData = {
  heading: string;
  videoUrl: string; // empty = placeholder; .mp4 path = <video>; YouTube / Vimeo / Loom link = iframe
  poster: string;
  intro: string;
  stats: Array<{ value: string; label: string }>;
  cards: Array<{ icon: string; title: string; text: string }>; // icon = Lucide icon name
};

export type WebsiteData = {
  heading: string;
  intro: string;
  first: {
    subLabel: string;
    videoUrl: string; // empty = placeholder; .mp4 path = <video>; YouTube / Vimeo / Loom link = iframe
    poster: string;
    placeholderLabel: string;
    caption: string;
    tags: string[];
  };
  communicating: {
    subLabel: string;
    // src is a path under /public; a missing file shows the dashed placeholder
    blocks: Array<{ src: string; alt: string; width?: number; height?: number; placeholderLabel: string; caption: string }>;
  };
  contribution: { label: string; text: string };
};

export type WhatsNextData = {
  heading: string;
  cards: Array<{ icon: string; label: string; text: string; tags?: string[] }>; // icon = Lucide icon name
};

export type StripImage = { src: string; alt: string; width: number; height: number; blend?: boolean };

// One bordered column next to the person: icons, an image, or (neither) an
// "[illustration]" placeholder, with the text centered at the bottom.
export type StripColumn = {
  text: string;
  icons?: ColIcon[];
  iconsGap?: number;
  iconsAlign?: "center" | "flex-start";
  textMarginBottom?: number;
  image?: StripImage;
  icon?: ColIcon; // shown in place of an image/placeholder (decorative)
  iconLead?: { name?: string; color: string; size?: number }; // mark to the left of the icon (default "Check")
  iconCaption?: string; // bold line under the icon, e.g. an amount
  iconOffsetY?: number; // nudge the icon group vertically in px (positive = down)
  textOffsetY?: number; // nudge the text vertically in px (negative = up)
  badge?: string; // handwritten note at the top right of the box, e.g. "X3"
  box?: boolean; // default true
};

export type StoryStripData = {
  flowchart?: ProcessFlowchartData; // shown directly under the quote
  layout?: "steps"; // numbered N-up row with arrows; omitted = original 3-up
  subLabel: string;
  ariaDescription?: string;
  ariaLabel?: string;
  person: {
    name: string;
    label: string; // handwritten label above the drawing
    caption: string;
    arrow?: boolean; // small curved arrow from the label to the drawing
    alt: string;
    imageBaseName?: string; // looked up in /public/comic (.png .webp .jpg .svg)
    image?: Omit<StripImage, "alt">; // or an explicit image (alt comes from `alt` above)
  };
  columns: StripColumn[];
  afterFlowchartText?: string; // paragraph after the flowchart
  afterFlowchartQuote?: string; // decorative quote after that paragraph (no quotation characters)
  closingText?: string; // paragraph after the quote
  quote?: string; // no quotation characters; the decorative marks are added by the component
};

export type CaseStudy = {
  // Page-level meta (replaces per-page props)
  pageTitle: string;
  subtitle?: string;
  tagline?: string; // optional line under the label; omitted = not rendered
  metaTitle?: string;
  metaDescription?: string;
  accent: string;
  accentBright?: string;
  hookImage?: { src: string; alt: string; width: number; height: number };
  hideSidebar?: boolean;
  summary?: string;
  // Sidebar metadata
  company: string;
  role: string;
  timeline: string;
  team: string;
  tools: string;
  // Rich section components
  equationAnnotation?: EquationAnnotationContent;
  overviewGrid?: SummaryGridData;
  storyStrip?: StoryStripData;
  toolsAnalysis?: ToolsAnalysisData;
  productJobs?: ProductJobsData;
  personas?: PersonaData;
  featuresMvp?: FeaturesMvpData;
  featurePriority?: FeaturePriorityData;
  pivots?: PivotsData;
  pilot?: PilotData;
  website?: WebsiteData;
  whatsNext?: WhatsNextData;
  currentProcessFlow?: CurrentProcessFlowData;
  aiSubsection?: AiSubsectionData;
  aiSolutionSubsection?: AiSolutionSubsectionData;
  productStrategy?: ProductStrategyData;
  solutionSection?: SolutionData;
  evaluationSection?: EvaluationData;
  // Fallback text fields
  overview: string;
  problem: string;
  myRole: string;
  solution: string;
  // Placeholder section blocks (for new pages)
  problemBlocks?: Array<{ label: string; text: string }>;
  productStrategyBlocks?: Array<{ label: string; type: "table" | "screens"; text: string }>;
  solutionBlocks?: Array<{ label: string; type: "video" | "diagram" | "decision"; text: string }>;
  evaluationText?: string;
  // Legacy optional
  process?: string[];
  impact?: string[];
  // Learnings
  learnings?: string[];
  learningsHeading?: string; // section label; default "Learnings"
  learningItems?: Array<{ title: string; body: string }>;
  // Per-section visibility (default: all visible)
  showSections?: Partial<Record<
    "overview" | "problem" | "productStrategy" | "solution" | "evaluation" | "learnings",
    boolean
  >>;
};

export const caseStudies: Record<string, CaseStudy> = {
  "dolby-labs": {
    pageTitle: "How might we help UGC authors confidently bring their stories to audio?",
    subtitle: "Dolby Labs X Purdue [2023] | Independent [2026]",
    tagline: "(Spoiler: Not the way Dolby originally thought)",
    accent: ACCENTS.dolby,
    hideSidebar: true,
    summary: "[One-line summary of what you built and its impact]",
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
          insertion: { word: "very", after: "is", color: "var(--accent)" },
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
          body: "Built an AI audiobook narration tool with an 18-case test suite (three runs per case). Cases passing every run rose from 20% to 53% on the same 15 cases.",
          boldPhrases: ["20% to 53%"],
        },
        {
          year: "",
          label: "AI reliability",
          body: "Fixed AI answers the app could not use. On six real book excerpts, answers that worked on the first try, without a retry, rose from 50% to 100% after a prompt fix.",
          boldPhrases: ["50% to 100%"],
        },
      ],
    },
    storyStrip: {
      subLabel: "01. Making an audiobook",
      person: {
        name: "Allison",
        label: "Meet Allison!",
        caption: "Writer and content creator",
        alt: "Allison — writer and content creator",
        imageBaseName: "allison",
      },
      columns: [
        {
          text: "She wants to turn her written stories into high-quality audiobooks and reach listeners on platforms like Audible.",
          icons: [
            { name: "BookOpen" },
            { name: "ArrowRight", size: 16 },
            { name: "Headphones" },
          ],
        },
        {
          text: "But where does she start? Recording. Editing. Production. Too many tools to learn.",
          icons: [
            { name: "Mic", label: "Recording" },
            { name: "Scissors", label: "Editing" },
            { name: "Layers", label: "Production" },
          ],
          iconsGap: 20,
          iconsAlign: "flex-start",
          textMarginBottom: 16,
        },
      ],
      quote: "Why does it take so many apps just to make an audiobook?",
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
      wireframes: {
        subLabel: "03. Wireframes",
        screens: [
          {
            image: "/wireframes/Dolby_SB6.png",
            alt: "AI Annotation Guide screen: chapter list on the left, script text in the center with an orange-highlighted phrase and dotted-underlined word, and an AI Recommendations panel on the right showing Pronunciation Struggle, Character Entry, Tone & Emotion, and Narrator's Guide cards.",
            header: { jtbd: "JTBD #1", title: "AI Annotation Guide" },
            callouts: [],
          },
          {
            image: "/wireframes/Dolby_R1.png",
            alt: "Recording Status screen: chapter list with completion indicators on the left, script text in the center, empty right panel, and a playback toolbar at the bottom with Record and Review buttons.",
            header: { title: "Voice Recording" },
            callouts: [],
          },
          {
            image: "/wireframes/Dolby_R6.png",
            alt: "Tracking screen: chapter list on the left, script text in the center, a Tone & Emotion card in the right panel, and a waveform timeline at the bottom with color-coded issue markers.",
            header: { jtbd: "JTBD 2", title: "Teleprompter-Guided Audiobook Recording" },
            callouts: [],
          },
          {
            image: "/wireframes/Dolby_S1.png",
            alt: "Vocal Studio screen: multi-track audio editor with a waveform timeline showing color-coded issue highlights, and a right panel with Enhancements and Insights sections listing detected delivery and script deviation errors.",
            header: { jtbd: "JTBD 3 and 4", title: "A Punch and Roll Narration and AI Vocal Studio" },
            callouts: [],
          },
        ],
      },
      annotationLine1: "Biggest design influences",
      annotationLine2: "Descript and Auphonic shaped our design choices more than any other AI tool we analyzed.",
      keyFeatures: {
        subLabel: "02. Key Features",
        introLine: "Drawing from the workflow of professional audiobook narrators, these are the features a UGC audiobook creator would need to easily produce high-quality audiobooks:",
        headers: ["JTBD", "Feature"],
        rows: [
          {
            marker: "#1",
            jtbd: "- When preparing to narrate a new audiobook, I want to create and organize detailed character and narration notes so I can stay consistent and confidently experiment with suggested interpretations before recording.",
            feature: "AI Annotation Guide [voice, expressions, nuances, pronunciation, tone, and pacing]",
          },
          {
            marker: "#2",
            jtbd: "- When narrating the audiobook line by line, I want to view my character and performance notes alongside the script while recording and replaying takes.",
            feature: "Teleprompter-guided audiobook recording",
          },
          {
            marker: "#3",
            jtbd: "- When recording narration, I want to quickly spot mistakes or weak performances and re-record only the affected lines, so I can improve quality efficiently.",
            feature: "Punch & roll narration",
          },
          {
            marker: "#4",
            jtbd: "- When producing an audiobook without a professional studio, I want my recordings to sound studio-quality automatically, so I can meet professional standards without expensive equipment.",
            feature: "AI Vocal Studio",
          },
        ],
      },
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
    solutionSection: {
      sectionLabel: "SOLUTION: BUILDING THE AI PROTOTYPE",
      part1: {
        subLabel: "01. See it in action",
        videoUrl: "",
        videoPoster: "",
      },
      part2: {
        subLabel: "02. How the AI workflow works",
        introLine: "Every step the author goes through, with what it is built with underneath. The AI suggests, the author decides.",
        steps: [
          {
            number: 1,
            title: "Upload",
            description: "PDF, Word or text file, or the sample chapter",
            cards: [
              { name: "pdfjs-dist, mammoth", description: "Read PDF and Word files. Plain text works too." },
              { name: "Own text parser", description: "Cleans text, splits chapters and sentences." },
            ],
          },
          {
            number: 2,
            title: "Analyse",
            description: "Claude suggests mood, characters and parts",
            cards: [
              { name: "Anthropic API", description: "claude-sonnet-5-5 reads the chapter.", isAI: true },
              { name: "Validator and fallback", description: "Up to 2 attempts, repairs, then a basic reading." },
              { name: "Answer cache", description: "In memory, with rate limits." },
            ],
          },
          {
            number: 3,
            title: "Decide",
            description: "Author edits direction and parts, and locks parts",
            cards: [
              { name: "Next.js 16, React 19", description: "App screens and API routes." },
              { name: "TypeScript, Tailwind 4", description: "Code and styling." },
            ],
          },
          {
            number: 4,
            title: "Coach",
            description: "Line tips on delivery, pauses, pronunciation, voice",
            cards: [
              { name: "Anthropic API", description: "Same model gives 2 to 3 tips per line.", isAI: true },
              { name: "Refresh and update", description: "Re-asks when the model skips parts." },
            ],
          },
          {
            number: 5,
            title: "Hear",
            description: "Example read aloud, one voice per character",
            cards: [
              { name: "Anthropic API", description: "Labels who speaks each line. Falls back to a guess.", isAI: true },
              { name: "OpenAI TTS", description: "gpt-4o-mini-tts, voice coral, American English.", isAI: true },
            ],
          },
          {
            number: 6,
            title: "Record",
            description: "Teleprompter, line notes, optional voice following",
            cards: [
              { name: "Web Speech API", description: "Optional voice following in the browser." },
              { name: "IndexedDB", description: "Takes stay in the browser. Nothing uploaded." },
            ],
          },
          {
            number: 7,
            title: "Polish",
            description: "Studio sound, punch-in re-records, undo",
            cards: [
              { name: "RNNoise (WASM)", description: "Noise removal for Studio sound." },
              { name: "Own audio chain", description: "Gate, EQ, compression, loudness." },
              { name: "Auto splice", description: "Punch-in from line marks and pauses, with undo." },
            ],
          },
        ],
        underTheHoodTitle: "UNDER THE HOOD",
        underTheHoodSubtitle: "What each step is built with",
        legendLabel: "Calls an outside AI service",
        showMoreLabel: "Show more details",
        showLessLabel: "Show less",
        whatSetsApart: {
          title: "WHAT SETS IT APART",
          subtitle: "Product and engineering choices",
          cards: [
            {
              title: "Author stays in control",
              body: "Authors edit mood and parts, and lock a part so a refresh never overwrites it. 3 eval cases test this.",
            },
            {
              title: "Punch-in re-records",
              body: "Re-record from line marks and pauses, with a lead-in, automatic splice and undo.",
            },
            {
              title: "Evaluation in four categories",
              body: "Emotional ambiguity, beginner coaching, author override, output reliability. Includes real-text cases.",
            },
          ],
        },
        aroundTheBuild: {
          title: "AROUND THE BUILD",
          subtitle: "Data, guardrails and checks",
          cards: [
            {
              title: "Where data goes",
              body: "Scripts go to Anthropic and example text to OpenAI. Audio takes stay in the browser.",
            },
            {
              title: "Server guardrails",
              body: "In-memory rate limits and an answer cache on the API routes.",
            },
            {
              title: "Tests and checks",
              body: "57 automated tests with tsx, plus tsc and eslint.",
            },
          ],
        },
      },
      part3: {
        subLabel: "03. One key engineering decision",
        headline: "Treat AI output as untrusted",
        decision: {
          label: "Decision",
          body: "Every analysis the model returns is checked before the app uses it. Small errors are repaired, failures are retried with the error fed back, and a basic reading is the last resort. The validated analysis is stored once, so coaching and Hear example build on the same output.",
        },
        tradeoff: {
          label: "Trade-off",
          items: [
            "More code than trusting the response.",
            "A failed first attempt can mean a second model call. The cost and delay of that were not measured.",
            "The fallback gives a plainer reading than a full analysis.",
          ],
          closing: "Reliability was chosen over richness.",
        },
        reasoning: {
          label: "Reasoning",
          phrase1: "One bad field breaks every feature.",
          phrase2: "Authors can't debug a bad response.",
          ariaDescription: "Coaching, Hear example and narration all read the same chapter analysis, so one malformed field breaks all of them. First-time authors cannot debug a bad response, so the product has to keep working.",
        },
        challenge: {
          label: "The challenge",
          body: "On real manuscripts, Claude sometimes returned structured output with tags embedded inside fields. Downstream features could not read it.",
        },
        whatWasBuilt: {
          label: "What was built",
          boxes: [
            { heading: "Validate and repair", body: "A structured-output check, plus a repair step for minor errors." },
            { heading: "Retry with the error", body: "Up to two attempts per chapter, with the specific validation error fed into the retry." },
            { heading: "Fail gracefully", body: "A basic-reading fallback if both attempts fail." },
            { heading: "Prompt fix", body: "A worked example of the expected structure, and an explicit ban on tags or XML inside fields." },
            { heading: "Reuse", body: "Chapter analyses are stored so every feature builds on the same output." },
          ],
        },
        whatImproved: {
          label: "What improved",
          caption: "Cases passing every run, Run 1 vs Run 4",
          before: { count: 3, total: 15, rowLabel: "Run 1" },
          after: { count: 8, total: 15, rowLabel: "Run 4" },
          annotation: "",
          ariaLabel: "Cases passing every run: Run 1, 3 of 15 (20%). Run 4, 8 of 15 (53%).",
        },
      },
    },
    evaluationSection: {
      sectionLabel: "Evaluation and Results",
      // 01
      label01: "01. How it is tested",
      stats: [
        { value: "18", label: "test cases" },
        { value: "3", label: "runs per case" },
        { value: "2", label: "kinds of checks" },
        { value: "3", label: "real book excerpts" },
      ],
      intro: "18 test cases, each a small scenario with a defined good answer. Each case runs 3 times, because AI answers vary from run to run.",
      caseGroups: [
        { label: "Reading the emotion of a line", count: 6 },
        { label: "Coaching a first-time narrator", count: 5 },
        { label: "Respecting the author's choices", count: 3 },
        { label: "Producing output the app can use", count: 4 },
      ],
      checkCards: [
        {
          title: "Rule checks (automatic)",
          body: "Advice must be one or two sentences, a hard name must get a pronunciation tip, and so on.",
        },
        {
          title: "Judge model (a second Claude call)",
          body: "Decides whether the answer fits the scene and the author's chosen feeling. An answer the judge cannot decide on counts as a fail.",
        },
      ],
      bookNote: "Three of the cases use real book excerpts, so the tests are not only invented examples.",
      // 02
      label02: "02. What PASS, FLAKY and FAIL mean",
      statusCards: [
        {
          status: "PASS",
          runs: [true, true, true],
          description: "The case succeeded in all 3 runs.",
        },
        {
          status: "FLAKY",
          runs: [true, false, true],
          description: "The case succeeded in some runs but not all. The product works sometimes, which is the riskiest result for a first-time author.",
        },
        {
          status: "FAIL",
          runs: [false, false, false],
          description: "The case failed in all 3 runs.",
        },
      ],
      flakyNote: "the riskiest one",
      // 04
      label04: "03. Run history",
      modelCallsRows: [
        { case: "R1: full sample chapter analysis", calls: 1 },
        { case: "R2: line coach, three selections", calls: 3 },
        { case: "R3: update parts, then two advice refreshes", calls: 3 },
        { case: "Total per run", calls: 7, isTotal: true },
      ],
      runs: [
        {
          run: "Run 1", cases: 15, passed: 3, flaky: 7, failed: 5,
          validFirst: { count: 18, total: 21 },
          changed: "Baseline",
        },
        {
          run: "Run 2", cases: 15, passed: 4, flaky: 7, failed: 4,
          validFirst: { count: 18, total: 21 },
          changed: "Fixed two scoring bugs. Shortened coach advice to two sentences and capped suggestions at three.",
        },
        {
          run: "Run 3", cases: 15, passed: 8, flaky: 4, failed: 3,
          validFirst: { count: 20, total: 21 },
          changed: "Told the model not to put code-like tags inside its answer fields, which had broken the app's reading of its output. Made the update step name the parts to return, and retry once if parts are skipped.",
        },
        {
          run: "Run 4", cases: 18, passed: 9, flaky: 5, failed: 4,
          validFirst: { count: 39, total: 39 },
          changed: "Added 3 real-excerpt cases. Gave the model a worked example of the exact answer format.",
          sharedPassed: 8, hasFootnote: true,
        },
      ],
      footnote: "Run 4 has 18 cases, so compare it with runs 1 to 3 only on the 15 shared cases (8/15 passed every run).",
      legendPass: "Passed every run",
      legendFlaky: "Flaky",
      legendFail: "Failed every run",
      // 05
      label05: "04. What still fails",
      failingGroupLabel: "Failing every run",
      failingCards: [
        {
          title: "Coaching a long, suspenseful passage",
          detail: "Tips keep breaking the length rule. Advice runs to three sentences where the limit is two.",
        },
        {
          title: "Coaching a line with an invented fantasy name",
          detail: "The pronunciation tip for the name is always given. The judge rejects the other tips for adding details the text does not contain.",
        },
        {
          title: "Refreshing advice after the author picks a tender, relieved feeling",
          detail: "The advice tells the narrator to sound like she is holding back tears. The judge reads that as sadness, not relief, so it counts as drifting from the author's choice.",
          important: true,
        },
        {
          title: "Coaching a sharp line when the author chose a tender, relieved feeling",
          detail: "The same drift. Tips add held-back tears or keep a sharp edge.",
          important: true,
        },
      ],
      importantNote: "most important for the product: the author stays in control",
      authorNote: "The author's own text describes the moment as \"a way of not crying\", so the judge may be stricter than a human reader. That has not been checked by a person.",
      flakyGroupLabel: "Flaky",
      flakyDetailCards: [
        { title: "Reading the mood of the same line in two different stories", detail: "The same short line of dialogue is placed in two stories where it means different things. Sometimes the AI gives the warm, encouraging version an anxious or uneasy mood, and the judge rejects it." },
        { title: "Following the author's chosen feeling for a scene", detail: "The author tells the AI that a character is softening. Sometimes the AI labels the scene with a painful or stinging mood instead, which does not match the author's choice. When the author chooses an angry feeling, which matches the AI's own reading, the label was right in every run." },
        { title: "Coaching a line that contains a name and a code", detail: "The line includes a person's name and an apartment number. Sometimes the AI returns only one tip, with no help on how to pronounce either." },
        { title: "Coaching a line made only of everyday words", detail: "The line has nothing hard to say. Sometimes the AI adds a tip based on a detail that is not in the text." },
        { title: "Analysing real book excerpts", detail: "The output is always usable by the app. In one run, a character in one excerpt had no feeling listed for some parts of the scene." },
      ],
      // 06
      label06: "05. Limits",
      limits: [
        "The same model family judges its own output.",
        "No user testing has been done.",
        "Production monitoring: not built.",
      ],
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
    solution:
      "[Describe what you shipped. What does it do? How does it address the problem you defined?]",
    learningItems: [
      {
        title: "Human-in-the-loop evaluation",
        body: "AI can misinterpret emotional nuance, making human review essential to ensure feedback aligns with the author’s intent.",
      },
      {
        title: "Author control is harder than it looks",
        body: "Giving authors editing capabilities isn’t enough; AI coaching must consistently respect their corrections and preferences.",
      },
      {
        title: "Voice generation tools aren’t enough",
        body: "Audiobook narration must capture the story’s emotional intensity and nuance, not just sound as human as possible.",
      },
    ],
  },

  "veraai": {
    pageTitle: "How can we reduce a 30-day sales cycle to a single day?",
    subtitle: "VeraAI Technologies Inc. [2025 - 2026]",
    accent: ACCENTS.veraai,
    accentBright: ACCENTS_BRIGHT.veraai,
    metaTitle: "How can we reduce a 30-day sales cycle to a single day? | VeraAI",
    metaDescription: "VeraAI Technologies Inc. case study, 2025 - 2026",
    hookImage: {
      src: "/veraai/hook.png",
      width: 1536,
      height: 1024,
      alt: "Diagram: 30 days of decisions around a calendar, including layout options, material choices, appliance selection, design revisions, quoting and re-quoting, coordination, compliance, client alignment, budget considerations, and measurements, leading to '1 visit to yes?' with visualize the layout, select materials, and get a quote.",
    },
    hideSidebar: true,
    summary: "[Add one-line summary]",
    company: "[Add company]",
    role: "[Add role]",
    timeline: "[Add timeline]",
    team: "[Add team]",
    tools: "[Add tools]",
    overviewGrid: {
      problem:
        "Remodelers rely on fragmented tools and repeated manual work to turn homeowner requirements into designs and quotations. The process is slow, unpredictable, and difficult to scale.",
      solution: {
        label: "Solution & North Star",
        intro:
          "An AI-assisted design workflow that generates NKBA-compliant kitchen layouts, 2D visuals, and bills of materials and quotations to accelerate early design decisions.",
        squigglePhrase: "NKBA-compliant",
        note: {
          heading: "Uh, what is NKBA-compliant?",
          body: "A kitchen design that follows the National Kitchen & Bath Association’s guidelines for safety, functionality, accessibility, and proper spacing.",
        },
      },
      users:
        "Kitchen remodeling specialists (aka remodellers) who need to create reliable designs and proposals quickly, without learning complex design software.",
      hideUsersIcons: true,
      results: [
        "Generated **10–15 NKBA-compliant kitchen layouts**, validating an early level of technical feasibility.",
        "Built a chatbot that identified and returned material selections based on user input.",
        "Defined an MVP focused on measurements, layout generation, catalog integration, and quotations.",
        "Coordinated a **12-person hybrid team** across three sprints.",
      ],
    },
    overview: "",
    problem: "",
    myRole: "",
    solution: "",
    storyStrip: {
      layout: "steps",
      flowchart: {
        note: "(average time: 42 days)",
        steps: [
          ["Potential Contact (Lead Generation - Advertising Sources)"],
          ["What does the homeowner need for their new Kitchen?", "Project Info & Logistical Info"],
          ["Start Sketches - Drafts (Either Manual or Software)"],
          ["Customer Review : Design & Notes"],
          ["Check Material catalogs for availability"],
          ["Confirmation between Client & Remodeller"],
          ["Bill of Materials & Quotation"],
        ],
        loop: { from: 3, to: 2 },
        branch: { text: "Customer visits Showroom to pick materials", rejoin: 4 },
      },
      subLabel: "01. A long, fragmented path from consultation to quotation",
      ariaDescription: "Meet Dave, a kitchen renovation specialist at DreamKitchens Inc.",
      ariaLabel: "Meet Dave",
      person: {
        name: "Dave",
        label: "Meet Dave!",
        caption: "Kitchen renovation specialist at DreamKitchens Inc.",
        arrow: true,
        alt: "Cartoon of Dave, a smiling man with short twisted hair, wearing a black sweater with green squiggles and raising one finger as if making a point.",
        image: { src: "/veraai/dave.png", width: 316, height: 400 },
      },
      columns: [
        {
          text: "His client, Renata, wants to remodel her L‑shaped kitchen in Florida.",
          image: {
            src: "/veraai/renata.png",
            alt: "Cartoon of Renata, a woman with shoulder-length black hair and a teal striped top, eyes closed with her hand resting on her chest.",
            width: 287,
            height: 400,
          },
        },
        {
          text: "Dave walks her through the proposed designs, makes three rounds of revisions, and takes her to select materials.",
          icon: { name: "Files", size: 56 },
          badge: "X3",
          image: { src: "", alt: "", width: 287, height: 400 }, // src empty = placeholder
        },
        {
          text: "With the design finalized, he begins preparing the quotation.",
          textOffsetY: -30,
          icon: { name: "FileText", size: 56 },
          iconLead: { color: "#16A34A" },
          iconCaption: "$10,680",
          iconOffsetY: 10,
          image: { src: "", alt: "", width: 287, height: 400 }, // src empty = placeholder
        },
        {
          text: "Then, just as the project is about to move forward, Renata changes her mind. She decides to put the renovation on hold and revisit it another day.",
          icon: { name: "House", size: 56 },
          iconLead: { name: "X", color: "#DC2626" },
          image: { src: "", alt: "", width: 287, height: 400 }, // src empty = placeholder
        },
      ],
      quote: "Thirty days of decisions, and no deal.",
      closingText:
        "Closing a remodeling client involves multiple steps: scheduling, planning, creating schematics, selecting materials, and preparing a quote. Each design revision or change in material selection can add time and uncertainty.",
      afterFlowchartText:
        "Remodelers needed a way to deliver quality designs faster without taking on additional tools or training.",
      afterFlowchartQuote:
        "We are not tech savvy people, we are not going to spend time learning the tool. As a salesperson, we want to close clients and keep moving",
    },
    toolsAnalysis: {
      subLabel: "02. Why existing tools weren’t enough",
      intro: "Our competitive analysis highlighted a fragmented workflow:",
      tableHeaders: ["Tools", "What’s it for?", "Description"],
      tableRows: [
        {
          tool: "AutoCAD / 2020",
          purpose: "Schematics & Floor Plans",
          description: "Industry-standard CAD software for precise 2D/3D technical drawings, requiring specialized training and significant time.",
        },
        {
          tool: "RoomGPT / InteriorAI",
          purpose: "2D & 3D Layouts",
          description: "AI tools generating inspirational design visualizations, focused on aesthetics rather than construction-ready layouts or code compliance.",
        },
        {
          tool: "Houzz Pro / CoConstruct",
          purpose: "Scheduling & Budgeting",
          description: "Project management platforms handling scheduling, budgeting, and collaboration but not automating initial design creation.",
        },
      ],
      leadIns: [
        "Each tool was evaluated based on the features it offers to remodellers.",
        "A cohesive view of the features of the tools are as follows -",
      ],
      matrix: {
        caption: "Feature comparison of AutoCAD, RoomGPT, InteriorAI, Houzz Pro, and CoConstruct",
        columns: ["AutoCAD / 2020", "RoomGPT / InteriorAI", "Houzz Pro / CoConstruct"],
        rows: [
          { feature: "Real Manufacturer Catalogs", cells: [{ status: "no" }, { status: "no" }, { status: "yes", note: "[Limited SKU]" }] },
          { feature: "Generative Design (AI)", cells: [{ status: "no" }, { status: "yes" }, { status: "no" }] },
          { feature: "NKBA-Compliant Logic", cells: [{ status: "yes" }, { status: "no" }, { status: "no" }] },
          { feature: "Photoreal Visualization", cells: [{ status: "partial", note: "[Manual Render]" }, { status: "yes" }, { status: "partial" }] },
          { feature: "Build-Ready Outputs", cells: [{ status: "yes" }, { status: "no" }, { status: "partial" }] },
          { feature: "Natural Language Interface", cells: [{ status: "no" }, { status: "yes" }, { status: "no" }] },
          { feature: "Instant Bill of Materials", cells: [{ status: "partial" }, { status: "no" }, { status: "partial" }] },
        ],
      },
      stats: [
        { value: "57%", text: "of customers change their mind midway through the project", source: "" },
        { value: "49%", text: "of customers don’t move ahead without visualizations", source: "" },
      ],
      closing: "This analysis led us to prioritise the key features of VeraAI.",
    },
    productJobs: {
      subLabel: "01. Build around compliance, not just visualization",
      paragraph:
        "We chose NKBA kitchen guidelines as the product’s North Star, with an initial focus on kitchens before expanding to bathrooms and other remodeling workflows.",
      leadIn: "Our MVP centered on four jobs:",
      jobs: [
        { icon: "Ruler", text: "Capture kitchen measurements." },
        { icon: "ShieldCheck", text: "Generate NKBA-compliant layouts." },
        { icon: "LayoutGrid", text: "Produce 2D visuals using catalog items." },
        { icon: "ReceiptText", text: "Generate a bill of materials and quotation." },
      ],
      closing: {
        bold: "The principle:",
        rest: " give remodelers a high-confidence starting point that they could use to move the project forward.",
      },
    },
    personas: {
      subLabel: "02. Segmentation & Targeting",
      intro:
        "VeraAI aims to be the sole end-to-end workflow tool for remodellers to close sales. The core product covers the four stages of gaining a client, affecting three target segments:",
      segments: [
        { name: "Homeowners", text: "Customers who are interested in having their Kitchen renovated" },
        { name: "Business Account Owners", text: "Administrators who track & maintain lead generation" },
        {
          name: "Project Specialists",
          text: "Remodellers who do the ground work of analysing the current vs future states of the Kitchen & fulfilling the needs of the Homeowner",
        },
      ],
      personas: [
        {
          role: "Homeowner",
          name: "Annie",
          avatar: {
            src: "/veraai/annie.png",
            width: 160,
            height: 200,
            alt: "Cartoon of Annie, a homeowner with a black bob haircut, eyes closed in a smile, wearing a loose black top.",
            blend: true,
          },
        },
        {
          role: "Business Account Owner",
          name: "Jack",
          avatar: {
            src: "/veraai/jack.png",
            width: 190,
            height: 200,
            alt: "Cartoon of Jack, a business account owner in a black hat and yellow shirt, holding an open laptop.",
            blend: true,
          },
        },
        {
          role: "Project Specialist",
          name: "Edgar",
          avatar: {
            src: "/veraai/edgar.png",
            width: 150,
            height: 200,
            alt: "Cartoon of Edgar, a project specialist with short dark hair, wearing a black sweater with yellow flecks over a yellow collar.",
            blend: true,
          },
        },
      ],
      rows: [
        { label: "Primary Motivations", cells: [
          "Achieve a functional, aesthetically pleasing kitchen within a clear budget and timeline.",
          "Maximize lead conversion and project profitability",
          "Deliver compliant, accurate designs with minimal rework",
        ] },
        { label: "Behavioural Patterns", cells: [
          [
              "Research-driven and comparison-oriented, exploring multiple vendors online before initiating contact",
              "Seeks frequent updates and visual confirmation, especially before committing to cost or design decisions",
            ],
          [
              "Prioritizes pipeline visibility and predictability, tracking leads and client status across tools",
              "Balances sales and operations simultaneously, often switching context between closing deals and managing active projects",
            ],
          [
              "Relies on manual, fragmented workflows and consolidates information late in the process",
              "Validates compliance and feasibility after initial design, leading to rework and revisions",
            ],
        ] },
        { label: "Resource Constraints", cells: [
          "Limited renovation knowledge, time, and budget flexibility",
          "Limited visibility across sales, projects, and teams",
          "Time pressure, fragmented tools, and incomplete site data",
        ] },
        { label: "Goals & Outcomes", cells: [
          "Confidence in decisions and transparency from discovery through completion",
          "A predictable pipeline with controlled costs and timely delivery",
          "Faster design-to-quote cycles with NKBA-compliant outputs",
        ] },
      ],
      opportunities: {
        leadIn: "Possible opportunities to serve each persona -",
        cards: [
          {
            title: "Homeowners",
            items: ["Discovery through Marketing channels", "Lead Submission & Onboarding", "Communication & Status Visibility"],
          },
          {
            title: "Business Account Owners",
            items: ["Lead Generation/ Capture", "Client State Tracking", "Vendor & Catalog Management System", "Project Management System", "Sales"],
          },
          {
            title: "Project Specialists",
            items: ["Project Folders", "Notetaker", "Measurements", "2D & 3D Schematics", "BOM & Quotation Generation"],
          },
        ],
      },
      focusIndex: 2,
      focusNote: "our MVP focus",
      closing:
        "With the NKBA-compliant engine as our North Star, we focused on serving the Project Specialist first, building only the minimum features required to validate our idea [MVP: Minimum Viable Product].",
    },
    featuresMvp: {
      subLabel: "03. Key Features",
      intro: "As a Project Specialist, these are the main features needed in a day-to-day workflow -",
      headers: ["JTBD", "Feature", "MVP"],
      rows: [
        {
          marker: "#1",
          jtbd: "- When analyzing a client’s kitchen, I want to capture accurate measurements quickly, so I can design layouts without missing constraints",
          feature: "Measurements capture tool using Mobile",
          mvp: "Manual entry of measurements on webpage",
        },
        {
          marker: "#2",
          jtbd: "- When planning a renovation, I want NKBA‑compliant layouts, so I can avoid rework and stay within industry standards",
          feature: "NKBA‑compliant layout generation",
          mvp: "",
        },
        {
          marker: "#3",
          jtbd: "- When visualizing a kitchen design, I want 2D & 3D schematics generated from catalog items, so I can present realistic layouts to homeowners",
          feature: "2D & 3D schematics via catalog ingestion",
          mvp: "Create 2D schematic with limited catalog items",
        },
        {
          marker: "#4",
          jtbd: "- When finalizing the project, I want a BOM and accurate quotation generated automatically, so I can save time and reduce errors",
          feature: "BOM & quotation generation",
          mvp: "Create a 2-in-1 BOM + Quotation with catalog data reflected",
        },
      ],
    },
    featurePriority: {
      subLabel: "04. Feature Prioritization",
      headers: ["Feature", "Impact", "Effort", "Priority", "Notes"],
      rows: [
        { feature: "Measurements", impact: "High", effort: "Low", priority: "Must-Have", notes: "" },
        { feature: "NKBA Engine", impact: "High", effort: "High", priority: "Must-Have", notes: "" },
        { feature: "Layout Generation", impact: "High", effort: "High", priority: "Must-Have", notes: "" },
        { feature: "Catalog Ingestion", impact: "Medium", effort: "High", priority: "Should-Have", notes: "Include Limited catalog Items" },
        { feature: "Chatbot", impact: "Medium", effort: "High", priority: "Should-Have", notes: "Create Keyword matching chatbot" },
        { feature: "Lookbook", impact: "Low", effort: "Low", priority: "Won’t-Have", notes: "" },
        { feature: "2D Scene Visualizer", impact: "High", effort: "High", priority: "Should-Have", notes: "Include essential scenes | Resource Constraints" },
        { feature: "3D Design Studio", impact: "High", effort: "High", priority: "Won’t-Have", notes: "Time & Resource constraints" },
        { feature: "BOM + Quotation", impact: "High", effort: "High", priority: "Should-Have", notes: "Basic BOM & Quotation to include essential details" },
        { feature: "Credit Allocation", impact: "Medium", effort: "High", priority: "Won’t-Have", notes: "" },
        { feature: "Project Tracking", impact: "Medium", effort: "Low", priority: "Could-Have", notes: "" },
      ],
    },
    pivots: {
      heading: "Three pivots to find the right product",
      note: "we are here",
      pivots: [
        {
          label: "Pivot 1",
          title: "Predefined kitchen templates",
          body: "We started with a studio offering predefined templates and layouts for homeowners to choose from.",
          calloutLabel: "What we learned",
          calloutText: "The concept was already widely available, making differentiation difficult.",
          status: "dropped",
          statusLabel: "Dropped",
          icon: "LayoutTemplate",
        },
        {
          label: "Pivot 2",
          title: "Layering catalog items onto kitchen photos",
          body: "We explored segmenting kitchen photos and overlaying catalog materials to help homeowners visualize changes.",
          calloutLabel: "What we learned",
          calloutText: "Segmentation and layering were technically complex and inconsistent, and the approach struggled to support complete remodels.",
          status: "dropped",
          statusLabel: "Dropped",
          icon: "Layers",
        },
        {
          label: "Pivot 3",
          title: "NKBA‑compliant AI layouts",
          body: "We shifted toward generating kitchen layouts guided by NKBA standards, with 2D visuals to help project specialists present designs to homeowners.",
          calloutLabel: "Why this direction",
          calloutText: "It focused the product on a concrete remodeling need, producing usable layouts within established design constraints, rather than visualization alone.",
          status: "current",
          statusLabel: "Current direction",
          icon: "ShieldCheck",
        },
      ],
      closing: "This became the current direction, with further development still in progress.",
    },
    showSections: { solution: false, evaluation: false }, // Solution is replaced by `pilot`; Evaluation is hidden for now
    pilot: {
      heading: "Building and validating the pilot",
      videoUrl: "",
      poster: "",
      intro: "The pilot focused on establishing technical feasibility for the core workflow.",
      stats: [
        { value: "10–15", label: "NKBA‑compliant layouts generated" },
        { value: "12", label: "person hybrid team" },
        { value: "3", label: "sprints" },
      ],
      cards: [
        { icon: "LayoutGrid", title: "Layout generation", text: "Generated 10–15 NKBA‑compliant kitchen layouts." },
        { icon: "MessageSquareText", title: "Material selection", text: "Built a chatbot that returned material selections based on user input." },
        { icon: "Network", title: "CRM architecture", text: "Defined customer journey tracking and vendor information management." },
        {
          icon: "Rocket",
          title: "Product execution",
          text: "Built the product’s frontend end-to-end, coordinated a 12‑person hybrid team across three sprints, and developed landing pages and go-to-market materials.",
        },
      ],
    },
    website: {
      heading: "Bringing VeraAI to market",
      intro:
        "Beyond defining the product, I built VeraAI’s website end-to-end, translating the product vision into a customer-facing experience for kitchen and bath remodeling professionals.",
      first: {
        subLabel: "01. The first impression",
        videoUrl: "",
        poster: "",
        placeholderLabel: "[Website walkthrough video, 10–20 seconds]",
        caption:
          "A look at the first draft of VeraAI’s website, from the homepage and value proposition to the presentation of its product capabilities.",
        tags: ["Website design and frontend development", "Early draft"],
      },
      communicating: {
        subLabel: "02. Communicating the product",
        blocks: [
          {
            src: "/veraai/website/hero.png",
            alt: "Screenshot of the VeraAI homepage hero, showing the product headline and call to action for kitchen and bath remodeling professionals.",
            placeholderLabel: "[Homepage hero screenshot]",
            caption:
              "The homepage introduced VeraAI’s vision and communicated the value of AI-assisted kitchen and bath remodeling.",
          },
          {
            src: "/veraai/website/features.png",
            alt: "Screenshot of the VeraAI website's product and features section, laying out the product capabilities.",
            placeholderLabel: "[Product and features section screenshot]",
            caption:
              "The product sections translated VeraAI’s capabilities into a clear story for prospective customers and stakeholders.",
          },
        ],
      },
      contribution: {
        label: "My contribution",
        text: "End-to-end frontend development, website content presentation, and go-to-market materials.",
      },
    },
    problemBlocks: [
      { label: "01.", text: "[Add the problem statement]" },
      { label: "02.", text: "[Add the problem statement]" },
    ],
    productStrategyBlocks: [
      { label: "01.", type: "table", text: "[Add table content]" },
      { label: "02.", type: "table", text: "[Add table content]" },
      { label: "03.", type: "screens", text: "[Add screens content]" },
    ],
    evaluationText: "[Add evaluation and observability content]",
    learningsHeading: "What I learned",
    learningItems: [
      {
        title: "Differentiate on the workflow, not just the interface.",
        body: "Attractive visualizations weren’t enough; the product needed to help remodelers produce usable, NKBA‑compliant designs.",
      },
      {
        title: "Technical feasibility must shape product strategy.",
        body: "The photo-layering concept revealed how implementation constraints can undermine an otherwise appealing idea.",
      },
      {
        title: "A focused MVP is more valuable than an oversized roadmap.",
        body: "Prioritizing the core layout workflow helped narrow the scope to the capabilities most central to the product’s value.",
      },
    ],
    whatsNext: {
      heading: "What’s next",
      cards: [
        {
          icon: "Cog",
          label: "Build",
          text: "Continue developing the NKBA‑compliant layout engine and the workflow connecting generated layouts to 2D visuals, material selection, and quotations.",
        },
        {
          icon: "Users",
          label: "Validate",
          text: "Validate the product with remodelers, measuring design time, manual corrections, iteration frequency, user adoption, and eventually the time required to close a client.",
          tags: ["Design time", "Manual corrections", "Iteration frequency", "User adoption", "Time to close a client"],
        },
      ],
    },
  },

  "metamint": {
    pageTitle: "[Add MetaMint case study title]",
    accent: ACCENTS.dolby,
    subtitle: "MetaMint",
    tagline: "[Add hook line]",
    hideSidebar: true,
    summary: "[Add one-line summary]",
    company: "[Add company]",
    role: "[Add role]",
    timeline: "[Add timeline]",
    team: "[Add team]",
    tools: "[Add tools]",
    overviewGrid: {
      problem: [
        { headline: "[Add problem headline]", body: "[Add the problem statement]" },
      ],
      solution: {
        intro: "[Add solution description]",
        items: ["[Add item 1]", "[Add item 2]", "[Add item 3]"],
      },
      users: "[Add user description]",
      results: [
        { year: "[Year]", label: "[Add results label]", body: "[Add results description]" },
      ],
    },
    overview: "",
    problem: "",
    myRole: "",
    solution: "",
    problemBlocks: [
      { label: "01.", text: "[Add the problem statement]" },
      { label: "02.", text: "[Add the problem statement]" },
      { label: "03.", text: "[Add the problem statement]" },
    ],
    productStrategyBlocks: [
      { label: "01.", type: "table", text: "[Add table content]" },
      { label: "02.", type: "table", text: "[Add table content]" },
      { label: "03.", type: "screens", text: "[Add screens content]" },
    ],
    solutionBlocks: [
      { label: "01. See it in action", type: "video", text: "[Add video or description]" },
      { label: "02.", type: "diagram", text: "[Add diagram content]" },
      { label: "03. One key engineering decision", type: "decision", text: "[Add decision content]" },
    ],
    evaluationText: "[Add evaluation and observability content]",
    learningItems: [
      { title: "[Add learning title]", body: "[Add learning body]" },
      { title: "[Add learning title]", body: "[Add learning body]" },
      { title: "[Add learning title]", body: "[Add learning body]" },
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
