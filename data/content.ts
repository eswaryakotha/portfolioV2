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
  metamint: "#1F6B4F", // placeholder deep mint green; change here
} as const;

// Brighter companion used for hand-drawn annotations; falls back to the accent.
export const ACCENTS_BRIGHT: Record<string, string> = {
  veraai: "#2F6BFF",
  metamint: "#2E9E73", // placeholder bright mint; change here
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
    accent: ACCENTS.metamint,
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

// Optional pieces used by the MetaMint Overview (Dolby and VeraAI don't set them).
export type StatusCard = {
  icon: string; // lucide-react icon name
  tag: string; // real-text status, e.g. "Working Prototype"
  title: string;
  text: string;
  status: "vision" | "built"; // vision = dashed border, built = solid tinted
};

export type StatTile = {
  percentLabel: string; // the figure as displayed; checked against correct/total in dev
  correct: number;
  total: number;
  decimals: number; // shown precision
  description: string;
};

export type LabeledResult = {
  verb: string;
  title: string;
  text?: string;
  stats?: StatTile[];
};

export type YearResult = { year: string; label: string; body: string; boldPhrases?: string[] };

export type SummaryGridData = {
  stackLayout?: boolean; // Solution and Users each take a full-width row
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
    lead?: string; // line between the intro and the status cards
    cards?: StatusCard[];
    foundationNote?: string; // handwritten note + arrow from the last card to the first
  };
  users: string;
  hideUsersIcons?: boolean;
  // year-labeled items, or plain bullets (**bold** markers supported)
  results: YearResult[] | string[] | LabeledResult[];
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

export type JtbdData = {
  subLabel: string;
  intro: string;
  headers: [string, string, string, string]; // #, Type, Job, Job to be done
  // one entry per type: Lucide icon name and tag style (outline | tint | gray)
  types: Record<string, { icon: string; style: "outline" | "tint" | "gray" }>;
  rows: Array<{ number: string; type: string; job: string; jtbd: string }>;
};

export type FeatureBoardData = {
  subLabel: string;
  showMvpNote: boolean; // set to false to hide the handwritten note (it also needs every MVP card to be Must Have)
  mvpNote: string;
  // one entry per category and per priority: Lucide icon name
  categories: Record<string, { icon: string }>;
  priorities: Record<string, { icon: string }>;
  priorityOrder: string[]; // order used by the counts line and the legend
  // style picks the column look; "out" is the parking lot. Move a card between columns by moving it between cards arrays.
  releases: Array<{
    name: string;
    style: "mvp" | "v02" | "v10" | "out";
    summaryPhrase: string; // used in the summary line, after the count
    cards: Array<{ text: string; category: string; priority: string }>;
  }>;
};

export type ProductAnalyticsData = {
  subLabel: string;
  intro: string;
  rationale: { label: string; items: Array<{ icon: string; text: string }> };
  goal: {
    label: string;
    tag: { text: string; icon: string };
    text: string; // *word* is shown in italic
    lifecycle: { label: string; steps: string[]; focus: string; focusNote: string; focusSrText: string };
  };
  competitors: { label: string; groups: Array<{ label: string; names: string[] }> }; // empty label = hidden
  users: {
    label: string;
    jobLabel: string;
    journeyLabel: string;
    metamintSrText: string;
    items: Array<{
      label: string;
      title: string;
      icon: string;
      job: string[]; // one item is shown as a paragraph, more as a list
      steps: Array<{ text: string; metamint?: boolean }>;
    }>;
  };
  metrics: {
    label: string;
    northStar: { label: string; title: string; icon: string; chips: Array<{ icon: string; text: string }>; srText: string };
    focusPill: string;
    groups: Array<{ icon: string; label: string; items: string[]; focus?: boolean }>;
  };
};

export type SolutionDemoData = {
  videosSubLabel: string;
  videos: Array<{
    tag: string;
    tagStyle: "dashed" | "solid";
    title: string;
    placeholderLabel: string;
    ariaLabel: string; // " (placeholder)" is added while videoUrl is empty
    videoUrl: string; // empty = placeholder; .mp4 path = video; YouTube, Vimeo or Loom link = iframe
    poster: string;
    text: string;
  }>;
  diagram: {
    subLabel: string;
    intro: string;
    srText: string;
    groups: Array<{ id: string; label: string }>; // headings used below 1000px
    // type: ai | code | io | eval. row and column are 1-based grid cells (desktop); colSpan defaults to 1.
    // Boxes are listed in reading order.
    boxes: Array<{
      id: string;
      type: "ai" | "code" | "io" | "eval";
      tag: string;
      name: string;
      description: string;
      stack: string;
      icon: string; // Lucide icon name; ai and code boxes use the legend icon when empty
      row: number;
      column: number;
      colSpan?: number;
      group: string;
    }>;
    connections: Array<{ from: string; to: string }>;
    legend: Array<{ type: "ai" | "code" | "io"; icon: string; tag: string; label: string }>;
  };
};

export type KeyDecisionData = {
  subLabel: string;
  headline: string; // shown inside the decorative quote marks, so no quotation characters here
  challenge: { label: string; icon: string; text: string };
  decision: {
    label: string;
    text: string;
    lanes: {
      ai: { icon: string; label: string; subtitle: string; rows: Array<{ icon: string; text: string }> };
      code: { icon: string; label: string; subtitle: string; rows: Array<{ icon: string; text: string }> };
    };
    handoff: { note: string; showNote: boolean }; // showNote false hides the handwritten note
    srText: string;
  };
  why: {
    label: string;
    text: string;
    showChips: boolean; // false hides the three chips
    chips: string[];
  };
};

// one result stored once as counts; the Overview and the evaluation cards both read it
export type EvalCounts = { correct: number; total: number };

export type AiReliabilitySection = {
  kind: "aiReliability";
  subLabel: string;
  intro: string[];
  cards: Array<{
    icon: string;
    label: string;
    // scored cards: counts, unit word and the percentage the counts must give (checked in dev)
    counts?: EvalCounts;
    unit?: string;
    expectedPercent?: string;
    note?: string;
    // unscored card: shown instead of a percentage
    bigText?: string;
    countText?: string;
    pill?: string;
  }>;
  scopeNote: string;
};

export type FailureDecisionCase = {
  tag: string;
  title: string;
  // the three parts, in order: the failure, the decision, the product implication
  parts: Array<{ icon: string; label: string; text: string }>;
  // shown inside the first part, under its text
  visual:
    | { kind: "runs"; rows: Array<{ label: string; counts: EvalCounts; expectedPercent: string; highlight?: boolean }>; srText: string }
    | { kind: "bubble"; text: string; tags: string[]; tagIcon: string; note: { text: string; show: boolean } };
};

export type FailureDecisionSection = {
  kind: "failureDecision";
  subLabel: string;
  cases: FailureDecisionCase[];
};

export type EvalsShapedSection = {
  kind: "evalsShaped";
  subLabel: string;
  intro: string;
  rows: Array<{ icon: string; title: string; finding: string; decision: string }>;
  findingLabel: string;
  decisionLabel: string;
};

export type LimitsNextSection = {
  kind: "limitsNext";
  subLabel: string;
  limits: { label: string; icon: string; items: string[] };
  next: { label: string; items: string[] };
  closing: string;
};

export type EvaluationsData = {
  heading: string;
  subSections: Array<AiReliabilitySection | FailureDecisionSection | EvalsShapedSection | LimitsNextSection>; // add the next parts here
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

export type ProcessRowStep = {
  icon: string; // lucide-react icon name
  title: string;
  text: string;
  manual?: boolean; // gets a "Manual" tag when showManualTags is on
  logos?: string[]; // optional paths under /public/metamint/process/; empty = nothing shown
};

export type ProcessRowData = {
  showManualTags: boolean; // lowercase "manual" next to the icon of manual steps
  showStepArrows: boolean; // thin gray arrows between the steps
  steps: ProcessRowStep[];
};

export type OpportunityData = {
  subLabel: string;
  text: string;
  shift: {
    notJust: { label: string; icon: string; text: string; srText: string };
    butAlso: { label: string; icon: string; text: string };
  };
  chips: Array<{ icon: string; text: string }>; // lucide-react icon names
  closing: string;
  closingHighlight: string; // phrase inside `closing` that gets the marker highlight
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
  // animated icon scene (row layout); an `image` with a src replaces it
  scene?: { kind: "coinDrop" | "pile" | "question"; icons: string[] };
};

export type StoryStripData = {
  flowchart?: ProcessFlowchartData; // shown directly under the quote
  layout?: "steps" | "row"; // steps: person beside 2-up boxes; row: person plus a single row of boxes with arrows; omitted = original 3-up
  quoteMaxWidth?: number; // widest the quote may get (default 540)
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
  processRow?: ProcessRowData; // "Current process" icon steps directly under the quote
};

// Hook visual for the MetaMint hero: a budget notebook page plus a chat bubble.
// The total and the overage are computed from `items` and `budget`.
export type BudgetHookData = {
  heading: string;
  budgetLabel: string;
  budget: number;
  items: Array<{ label: string; amount: number; flag?: "question" }>;
  totalLabel: string;
  scribble: string; // red handwritten note next to the circled total
  bubble: { before: string; after: string; time: string };
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
  budgetHook?: BudgetHookData;
  overviewGrid?: SummaryGridData;
  storyStrip?: StoryStripData;
  toolsAnalysis?: ToolsAnalysisData;
  opportunity?: OpportunityData;
  productJobs?: ProductJobsData;
  jtbd?: JtbdData;
  featureBoard?: FeatureBoardData;
  productAnalytics?: ProductAnalyticsData;
  solutionDemo?: SolutionDemoData;
  keyDecision?: KeyDecisionData;
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
  evaluations?: EvaluationsData;
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

// MetaMint AI reliability results, stored once (the Overview and the evaluation cards read these)
export const METAMINT_EVAL = {
  image: { correct: 23, total: 25 } as EvalCounts,
  intent: { correct: 28, total: 29 } as EvalCounts,
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
        "Generated and tested 10–15 NKBA‑compliant kitchen layouts in the working product, validating the technical feasibility of AI-assisted kitchen design.",
        "Defined the MVP scope across measurement capture, kitchen layout generation, catalog integration, and quotation workflows.",
        "Built the product’s end-to-end frontend using React and Tailwind CSS, implementing the core user journey from onboarding through kitchen design & quotation.",
        "Designed and developed VeraAI’s marketing website and landing page, establishing the product’s digital presence and communicating its value proposition.",
        "Coordinated a 12‑person hybrid team across three sprints, aligning execution with MVP priorities.",
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
        // Hidden with the matrix: "A cohesive view of the features of the tools are as follows -"
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
    pageTitle: "What if your money coach understood your financial life, not just your transactions?",
    accent: ACCENTS.metamint,
    accentBright: ACCENTS_BRIGHT.metamint,
    subtitle: "MetaMint, Independent [2026]",
    // tagline (spoiler line) intentionally omitted; it is optional and renders nothing when absent
    metaTitle: "What if your money coach understood your financial life, not just your transactions? | MetaMint",
    metaDescription: "MetaMint case study, Independent, 2026",
    budgetHook: {
      heading: "Chicago Trip",
      budgetLabel: "My budget:",
      budget: 1000,
      items: [
        { label: "Flights", amount: 320 },
        { label: "Stay (3 nights)", amount: 360 },
        { label: "Lou Malnati’s pizza", amount: 48 },
        { label: "Cafés + snacks", amount: 65 },
        { label: "Museum tickets", amount: 96 },
        { label: "Uber / transit", amount: 72 },
        { label: "Other food", amount: 120 },
        { label: "Shopping", amount: 110 },
        { label: "Misc (??)", amount: 95, flag: "question" },
      ],
      totalLabel: "Total",
      scribble: "oh no...",
      bubble: {
        before: "You’re ",
        after: " over your budget. Want to see where you spent the most?",
        time: "9:41 PM",
      },
    },
    hideSidebar: true,
    summary: "[Add one-line summary]",
    company: "[Add company]",
    role: "[Add role]",
    timeline: "[Add timeline]",
    team: "[Add team]",
    tools: "[Add tools]",
    overviewGrid: {
      stackLayout: true,
      problem:
        "Financial decisions don’t happen in isolation. Planning a trip, splitting costs with friends, and staying within a budget are connected but managing money often means piecing together information across conversations and financial tools.",
      solution: {
        intro:
          "MetaMint is a conversational AI money coach designed to make financial guidance more contextual by connecting everyday conversations with spending and budgeting decisions.",
        lead: "The product has two connected layers:",
        cards: [
          {
            icon: "MessagesSquare",
            tag: "Product Vision",
            title: "Money Coach",
            text: "Personalized guidance for trip planning, savings goals, budget awareness, and relevant financial products, informed by the user’s financial context.",
            status: "vision",
          },
          {
            icon: "Receipt",
            tag: "Working Prototype",
            title: "Group Expense Tracking",
            text: "An expense-understanding and tracking capability that turns group conversations and receipts into structured expenses, shared balances, and planned-versus-actual spending data.",
            status: "built",
          },
        ],
        foundationNote: "the foundation",
        closing:
          "The expense-tracking layer provides a foundation for the broader Money Coach vision, connecting what people plan to spend with what they actually spend.",
      },
      users:
        "Individuals seeking more contextual guidance on spending and budgeting, alongside friends and travel groups coordinating shared expenses.",
      hideUsersIcons: true,
      results: [
        {
          verb: "Designed",
          title: "The Money Coach",
          text: "Designed a conversational AI money coach to help people plan trips, set savings goals, stay within budgets, and explore relevant financial products using the context of their everyday lives.",
        },
        {
          verb: "Built",
          title: "Group Expense Tracking",
          text: "Built a working prototype that understands expense-related messages and receipts, splits group expenses, tracks balances, and links planned expenses to actual spending.",
        },
        {
          verb: "Evaluated",
          title: "AI Reliability",
          stats: [
            { percentLabel: "92%", ...METAMINT_EVAL.image, decimals: 0, description: `accuracy (${METAMINT_EVAL.image.correct}/${METAMINT_EVAL.image.total} images) in image relevance classification.` },
            { percentLabel: "96.6%", ...METAMINT_EVAL.intent, decimals: 1, description: `accuracy (${METAMINT_EVAL.intent.correct}/${METAMINT_EVAL.intent.total} messages) in intent classification during the unified evaluation run.` },
          ],
        },
      ],
    },
    storyStrip: {
      layout: "row",
      quoteMaxWidth: 760,
      subLabel: "01. Planning a trip without losing track", // placeholder wording
      ariaDescription: "Meet Elena. She is planning a birthday trip to Yosemite.",
      ariaLabel: "Meet Elena",
      person: {
        name: "Elena",
        label: "Meet Elena!",
        arrow: true,
        caption: "Planning a birthday trip to Yosemite",
        alt: "Cartoon illustration of Elena, a woman with a black bob and bangs, a small smile and eyes cast down to the side, wearing a black tank top.",
        image: { src: "/metamint/elena.png", width: 279, height: 400 },
      },
      columns: [
        {
          text: "She’s currently unemployed, so she needs to be careful about how much she spends without giving up the experience.",
          scene: { kind: "coinDrop", icons: ["Wallet", "Coins"] },
        },
        {
          text: "Elena keeps track of her expenses in her head, on scraps of paper, and across different conversations.",
          scene: { kind: "pile", icons: ["StickyNote", "StickyNote", "MessageCircle", "MessagesSquare"] },
        },
        {
          text: "With so much to remember, it’s easy to lose track of bills or even estimate how much she is spending.",
          scene: { kind: "question", icons: ["CircleQuestionMark"] },
        },
      ],
      quote: "I wish it could keep track of my expenses as I plan, so I can see where my money is going and stay within my budget.",
      processRow: {
        showManualTags: false, // set to true to show the "manual" words
        showStepArrows: false, // set to true to bring the gray arrows back
        steps: [
          { icon: "MessagesSquare", title: "Discuss expenses in chat", text: "Share payments, receipts, and plans across conversations.", logos: [] },
          { icon: "ReceiptText", title: "Reconstruct expenses", text: "Manually enter amounts, identify who paid, and calculate how to split costs.", manual: true, logos: [] },
          { icon: "ArrowLeftRight", title: "Settle up with friends", text: "Use a separate tool to track balances and figure out who owes whom.", logos: [] },
          { icon: "Calculator", title: "Calculate personal spending", text: "Manually add up expenses, track individual spending, and work out how much money remains for the trip.", manual: true, logos: [] },
        ],
      },
    },
    opportunity: {
      subLabel: "02. The opportunity",
      text: "Elena doesn’t just need another tool to split a bill. She needs a way to connect everyday spending with her bigger financial picture, so she can track what she spends, plan what she can afford, and make more informed decisions.",
      shift: {
        notJust: { label: "Not just", icon: "Split", text: "Split a bill", srText: "Not just: split a bill" },
        butAlso: { label: "But also", icon: "Network", text: "Everyday spending connected to the bigger financial picture" },
      },
      chips: [
        { icon: "Eye", text: "Track what she spends" },
        { icon: "CalendarCheck", text: "Plan what she can afford" },
        { icon: "Lightbulb", text: "Make more informed decisions" },
      ],
      closing: "That’s the opportunity behind MetaMint: a conversational Money Coach that understands the context of everyday life.",
      closingHighlight: "a conversational Money Coach that understands the context of everyday life",
    },
    jtbd: {
      subLabel: "01. JTBD",
      intro: "To understand what users truly need from a financial companion, I mapped their functional, emotional, and social Jobs to Be Done (JTBD), looking beyond expense tracking to the broader decisions they want help making.",
      headers: ["#", "Type", "Description", "Jobs to be done"],
      types: {
        Functional: { icon: "Wrench", style: "outline" },
        Emotional: { icon: "Heart", style: "tint" },
        Social: { icon: "Users", style: "gray" },
      },
      // Row 1 has not been provided yet. Add it here, as { number: "1", type, job, jtbd }.
      rows: [
        {
          number: "2",
          type: "Functional",
          job: "Split shared expenses fairly and pick the right card for each purchase, without leaving the chat",
          jtbd: "When my group chat is planning a trip or settling a bill, I want a fast and fair way to track and split costs without leaving the chat, so I can keep things simple and accurate.",
        },
        {
          number: "3",
          type: "Emotional",
          job: "Feel in control and confident about money decisions without active management or anxiety",
          jtbd: "When I’m thinking about a financial decision or upcoming expense, I want to feel confident I’m making the right call quickly, so I can stop worrying and move on with my day.",
        },
        {
          number: "4",
          type: "Social",
          job: "Be the easygoing friend who handles money fairly and gracefully in groups",
          jtbd: "When I’m splitting expenses or making money decisions in a group, I want everything handled fairly without anyone getting upset, so I can be the friend who keeps things together without making it weird.",
        },
      ],
    },
    featureBoard: {
      subLabel: "02. Feature Prioritization",
      showMvpNote: true,
      mvpNote: "the MVP is all Must Have",
      categories: {
        "Personal Coaching": { icon: "MessageCircleHeart" },
        Personalisation: { icon: "SlidersHorizontal" },
        "Group Context": { icon: "Users" },
        Monetisation: { icon: "BadgeDollarSign" },
        "Analytics & Intelligence": { icon: "ChartNoAxesCombined" },
        "Trust & Safety": { icon: "ShieldCheck" },
      },
      priorities: {
        "Must Have": { icon: "Check" },
        "Should Have": { icon: "Contrast" },
        "Could Have": { icon: "Minus" },
        "Won’t Have": { icon: "X" },
      },
      priorityOrder: ["Must Have", "Should Have", "Could Have", "Won’t Have"],
      releases: [
        {
          name: "MVP V0.1",
          style: "mvp",
          summaryPhrase: "in the MVP",
          cards: [
            { text: "Trip-scoped financial coaching conversations (1:1 WhatsApp thread)", category: "Personal Coaching", priority: "Must Have" },
            { text: "Proactive nudges before/during/after a trip or financial event", category: "Personal Coaching", priority: "Must Have" },
            { text: "Explicit profile memory disclosure and consent flow", category: "Personalisation", priority: "Must Have" },
            { text: "User-visible memory summary (“here’s what I remember about you”)", category: "Personalisation", priority: "Must Have" },
            { text: "Expense splitting in group WhatsApp chats", category: "Group Context", priority: "Must Have" },
          ],
        },
        {
          name: "V0.2",
          style: "v02",
          summaryPhrase: "in V0.2",
          cards: [
            { text: "Referral CTR and conversion tracking", category: "Monetisation", priority: "Won’t Have" },
            { text: "Situational card recommendations in group context", category: "Group Context", priority: "Should Have" },
            { text: "Cohort analysis by beachhead segment (recent immigrants, students)", category: "Analytics & Intelligence", priority: "Should Have" },
            { text: "Settlement view (who owes whom)", category: "Group Context", priority: "Should Have" },
            { text: "Photo receipt capture and parsing", category: "Personal Coaching", priority: "Should Have" },
          ],
        },
        {
          name: "V1.0",
          style: "v10",
          summaryPhrase: "in V1.0",
          cards: [
            { text: "Voice-note expense logging", category: "Personal Coaching", priority: "Could Have" },
            { text: "Third-party privacy audit and public report", category: "Trust & Safety", priority: "Could Have" },
            { text: "Behavioral signal pipeline (no self-reported micro-surveys)", category: "Analytics & Intelligence", priority: "Could Have" },
            { text: "LLM quality and hallucination monitoring", category: "Trust & Safety", priority: "Could Have" },
            { text: "Budget setting and tracking per trip/goal", category: "Personalisation", priority: "Should Have" },
          ],
        },
        {
          name: "Out of Scope (Won’t have)",
          style: "out",
          summaryPhrase: "out of scope",
          cards: [
            { text: "Partner offer personalisation based on profile memory", category: "Monetisation", priority: "Won’t Have" },
            { text: "In-product financial transactions (transfers, purchases)", category: "Monetisation", priority: "Won’t Have" },
          ],
        },
      ],
    },
    productAnalytics: {
      subLabel: "03. Product Analytics",
      intro: "Why the product exists, who it serves, and the metrics that show whether it is working.",
      rationale: {
        label: "PRODUCT RATIONALE",
        items: [
          { icon: "Compass", text: "Real world utility beyond social and content" },
          { icon: "CircleDollarSign", text: "Defensible new revenue stream without becoming a regulated financial entity" },
          { icon: "LayoutTemplate", text: "Demonstrate Meta’s capability to extend WhatsApp into life-utility categories, setting a template for future products" },
          { icon: "Handshake", text: "Address Meta’s brand-trust deficit in finance through the No-Authority Zone principle" },
        ],
      },
      goal: {
        label: "COMPANY GOAL",
        tag: { text: "Engagement", icon: "Target" },
        text: "Distribution is solved at Meta-scale; The real question is whether users *engage* with the AI when given the option. If group chats invoke @Mint regularly and users opt into the 1:1 personal coach, growth and monetization follow naturally.",
        lifecycle: {
          label: "LIFECYCLE FOCUS",
          steps: ["Growth", "Engagement", "Retention", "Monetisation"],
          focus: "Engagement",
          focusNote: "Our focus",
          focusSrText: "Focus:",
        },
      },
      competitors: {
        label: "COMPETITORS",
        groups: [
          { label: "", names: ["Cleo"] },
          { label: "", names: ["Splitwise", "CreditKarma", "ChatGPT"] },
          { label: "", names: ["Reddit", "Instagram"] },
        ],
      },
      users: {
        label: "WHO IT SERVES",
        jobLabel: "JOB TO BE DONE",
        journeyLabel: "SUCCESS JOURNEY",
        metamintSrText: "MetaMint does this step",
        items: [
          {
            label: "USER 1",
            title: "Trip Planners, Organizers",
            icon: "ClipboardList",
            job: ["Split a shared expense (Airbnb, group dinner, rent) fairly and fast without leaving the chat or doing mental math"],
            steps: [
              { text: "Open the app" },
              { text: "Put a message (e.g. Check out this AirBnB link)" },
              { text: "Prompt Metamint, @Mint - Add this AirBnB to our group expenses" },
              { text: "MetaMint creates a group expense table", metamint: true },
            ],
          },
          {
            label: "USER 2",
            title: "The group members",
            icon: "Users",
            job: ["Privately figure out how to afford their share of the trip", "Pick the right card for their share of trip-related purchases"],
            steps: [
              { text: "Open the App" },
              { text: "Prompt MetaMint, @Mint - which is the best card to use for this purchase" },
              { text: "MetaMint looks for relevant deals and promotions and suggests promptly", metamint: true },
            ],
          },
        ],
      },
      metrics: {
        label: "HOW SUCCESS IS MEASURED",
        northStar: {
          label: "NORTH STAR METRIC",
          title: "Decision Events per Active User per Month",
          icon: "Star",
          chips: [
            { icon: "Split", text: "Split confirmed" },
            { icon: "CreditCard", text: "Card Recommendation" },
            { icon: "ArrowLeftRight", text: "Settlement completed" },
            { icon: "MessageCircleHeart", text: "Personal Coach" },
          ],
          srText: "Decision Events per Active User per Month (Split confirmed, Card Recommendation, Settlement completed, Personal Coach)",
        },
        focusPill: "Primary focus",
        groups: [
          { icon: "TrendingUp", label: "GROWTH METRICS", items: ["First Meaningful Interaction (FMI) Rate", "Group Activation Rate"] },
          { icon: "MessagesSquare", label: "ENGAGEMENT METRICS", items: ["Group Chat Sessions per Activated Group per Month", "1:1 Activation Rate", "AI Conversation Depth"], focus: true },
          { icon: "BadgeDollarSign", label: "MONETISATION METRICS", items: ["Referral Click-Through rate", "Partner Referral Revenue"] },
        ],
      },
    },
    solutionDemo: {
      videosSubLabel: "01. See it in action",
      videos: [
        {
          tag: "Product Vision",
          tagStyle: "dashed",
          title: "Money Coach",
          placeholderLabel: "[Money Coach video coming soon]",
          ariaLabel: "Money Coach video",
          videoUrl: "",
          poster: "",
          text: "Designed the broader Money Coach experience, spanning trip planning, savings goals, spending guidance, and contextual card recommendations.",
        },
        {
          tag: "Working Prototype",
          tagStyle: "solid",
          title: "Group Expense Tracking",
          placeholderLabel: "[Group expense tracking video coming soon]",
          ariaLabel: "Group expense tracking video",
          videoUrl: "",
          poster: "",
          text: "Built a working prototype that uses AI to classify expense-related inputs, extract receipt details, and interpret user intent, with deterministic code handling expense splitting and balance tracking.",
        },
      ],
      diagram: {
        subLabel: "02. How group expense tracking works",
        intro: "Each box shows what it does, then what it is built on.",
        srText: "A receipt image goes through an image classifier and extraction, and a chat message goes through an intent classifier. Their results feed normalization, the split engine, planned state, and budget, which run through a Flask backend and pipeline into a WhatsApp-style prototype. An eval harness scores the classifier, extraction, and intent steps.",
        groups: [
          { id: "inputs", label: "INPUTS" },
          { id: "ai", label: "AI STEPS" },
          { id: "code", label: "DETERMINISTIC CODE" },
          { id: "backend", label: "BACKEND AND UI" },
          { id: "eval", label: "EVALUATION" },
        ],
        boxes: [
        { id: "receipt", type: "io", tag: "Input", name: "Receipt image", description: "Photo or screenshot", stack: "", icon: "Image", row: 1, column: 1, group: "inputs" },
        { id: "chat", type: "io", tag: "Input", name: "Chat message", description: "Text in the group chat", stack: "", icon: "MessageSquare", row: 1, column: 4, group: "inputs" },
        { id: "classifier", type: "ai", tag: "AI", name: "Image classifier", description: "Process or ignore", stack: "Anthropic API (vision)", icon: "Sparkles", row: 2, column: 1, group: "ai" },
        { id: "extraction", type: "ai", tag: "AI", name: "Extraction", description: "Totals, line items", stack: "Anthropic API (vision)", icon: "Sparkles", row: 2, column: 2, group: "ai" },
        { id: "intent", type: "ai", tag: "AI", name: "Intent classifier", description: "5 intent types", stack: "Anthropic API (text)", icon: "Sparkles", row: 2, column: 4, group: "ai" },
        { id: "normalization", type: "code", tag: "Code", name: "Normalization", description: "Standard expense", stack: "Python", icon: "Braces", row: 3, column: 1, group: "code" },
        { id: "split", type: "code", tag: "Code", name: "Split engine", description: "Who owes whom", stack: "Python, AI item matching", icon: "Braces", row: 3, column: 2, group: "code" },
        { id: "planned", type: "code", tag: "Code", name: "Planned state", description: "Status tracking", stack: "Python, swipe-to-reply", icon: "Braces", row: 3, column: 3, group: "code" },
        { id: "budget", type: "code", tag: "Code", name: "Budget", description: "Spent and left", stack: "Python (budget.py)", icon: "Braces", row: 3, column: 4, group: "code" },
        { id: "flask", type: "io", tag: "Backend", name: "Flask backend and pipeline", description: "app.py and pipeline.py", stack: "Python, Flask", icon: "Server", row: 4, column: 1, colSpan: 4, group: "backend" },
        { id: "prototype", type: "io", tag: "UI", name: "WhatsApp-style prototype", description: "Group chat, Me chat, tracker", stack: "HTML and JavaScript", icon: "Smartphone", row: 5, column: 1, colSpan: 4, group: "backend" },
        { id: "evals", type: "eval", tag: "Eval", name: "Eval harness", description: "Scores classifier, extraction, intent", stack: "run_evals.py, labeled test folders", icon: "FlaskConical", row: 6, column: 1, colSpan: 4, group: "eval" },
        ],
        connections: [
          { from: "receipt", to: "classifier" },
          { from: "classifier", to: "extraction" },
          { from: "extraction", to: "normalization" },
          { from: "chat", to: "intent" },
          { from: "intent", to: "planned" },
          { from: "normalization", to: "split" },
          { from: "split", to: "planned" },
          { from: "planned", to: "budget" },
          { from: "normalization", to: "flask" },
          { from: "split", to: "flask" },
          { from: "planned", to: "flask" },
          { from: "budget", to: "flask" },
          { from: "flask", to: "prototype" },
        ],
        legend: [
          { type: "ai", icon: "Sparkles", tag: "AI", label: "AI (Anthropic API)" },
          { type: "code", icon: "Braces", tag: "Code", label: "Deterministic code" },
          { type: "io", icon: "Server", tag: "Input", label: "Input, backend, UI" },
        ],
      },
    },
    keyDecision: {
      subLabel: "03. One key engineering decision",
      headline: "AI interprets. Code calculates.",
      challenge: {
        label: "THE CHALLENGE",
        icon: "Lightbulb",
        text: "Expense messages and receipts are messy and unpredictable, but financial calculations need to be consistent.",
      },
      decision: {
        label: "THE DECISION",
        text: "I separated AI interpretation from deterministic financial logic. AI handles the ambiguous inputs (classifying images, extracting receipt details, and interpreting expense intent), while code handles expense normalization, bill splitting, and balance updates.",
        lanes: {
          ai: {
            icon: "Sparkles",
            label: "AI INTERPRETS",
            subtitle: "Messy, ambiguous inputs",
            rows: [
              { icon: "ScanSearch", text: "Classifying images" },
              { icon: "ReceiptText", text: "Extracting receipt details" },
              { icon: "MessageSquareQuote", text: "Interpreting expense intent" },
            ],
          },
          code: {
            icon: "Braces",
            label: "CODE CALCULATES",
            subtitle: "Consistent financial logic",
            rows: [
              { icon: "Scale", text: "Expense normalization" },
              { icon: "Split", text: "Bill splitting" },
              { icon: "Wallet", text: "Balance updates" },
            ],
          },
        },
        handoff: { note: "structured expense", showNote: true },
        srText: "AI interprets messy inputs by classifying images, extracting receipt details, and interpreting expense intent. Code then calculates expense normalization, bill splitting, and balance updates.",
      },
      why: {
        label: "WHY IT WORKS",
        text: "This separation makes financial calculations predictable and testable without relying on an LLM to perform money math.",
        showChips: true,
        chips: ["Predictable", "Testable", "No LLM money math"],
      },
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
    showSections: { evaluation: true },
    evaluations: {
      heading: "EVALUATIONS AND RESULTS",
      subSections: [
        {
          kind: "aiReliability",
          subLabel: "01. Evaluating AI reliability",
          intro: [
            "I built a unified evaluation script to test MetaMint’s AI components against labeled examples, covering image relevance classification and message intent classification. For receipt extraction, I reviewed outputs manually, but a labeled test set was not yet available to calculate accuracy.",
            "Rather than optimize for accuracy alone, I examined failure cases to understand where the system could misinterpret financial activity and how those errors should be handled.",
          ],
          cards: [
            {
              icon: "ScanSearch",
              label: "IMAGE RELEVANCE CLASSIFIER",
              counts: METAMINT_EVAL.image,
              unit: "images",
              expectedPercent: "92.0%",
              note: "2 payment-confirmation images missed",
            },
            {
              icon: "MessageSquareText",
              label: "INTENT CLASSIFIER",
              counts: METAMINT_EVAL.intent,
              unit: "messages",
              expectedPercent: "96.6%",
              note: "1 ambiguous expense update missed",
            },
            {
              icon: "ReceiptText",
              label: "RECEIPT EXTRACTION",
              bigText: "Not yet scored",
              countText: "20 line items found on one reviewed receipt; 1 price misread",
              pill: "Manual review",
            },
          ],
          scopeNote: "The classifier scores measure agreement with the labeled test cases, not overall real-world product accuracy.",
        },
        {
          kind: "failureDecision",
          subLabel: "02. One Failure, One Decision",
          cases: [
            {
              tag: "Case 01 · Image classifier",
              title: "When a payment confirmation looks like a personal transfer",
              parts: [
                {
                  icon: "TriangleAlert",
                  label: "THE FAILURE",
                  text: "The classifier first scored 94.1% (16/17 images). After I added more UPI payment screens it fell to 86.4% (19/22), missing bare payment screens where the recipient’s name looked like a person or a code. One prompt revision brought it to 92.0% (23/25).",
                },
                {
                  icon: "Scale",
                  label: "THE DECISION",
                  text: "I checked first that the misses were real, not mislabeled data. I stopped tuning when two ambiguous cases remained, because more changes risked overfitting and wrongly processing genuine personal transfers.",
                },
                {
                  icon: "Lightbulb",
                  label: "THE PRODUCT IMPLICATION",
                  text: "When the classifier is uncertain, the safer behavior is to let the user explicitly request processing rather than automatically treat every payment screen as an expense.",
                },
              ],
              visual: {
                kind: "runs",
                rows: [
                  { label: "Baseline", counts: { correct: 16, total: 17 }, expectedPercent: "94.1%" },
                  { label: "After adding UPI screens", counts: { correct: 19, total: 22 }, expectedPercent: "86.4%" },
                  { label: "After one prompt revision", counts: METAMINT_EVAL.image, expectedPercent: "92.0%", highlight: true },
                ],
                srText: "Three runs: baseline 94.1% (16 of 17 images), after adding UPI screens 86.4% (19 of 22), after one prompt revision 92.0% (23 of 25).",
              },
            },
            {
              tag: "Case 02 · Intent classifier",
              title: "When an expense update lacks context",
              parts: [
                {
                  icon: "TriangleAlert",
                  label: "THE FAILURE",
                  text: "“The Airbnb ended up being 18k” was misclassified because the message alone didn’t make it clear whether the user was reporting a new expense or updating a planned one.",
                },
                {
                  icon: "Scale",
                  label: "THE DECISION",
                  text: "I documented the limitation and relied on the reply-to-planned-expense flow to provide context when users respond directly to the original plan.",
                },
                {
                  icon: "Lightbulb",
                  label: "THE PRODUCT IMPLICATION",
                  text: "The right classification can depend on conversation context, not just the wording of a single message.",
                },
              ],
              visual: {
                kind: "bubble",
                text: "The Airbnb ended up being 18k",
                tags: ["New expense?", "Update to a planned one?"],
                tagIcon: "CircleQuestionMark",
                note: { text: "same words, two meanings", show: true },
              },
            },
          ],
        },
        {
          kind: "evalsShaped",
          subLabel: "03. How the evals shaped the product",
          intro: "Testing the AI was a way to decide how the product behaves when the AI is wrong.",
          findingLabel: "FINDING",
          decisionLabel: "DECISION",
          rows: [
            {
              icon: "UserCheck",
              title: "Act when invited",
              finding: "Two bare UPI screens stayed ambiguous at 92%.",
              decision: "I stopped tuning. If MetaMint ignores a screen, the user can ask it to process it.",
            },
            {
              icon: "ShieldCheck",
              title: "Fail safe",
              finding: "In a finance product, recording something nobody asked for is worse than missing it.",
              decision: "Ambiguous images lean ignore. Ambiguous messages lean informational.",
            },
            {
              icon: "ClipboardCheck",
              title: "Test cases define the product",
              finding: "“Dinner cost us 2,400, but the expense is on me.” has nothing to split.",
              decision: "I relabeled it informational. An expense is something that triggers a split.",
            },
            {
              icon: "Calculator",
              title: "Money math stays in code",
              finding: "Split, ledger, and budget amounts have one right answer.",
              decision: "Plain code computes them, so the evals cover only judgment calls.",
            },
          ],
        },
        {
          kind: "limitsNext",
          subLabel: "04. Limits and what I would do next",
          limits: {
            label: "WHAT THE NUMBERS DO NOT SHOW",
            icon: "CircleAlert",
            items: [
              "Receipt extraction is not scored yet. None of the 14 receipts has expected values.",
              "One price was misread on a 20-item receipt ($17.99 as $7.99). I documented it as a known limitation.",
              "The item matcher, the newest AI call, has no eval set.",
              "No user testing yet.",
            ],
          },
          next: {
            label: "WHAT I WOULD DO NEXT",
            items: [
              "Label the 14 receipts to score extraction.",
              "Add a check that compares the sum of line items to the receipt total.",
              "Build an eval set for the item matcher.",
              "Test with real users.",
            ],
          },
          closing: "Every miss on record has a known cause and a handling decision.",
        },
      ],
    },
    evaluationText: "[Add evaluation and observability content]",
    learningItems: [
      {
        title: "A missed expense beats a wrong one.",
        body: "In a finance product, recording something nobody asked for does more harm than missing it, so when the model is unsure, the product stays quiet.",
      },
      {
        title: "For money, trust comes before personalization.",
        body: "A coach that remembers your finances has to show what it remembers and ask first, so memory consent and a visible summary made the MVP while monetization waited.",
      },
      {
        title: "Let AI judge and code calculate.",
        body: "The model handles messy inputs, while split, ledger, and budget math stay in plain code that can be tested.",
      },
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
