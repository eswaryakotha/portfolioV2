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
  // `videos` (when set) replaces the single video: one titled part per video
  part1: {
    subLabel: string;
    videoUrl?: string;
    videoPoster?: string;
    videos?: Array<{ title: string; text: string; videoUrl: string; poster: string; placeholderLabel: string }>;
  };
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
  showClosing?: boolean; // set to false to hide the principle line
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
  show?: boolean; // set to false to hide the whole Feature Prioritization board
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
    show?: boolean; // set to false to hide the "Who it serves" block
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
    // handwritten margin note with an arrow into the phone (wide screens only); target and labelY are % of the phone frame
    notes?: Array<{ text: string; side: "left" | "right"; target: [number, number]; labelY: number; reach?: number }>;
    textAbove?: boolean; // true = the description sits between the title and the video
    phone?: boolean; // true = portrait video shown inside a phone frame, autoplay, muted, looping
    // several portrait videos in phone frames, 2 per row, each playing only while hovered; an empty videoUrl shows an empty frame
    phoneGridHint?: string; // small line above the grid
    phoneGrid?: Array<{
      videoUrl: string;
      poster: string;
      ariaLabel: string;
      ratio?: [number, number]; // video width and height
      title?: string; // shown under the phone
      caption?: string; // one short line under the title
      notes?: Array<{ text: string; side: "left" | "right"; target: [number, number]; labelY: number; reach?: number }>;
    }>;
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
  // optional phone video under the three parts (autoplay, muted, loop)
  video?: { videoUrl: string; ariaLabel: string; caption: string; ratio?: [number, number] };
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
  segments: Array<{ name: string; text: string }>; // name is shown bold, followed by ":"; empty = no list
  personas: Array<{
    role: string;
    name: string;
    avatar: { src: string; alt: string; width: number; height: number; blend?: boolean };
  }>;
  rows: Array<{ label: string; hidden?: boolean; cells: Array<string | string[]> }>; // string[] = bullet list; hidden: true skips the row
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
  showDetails?: boolean; // set to false to hide the intro line, the stat strip and the four cards below the video
  videoNote?: string; // small note shown right below the video (or below the clips)
  // short clips (muted, looping, autoplay) shown instead of the single video; each has a label and a line of text
  clips?: Array<{
    title: string;
    text: string;
    videoUrl: string;
    poster?: string;
    crop?: { width: number; height: number; top: number; bottom?: number };
    // handwritten margin notes with an arrow into the clip (wide screens only); target and labelY are % of the clip frame
    notes?: Array<{ text: string; side: "left" | "right"; target: [number, number]; labelY: number; reach?: number }>;
  }>;
  videoCrop?: { width: number; height: number; top: number }; // .mp4 size and blank rows to cut from its top
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
  // video shown after "first"; replaces the "communicating" screenshots when those are hidden
  second?: { videoUrl: string; poster: string; placeholderLabel: string; ariaLabel: string; caption?: string; tags?: string[] };
  communicating: {
    show?: boolean; // set to false to hide the "Communicating the product" heading and screenshots
    subLabel: string;
    // src is a path under /public; a missing file shows the dashed placeholder
    blocks: Array<{ src: string; alt: string; width?: number; height?: number; placeholderLabel: string; caption: string }>;
  };
  contribution: { show?: boolean; label: string; text: string }; // show: false hides the callout box
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
  showChips?: boolean; // set to false to hide the three outcome chips
  chips: Array<{ icon: string; text: string }>; // lucide-react icon names
  showClosing?: boolean; // set to false to hide the closing statement
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
  heroVideo?: { src: string; poster: string; label: string }; // silent looping video at the top of the page
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
    heroVideo: { src: "/dolby/hero.mp4", poster: "/dolby/hero-poster.jpg", label: "Dolby Labs case study highlight video" },
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
        videos: [
          {
            title: "01. Narration Studio & Features",
            text: "Explore the narration workspace and its tools designed to help authors prepare and manage their audiobook recordings.",
            videoUrl: "/dolby/narration-studio.mp4",
            poster: "",
            placeholderLabel: "[Narration Studio video coming soon]",
          },
          {
            title: "02. AI-Powered Narration Guidance",
            text: "Review AI-generated narration recommendations, adjust emotional direction, and prepare to bring the manuscript to life.",
            videoUrl: "/dolby/ai-narration-guidance.mp4",
            poster: "",
            placeholderLabel: "[AI narration guidance video coming soon]",
          },
          {
            title: "03. Recording & Audio Enhancement",
            text: "Record the narration using the guided teleprompter, refine mistakes with punch-and-roll, and compare the original recording with the studio-enhanced audio.",
            videoUrl: "/dolby/recording-audio-enhancement.mp4",
            poster: "",
            placeholderLabel: "[Recording and enhancement video coming soon]",
          },
        ],
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
    heroVideo: { src: "/veraai/hero.mp4", poster: "/veraai/hero-poster.jpg", label: "VeraAI case study highlight video" },
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
      showClosing: false,
      closing: {
        bold: "The principle:",
        rest: " give remodelers a high-confidence starting point that they could use to move the project forward.",
      },
    },
    personas: {
      subLabel: "02. Segmentation & Targeting",
      intro:
        "VeraAI served three key stakeholder groups across the kitchen remodeling journey: homeowners, business account owners, and project specialists. Each had distinct needs, but project specialists were prioritized for the initial MVP.",
      segments: [],
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
        { label: "Resource Constraints", hidden: true, cells: [
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
          calloutLabel: "What we learnt",
          calloutText: "The concept was already widely available, making differentiation difficult.",
          status: "dropped",
          statusLabel: "Dropped",
          icon: "LayoutTemplate",
        },
        {
          label: "Pivot 2",
          title: "Layering catalog items onto kitchen photos",
          body: "We explored segmenting kitchen photos and overlaying catalog materials to help homeowners visualize changes.",
          calloutLabel: "What we learnt",
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
      showDetails: false,
      videoNote: "*Clips are directly from the VeraAI website",
      clips: [
        {
          title: "Measurements to rough sketch",
          text: "As the measurements are filled in, a rough sketch of the layout appears on the right, before the layout is generated.",
          videoUrl: "/veraai/pilot-clip-1.mp4",
          crop: { width: 1920, height: 1080, top: 111, bottom: 47 },
        },
        {
          title: "Materials, vendors and the NKBA layout",
          text: "Details such as the cabinets and countertop are added, along with the vendors to source materials from, so the 3D rendering and quotation can follow. Once the measurements and vendor details are in, the layout diagram appears, aligned to NKBA rules.",
          videoUrl: "/veraai/pilot-clip-2.mp4",
          crop: { width: 1920, height: 1080, top: 111, bottom: 47 },
          notes: [{ text: "Layout aligned as per NKBA rules", side: "left", target: [21, 58], labelY: 40, reach: 90 }],
        },
        {
          title: "Realistic 3D rendering",
          text: "A realistic 3D rendering is generated from the measurements and layout information, using the materials chosen from the vendor information, so it reflects exactly those choices and lets you visualize what the kitchen will look like.",
          videoUrl: "/veraai/pilot-clip-3.mp4",
          crop: { width: 1920, height: 1080, top: 111, bottom: 47 },
          notes: [{ text: "Rendered from materials and textures chosen", side: "right", target: [79, 52], labelY: 38, reach: 90 }],
        },
        {
          title: "Bill of materials and quotation",
          text: "A bill of materials and quotation are built from the vendors and materials finalized. Once the quote is ready and every adjustment is made, a formal quotation is generated, which can be sent as a PDF for the homeowner’s review.",
          videoUrl: "/veraai/pilot-clip-4.mp4",
          crop: { width: 1920, height: 1080, top: 111, bottom: 47 },
        },
      ],
      videoUrl: "/veraai/pilot-demo.mp4",
      videoCrop: { width: 1920, height: 1080, top: 107 },
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
        videoUrl: "/veraai/website-walkthrough.mp4",
        poster: "/veraai/website-walkthrough-poster.jpg", // the frame at 5 seconds; playback still starts at 0
        placeholderLabel: "[Website walkthrough video, 10–20 seconds]",
        caption:
          "A look at the first draft of VeraAI’s website, from the homepage and value proposition to the presentation of its product capabilities.",
        tags: ["Website design and frontend development", "Early draft"],
      },
      second: {
        videoUrl: "/veraai/website-kitchen.mp4",
        poster: "/veraai/website-kitchen-poster.jpg", // the frame at 17 seconds; playback still starts at 0
        placeholderLabel: "[Kitchen video coming soon]",
        ariaLabel: "VeraAI website kitchen video",
        caption: "This was an actual three.js experiment I did on an actual JSON file from real contractor measurements.",
        tags: ["Three.js experiment", "Real contractor measurements"],
      },
      communicating: {
        show: false,
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
        show: false,
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
    learningsHeading: "What I learnt",
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
    heroVideo: { src: "/metamint/hero.mp4", poster: "/metamint/hero-poster.jpg", label: "MetaMint case study highlight video" },
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
      showChips: false,
      chips: [
        { icon: "Eye", text: "Track what she spends" },
        { icon: "CalendarCheck", text: "Plan what she can afford" },
        { icon: "Lightbulb", text: "Make more informed decisions" },
      ],
      showClosing: false,
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
      show: false,
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
        show: false,
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
          videoUrl: "/metamint/money-coach.mp4",
          poster: "",
          phone: true,
          textAbove: true,
          notes: [{ text: "Money Coach, right inside the chat", side: "right", target: [60, 38], labelY: 34, reach: 62 }],
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
          textAbove: true,
          phoneGridHint: "Hover over a screen to see its video play (tap on a touch screen).",
          phoneGrid: [
            {
              videoUrl: "/metamint/group-expense-1.mp4",
              title: "01. Equal Expense Splitting",
              caption: "MetaMint extracts the bill details and automatically splits the total equally among group members.",
              poster: "/metamint/group-expense-1-poster.jpg", // the 14 second mark
              ariaLabel: "Group expense tracking video 1 of 6: a brunch bill is split equally among the group",
              ratio: [848, 1802],
              notes: [{ text: "1. Brunch bill split equally among the group", side: "left", target: [45, 76], labelY: 66, reach: 70 }],
            },
            {
              videoUrl: "/metamint/group-expense-2.mp4",
              title: "02. Itemized Expense Splitting",
              caption: "Members can split a bill based on individual items rather than dividing the total equally.",
              poster: "/metamint/group-expense-2-poster.jpg", // the 9 second mark
              ariaLabel: "Group expense tracking video 2 of 6: the bill is split Dutch style, item by item",
              ratio: [848, 1802],
              notes: [{ text: "2. Or split it Dutch style, item by item", side: "right", target: [60, 70], labelY: 62, reach: 70 }],
            },
            {
              videoUrl: "/metamint/group-expense-3.mp4",
              title: "03. Intelligent Expense Filtering",
              caption: "MetaMint distinguishes relevant restaurant and grocery bills from personal images and unrelated content, ignoring inputs that shouldn't be tracked.",
              poster: "/metamint/group-expense-3-poster.jpg", // the 6 second mark
              ariaLabel: "Group expense tracking video 3 of 6: a personal payment sent to the group is not detected as a shared expense and is left out",
              ratio: [848, 1802],
              notes: [{ text: "3. Personal bills sent to the group are left out", side: "left", target: [18, 82], labelY: 74, reach: 70 }],
            },
            {
              videoUrl: "/metamint/group-expense-4.mp4",
              title: "04. UPI Payment Recognition",
              caption: "MetaMint recognizes UPI payment confirmations made to businesses and converts eligible payments into equally split group expenses.",
              poster: "/metamint/group-expense-4-poster.jpg", // the 8 second mark
              ariaLabel: "Group expense tracking video 4 of 6: a UPI receipt with no line items is split equally among the group",
              ratio: [848, 1802],
              notes: [{ text: "4. UPI receipts with no line items split equally", side: "right", target: [55, 76], labelY: 70, reach: 70 }],
            },
            {
              videoUrl: "/metamint/group-expense-5.mp4",
              title: "05. Personal Budget Tracking",
              caption: "Users can track their spending, monitor remaining budgets, and view their financial position directly in their personal chat.",
              poster: "/metamint/group-expense-5-poster.jpg", // the 14 second mark
              ariaLabel: "Group expense tracking video 5 of 6: in a personal chat, MetaMint shows the trip budget, how much is spent and who owes what",
              ratio: [848, 1802],
              notes: [{ text: "5. Budget, spend and who owes you, in your own chat", side: "left", target: [30, 43], labelY: 46, reach: 70 }],
            },
            {
              videoUrl: "/metamint/group-expense-6.mp4",
              title: "06. Planned Expense Tracking",
              caption: "Users can mention an upcoming expense, track it as planned, and confirm it once the transaction actually happens.",
              poster: "/metamint/group-expense-6-poster.jpg", // the 16 second mark
              ariaLabel: "Group expense tracking video 6 of 6: a planned flight expense is tracked, then confirmed and added to who owes whom",
              ratio: [848, 1802],
              notes: [{ text: "6. Plan an expense, then confirm it to add it to who owes whom", side: "right", target: [55, 72], labelY: 66, reach: 70 }],
            },
          ],
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
              video: {
                videoUrl: "/metamint/restaurant-not-recognized.mp4",
                ariaLabel: "A UPI payment to a restaurant that MetaMint does not recognize as a restaurant from its name, so it replies that it won't process it",
                caption: "A restaurant payment that MetaMint did not recognize as a restaurant from its name.",
                ratio: [848, 1802],
              },
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

// ---------------------------------------------------------------------------
// Homepage book (interactive 3D book at "/"). All text and settings live here.
// ---------------------------------------------------------------------------

/** The book reads each project's hero video from that project's case study entry
    (caseStudies[slug].heroVideo), so the book and the case study hero always use the same
    file. `src` is the mp4. With no src, the book shows the dashed placeholder instead. */
export type BookVideo = { src: string; poster: string; label: string };

type BookSpreadBase = {
  id: string; // URL hash, e.g. /#metamint
  name: string; // announced to screen readers
  label: string; // small monospace label on the page
  tab?: string; // bookmark tab / dot label (omit for no jump target)
};

export type BookAboutSpread = BookSpreadBase & {
  type: "about";
  photoPlaceholder: string;
  intro: string;
  cta: { label: string; href: string };
};

/** A piece of text placed on a book page. Blocks stack from the page's top-left corner, in
    order. sizePx is the size on a full-size desktop page (about 530px wide); on smaller
    screens it scales down with the page. */
export type BookTextBlock = {
  kind?: "text";
  text: string;
  tag?: "h2" | "h3" | "p"; // the HTML element (for screen readers); default p
  font?: "advercase" | "sans" | "mono" | "handwriting";
  sizePx?: number;
  weight?: number;
  color?: string;
  caps?: boolean; // small caps style label: uppercase with wide letter spacing
  oneLine?: boolean; // never wraps; may run across the fold (first block of a left page only)
  offsetYPx?: number; // move it down (or up, if negative) from where it would sit
};

/** A bulleted list on a page. */
export type BookListBlock = {
  kind: "list";
  items: string[]; // **text** is bold
  sizePx?: number;
  color?: string;
  offsetYPx?: number;
};

/** A box drawn on the page that holds other blocks. */
export type BookBoxBlock = {
  kind: "box";
  children: (BookTextBlock | BookListBlock)[];
  dashed?: boolean;
  tiltDeg?: number; // a slight rotation; negative tilts it anticlockwise
  widthPx?: number;
  minHeightPx?: number; // leaves room under the last item
  borderColor?: string;
  offsetYPx?: number;
};

export type BookBlock = BookTextBlock | BookListBlock | BookBoxBlock;

export type BookCaseStudySpread = BookSpreadBase & {
  type: "case-study";
  slug: string;
  href: string;
  title: string;
  hook: string;
  results: string[];
  cta: string;
  videoPlaceholder: string;
  heroVideo?: BookVideo; // the same object as caseStudies[slug].heroVideo
  accent: string; // pull tab colour, from the project's case study entry
  pageTint: string; // the pages get a light pastel of this (the project's brighter accent)
  pageColor?: string; // set to use this exact page colour instead of the mixed pastel
  leftPage?: BookBlock[]; // when set, the left page shows these instead of the title, hook and results
  keyImpact?: { label: string; items: string[]; ink?: string; footnote?: string }; // paper notes under the video, across the spread; **text** is bold
  stickyNote?: { label: string; text: string; color: string; ink?: string; textSizePx?: number }; // beside the video on the right page
  polaroid?: BookPolaroid; // taped photo near the right page's top-right corner
};

/** An instant photo taped to a page. Leave image empty to show the placeholder. */
export type BookPolaroid = {
  image?: string; // path under /public, for example "/veraai/polaroid.jpg"
  alt?: string; // what the photo shows, for screen readers (needed once there is an image)
  caption?: string; // optional handwritten caption in the bottom margin
  position?: string; // which part of the image the square shows (CSS object-position)
  zoom?: number; // 1 = fits the frame; above 1 zooms in
  placeholder: string;
};

/** "My Playground": side projects and life outside work (was the Experiments spread). */
export type BookPlaygroundPhoto = { src: string; alt: string; caption: string };
export type BookPlaygroundVideo = { src: string; caption: string; madeWith: string };
export type BookExperimentsSpread = BookSpreadBase & {
  type: "experiments";
  heading: string;
  intro: string;
  photos: BookPlaygroundPhoto[]; // left page, as small tilted prints with handwritten captions
  videos: BookPlaygroundVideo[]; // right page, play while the spread is open
};

/** The last spread: "Contact" on the left page (was "Coming soon"); the back board's inside
    is its right page. */
/** a contact card; leave href empty to show the card without a link until it is ready */
export type BookContactLink = {
  kind: "email" | "linkedin" | "resume";
  label: string;
  value: string;
  href: string;
};
export type BookComingSoonSpread = BookSpreadBase & {
  type: "coming-soon";
  heading: string;
  /** heading size in px at the book's full size */
  headingSizePx: number;
  /** a small handwritten aside after the heading */
  headingAside?: string;
  /** pin the aside above the end of this word in the heading (else it follows the heading) */
  headingAsideAfter?: string;
  links: BookContactLink[];
};

export type BookSpread =
  | BookAboutSpread
  | BookCaseStudySpread
  | BookExperimentsSpread
  | BookComingSoonSpread;

/** The live back-cover scene on the last spread's right page (BackCoverScene). */
export type SkyCondition = "clear" | "partly-cloudy" | "cloudy" | "rain";
export type BackCoverSettings = {
  sketch: {
    src: string; // empty shows a dashed placeholder
    width: number; // the file's real size, in px
    height: number;
    alt: string;
    placeholder: string;
  };
  /** the sketch's background, sampled from its corners; the page takes it when it is
      within 8 levels per channel of the board colour, so the image has no visible edge */
  sketchBg: string;
  chalk: string; // stroke colour of the sky, matched to the sketch's lines
  location: { name: string; landmark: string; lat: number; lon: number };
  refreshMinutes: number;
  rainCount: number;
  starCount: number;
  credit: { text: string; href: string };
  /** handwritten line at the top: {word} is filled in from the sky */
  caption: {
    template: string;
    words: Record<"sunny" | "rainy" | "cloudy" | "clear", string>;
  };
  /** phrases for the scene's accessible name */
  label: {
    template: string; // {landmark}, {name} and {sky} are filled in
    sky: Record<"clear-day" | "clear-night" | "partly-cloudy" | "cloudy" | "rain", string>;
  };
};

/** The ID card in its desk holder (IdCardHolder). Content: */
export type IdCardData = {
  company: string;
  name: string;
  role: string;
  idNumber: string;
  photo: string; // path under /public; empty shows the accent panel with a placeholder
  photoAlt: string;
  photoPlaceholder: string;
  ui: {
    takeOut: string; // the card's button while it sits in the holder
    putBack: string; // the card's button while it is out
    srLine: string; // one visually hidden line; {name}, {role}, {company} are filled in
    hint: string; // handwritten note shown once per session
    caption: string; // small line under the slot
  };
};
/** How the ID card and holder are sized and move. Shares are of the card height unless noted. */
export type IdCardSettings = {
  cardAspect: number; // width to height
  cardHeight: number; // share of the page height
  seat: number; // share of the card height inside the holder's groove
  restLean: number; // deg the card leans back at rest
  liftUp: number; // card heights the card rises when it comes out
  outScale: number;
  outZ: number; // px toward the viewer when out
  headerClearance: number; // px kept below the site header when out
  cardThickness: number; // px (one edge layer per px)
  tiltMax: number; // deg of pointer tilt on each axis when out
  sheen: boolean;
  hint: boolean;
  autoShowMs: number; // when the spread opens, the card comes out by itself for this long (0: off)
  liftMs: number;
  returnMs: number;
  reducedMs: number; // lift and return with reduced motion: a plain slide
  colors: {
    card: string; // the card's paper
    edge: string; // its thickness, seen at the edges as it tilts
    ink: string; // text, frame, arrow and barcode
    accent: string; // the photo frame's fill and the role pill
    accentInk: string; // text on the accent
  };
};

type BookCaseStudyExtras = Pick<
  BookCaseStudySpread,
  "pageColor" | "leftPage" | "keyImpact" | "stickyNote" | "polaroid"
>;

const bookCaseStudy = (
  id: string,
  name: string,
  label: string,
  tab: string,
  extras: BookCaseStudyExtras = {},
): BookCaseStudySpread => ({
  type: "case-study",
  id,
  name,
  label,
  tab,
  slug: id,
  href: `/work/${id}`,
  title: "[Case study title]",
  hook: "[One-line hook]",
  results: ["[Key result 1]", "[Key result 2]"],
  cta: "View case study",
  videoPlaceholder: "[Video, 25s]",
  // one source of truth per project: the case study's own hero video and accent
  heroVideo: caseStudies[id]?.heroVideo,
  accent: caseStudies[id]?.accent ?? ACCENTS.dolby,
  pageTint: caseStudies[id]?.accentBright ?? caseStudies[id]?.accent ?? ACCENTS.dolby,
  ...extras,
});

/** The case-study spread template: company name top left, a tilted dashed box with role,
    timeline and skills, "Key impact" notes under the video, a sticky note beside it and a
    taped photo in the top-right corner. `ink` is the project's tab colour (used for the
    company name); `smallInk` is used for the small labels and handwriting, and defaults to
    `ink` (set it darker when the tab colour is too light for small text). */
const caseStudyPages = (o: {
  company: string;
  companyOneLine?: boolean; // keep the company name on one line, running across the fold if needed
  role: string;
  roleNote?: string; // a small line under the role
  timeline: string;
  ink: string;
  smallInk?: string;
  stickyColor: string;
  photo?: string;
  photoAlt?: string;
  photoCaption?: string; // handwritten in the white space under the photo
  photoPosition?: string; // which part of the image the square shows, e.g. "left center"; default the middle
  photoZoom?: number; // zoom into the photo, e.g. 1.2 shows it 20% larger (cropped to the frame)
  keyImpacts?: string[];
  keyImpactFootnote?: string; // small print inside the note whose text has the * mark
  skills?: string[];
  learned?: string;
  learnedSizePx?: number; // handwriting size on the sticky note, if the text is long
}): BookCaseStudyExtras => {
  const small = o.smallInk ?? o.ink;
  const label = (text: string, offsetYPx?: number): BookTextBlock => ({
    text,
    font: "mono",
    sizePx: 11,
    caps: true,
    color: small,
    offsetYPx,
  });
  // role and timeline: the same size as the skills list
  const value = (text: string): BookTextBlock => ({ text, font: "sans", sizePx: 14, offsetYPx: 4 });
  return {
    leftPage: [
      {
        text: o.company,
        tag: "h2",
        font: "advercase",
        sizePx: 40,
        color: o.ink,
        offsetYPx: 15,
        oneLine: o.companyOneLine,
      },
      {
        kind: "box",
        dashed: true,
        tiltDeg: -2,
        widthPx: 200, // stays clear of the video on this page
        minHeightPx: 250, // room under Skills for what goes there next
        borderColor: small,
        offsetYPx: 14,
        children: [
          label("Role"),
          value(o.role),
          ...(o.roleNote
            ? [{ text: o.roleNote, font: "sans" as const, sizePx: 11, color: "#6E6651", offsetYPx: 3 }]
            : []),
          label("Timeline", 16),
          value(o.timeline),
          label("Skills", 16),
          ...(o.skills?.length
            ? [{ kind: "list" as const, items: o.skills, sizePx: 14, offsetYPx: 5 }]
            : []),
        ],
      },
    ],
    keyImpact: {
      label: "Key impact",
      items: o.keyImpacts ?? ["[Key impact 1]", "[Key impact 2]", "[Key impact 3]"],
      ink: small,
      footnote: o.keyImpactFootnote,
    },
    stickyNote: {
      label: "What I learnt",
      text: o.learned ?? "[One main thing I learnt]",
      color: o.stickyColor,
      ink: small,
      textSizePx: o.learnedSizePx,
    },
    polaroid: {
      image: o.photo ?? "",
      alt: o.photoAlt ?? "",
      caption: o.photoCaption,
      position: o.photoPosition,
      zoom: o.photoZoom,
      placeholder: "[Photo]",
    },
  };
};

export const book = {
  settings: {
    // scope
    mobileBook: false, // false: below 900px show the stacked list instead of the book
    desktopOnlyQuery: "(min-width: 900px)", // where the book shows when mobileBook is false
    // Mobile book only (unused while mobileBook is false). Mirrors CSS in components/book/book.css
    desktopQuery: "(min-width: 900px), (orientation: landscape) and (max-height: 500px)",
    mobileClosedCoverVw: 70, // closed cover width on mobile, % of viewport

    // size and layout
    bookAspect: 1.7, // open spread width to height
    bookScale: 0.85, // the book is drawn at this share of the largest size that fits
    maxBookWidthVw: 94,
    maxBookWidthPx: 1500,
    stageGapPx: 48, // stage height minus this, times bookAspect, also caps the width
    sideArrows: true,
    sideArrowWidthPx: 72,
    sideArrowSpacePx: 96, // reserved on each side of the open book so arrows never overlap it

    // state
    startClosed: true, // no hash means closed; a hash opens straight to that spread

    // object
    showThickness: false, // solid page blocks behind the pages; only visible with a tilt
    bookThickness: 0.09, // closed book depth as a share of the cover height
    coverThickness: 1.5, // front cover and back board, in units where an inner leaf is 1
    edgeShade: 0.08, // edge faces get at most this much darker toward the rear
    cornerRadiusOfWidth: 0.03, // outer corner radius, share of the open spread width
    cornerRadiusMinPx: 10,
    cornerSegments: 4, // flat facets used to round each corner of the edge faces
    hideDelayMs: 1400, // pages leaving the open spread stay painted this long, then are hidden

    // view
    perspectiveOfWidth: 4, // camera distance as a multiple of the open width; at 4 a turning page's corners grow about 14%, which stays inside the stage at every size
    tiltClosed: { x: 0, y: 0 }, // degrees; flat. Was { x: 4, y: -14 }
    tiltOpen: { x: 0, y: 0 }, // flat. Was { x: 6, y: -1.5 }
    tiltMs: 700, // also the open and close slide
    perspectiveOriginClosed: 0, // 0.25 moves the camera over the closed cover's edge (with a tilt) // closed: camera offset right by this share of the open width (over the cover's free edge)
    mouseTilt: false, // true adds a small tilt that follows the pointer
    mouseTiltDeg: 3, // extra tilt that follows a fine pointer, either way
    mouseTiltEase: 0.08, // smoothing per frame, 0 to 1
    stageGlow: true,
    glowStrength: 0.06, // accent mixed into the glow at its centre
    glowReachPct: 60, // glow fades out by this share of the stage width

    // flip
    flipMs: 800, // full 180 degree swing
    minFlipMs: 260, // shortest swing when finishing a partial drag
    settleDeg: 2, // rebound off the stack at landing
    settleMs: 180, // ease back from the overshoot
    liftPx: 26, // lift toward the viewer mid swing
    shadeMax: 0.2, // darkest opacity of the moving face
    castMax: 0.3, // darkest opacity of the cast shadow
    leafGapPx: 1, // z offset between stacked leaves
    jumpStaggerMs: 120,
    maxVisibleJumpFlips: 3,

    // input
    wheelFlips: true,
    wheelThreshold: 60, // accumulated wheel delta (px) per page turn
    dragCommit: 0.35, // progress that finishes a drag flip
    flickVelocity: 0.5, // px per ms that finishes a drag flip
    dragSpanOfBook: 0.75, // horizontal drag distance for progress 0 to 1, as a share of book width

    accentFallback: ACCENTS.dolby, // used when the page has no --accent

    // pop-up video and pull tab on case-study spreads
    pageTintPct: 12, // how much of the project's colour goes into its pages (a light pastel)
    // "Key impact" row under the video: a label and three paper notes laid across the spread,
    // flat on the pages (the middle one sits over the fold). Percent of the book's height
    // (tops, note height) and of the spread's width (note width, spacing between centres).
    // sticky note beside the video on the right page. Percent of the page: across (centre,
    // width) and down (centre).
    // taped instant photo in the right page's top-right corner. Percent of the page: from
    // the right edge and the top, and the width.
    polaroid: {
      rightPct: 9, // 1% of the page is about 5px
      topPct: 5,
      widthPct: 28.5,
      tiltDeg: -4,
      tapeTiltDeg: -7,
    },
    stickyNote: {
      centerXPct: 75,
      centerYPct: 58.5,
      widthPct: 40,
      tiltDeg: 2,
      textSizePx: 21, // the handwriting; the note grows taller to fit longer text
    },
    keyImpact: {
      labelTopPct: 79,
      notesTopPct: 82.5,
      noteHeightPct: 14,
      noteWidthPct: 23,
      noteSpacingPct: 27,
      tiltsDeg: [0, 0, 0], // straight; e.g. [-3, 1.5, 2.5] tilts them
    },
    foldShadePct: 22, // strength of the fold shading on case-study pages (cream pages use 32)
    videoWidthOfSpread: 0.52, // printed across the fold, half on each page (0.465 before, now 12% bigger)
    // Open and settled, one unsplit copy of the video stands off the pages like the piece
    // of a pop-up greeting card. While pages turn, the video is printed on the pages instead
    // (a half on each), so it turns with them.
    cardLiftPx: 30, // how far the card stands forward
    cardRiseMs: 420,
    cardSinkMs: 160, // sinks back flat before handing over to the printed halves
    tabPullOfPage: 0.12, // full pull distance, share of the page height
    tabHint: true, // a handwritten "pull" note the first time per session
    tabHintMs: 4000,
    tabNudgeMs: 4000, // the tab nudges out a little every few seconds while idle
    pullCommitAt: 0.4, // release past this share of the pull to open the case study
    pullFlickVelocity: 0.8, // px per ms downward that also opens it
    pullRubberPx: 16, // resistance beyond the full pull
    autoPullMs: 250, // click or Enter on the tab pulls it this fast
    videoLiftZ: 40,
    videoLiftScale: 1.04,

    // transition from the book into the case study
    transition: {
      flatten: 250,
      lift: 300,
      fly: 650,
      contentFade: 400,
      contentStagger: 80,
      crossfade: 250, // used when the hero is not the same video
      flyEase: "cubic-bezier(0.22, 1, 0.36, 1)",
      liftScale: 1.06,
      bookScale: 0.96,
      bookOpacity: 0.55,
      heroWaitMs: 1500,
      hardTimeoutMs: 4000,
      reducedFadeMs: 200,
    },
    reverseZoom: false, // placeholder: a reverse animation back into the book is not built
  },
  colors: {
    page: "#F6F1E4",
    cover: "#2B2B2B",
    coverText: "#F6F1E4",
    edge: "#E6DFCB", // solid edge faces of the page blocks and moving leaf
    coverEdge: "#1F1F1D", // edge faces of the cover boards
    edgeLine: "#CDC4A9",
    hinge: "#353532", // cloth hinge band on the closed cover's spine edge
    note: "#FAF6EC", // the "Key impact" paper notes: a light eggshell white
    ink: "#2B2B2B",
    muted: "#6E6651",
    dash: "#B5AA8D",
  },
  ui: {
    openLabel: "Open",
    openNote: "open me",
    prevLabel: "Previous page",
    nextLabel: "Next page",
    dotsLabel: "Jump to a stop",
    coverDot: "Cover",
    backDot: "Back cover",
    openBook: "Open the book",
    tabLabel: "Open the {name} case study",
    tabText: "View case study",
    tabHint: "pull",
    /** handwritten note printed above the top right of each case-study video */
    videoNote: "(t:25s)",
    jumpPrefix: "Go to",
    skipHeading: "Skip to case studies",
    liveTemplate: "Spread {n} of {total}: {name}",
    liveCover: "Book closed. Cover.",
    liveBack: "Book closed. Back cover.",
    noscriptHeading: "Portfolio contents",
    resultsLabel: "Key results",
  },
  cover: {
    title: "[Cover title]",
    subtitle: "[Cover subtitle]",
    // Type sizes are container query units of the cover width, with a floor and a cap.
    titleSize: "clamp(24px, 17cqw, 96px)",
    subtitleSize: "clamp(12px, 5cqw, 24px)",
    titleColor: "#F6F1E4",
    subtitleColor: "#D8D1BE",
    titleFont: "var(--font-caveat), cursive",
    subtitleFont: "var(--font-geist-sans), sans-serif",
    // small handwritten note in the middle of the back cover, under a little heart
    backNote: "Made with tired eyes and a restless brain.",
    backNoteSizePx: 17,
  },
  /** Right page of the last spread: a chalk sketch of Vidhana Soudha under a sky that
      follows the current weather in Bengaluru (from /api/sky). */
  backCover: {
    sketch: {
      src: "/back-cover/vidhana-soudha.jpeg",
      width: 2752,
      height: 1536,
      alt: "Line sketch of Vidhana Soudha, Bengaluru",
      placeholder: "[Vidhana Soudha sketch: /public/back-cover/]",
    },
    sketchBg: "#292929",
    chalk: "#EFECE4",
    location: { name: "Bengaluru", landmark: "Vidhana Soudha", lat: 12.9797, lon: 77.5907 },
    refreshMinutes: 10,
    rainCount: 30,
    starCount: 14,
    credit: { text: "Weather data by Open-Meteo.com", href: "https://open-meteo.com/" },
    // sunny: clear or partly cloudy by day; clear: the same at night
    caption: {
      template: "Looks like Bangalore is {word}",
      words: { sunny: "sunny", rainy: "rainy", cloudy: "cloudy", clear: "clear" },
    },
    label: {
      template: "Line sketch of {landmark}, {name}, under {sky}",
      sky: {
        "clear-day": "a clear sky in the day",
        "clear-night": "a clear sky at night",
        "partly-cloudy": "a partly cloudy sky",
        cloudy: "a cloudy sky",
        rain: "a rainy sky",
      },
    },
  } satisfies BackCoverSettings as BackCoverSettings,
  /** Left page of the About spread: an ID card standing in a desk holder. */
  aboutSpread: {
    card: {
      company: "One Good Offer Away Inc.",
      name: "Eswarya Kotha",
      role: "Product Manager & AI Builder",
      idNumber: "ID 001-HIRE-ME",
      photo: "/about/me.png", // a cut-out on a transparent background
      photoAlt: "Portrait of Eswarya Kotha",
      photoPlaceholder: "[Your photo]",
      ui: {
        takeOut: "Take the ID card out of the holder",
        putBack: "Put the ID card back",
        srLine: "ID card: {name}, {role}, {company}",
        hint: "pick me up",
        caption: "Meet your potential hire",
      },
    } satisfies IdCardData as IdCardData,
    settings: {
      cardAspect: 0.6,
      cardHeight: 0.5,
      seat: 0.1,
      restLean: 6,
      liftUp: 0.3, // 0.2 left the scaled card's bottom behind the lip; 0.3 clears it
      outScale: 1.2,
      outZ: 60,
      headerClearance: 8,
      cardThickness: 3,
      tiltMax: 10,
      sheen: true,
      hint: true,
      autoShowMs: 20000,
      liftMs: 900,
      returnMs: 600,
      reducedMs: 150,
      // off-white paper with a deep green frame and pill
      colors: {
        card: "#F3F1EC",
        edge: "#D2CCBF",
        ink: "#1C1C1A",
        accent: "#1F5C45",
        accentInk: "#F3F1EC",
      },
    } satisfies IdCardSettings as IdCardSettings,
  },
  skipLinks: [
    { label: "About", href: "/about" },
    { label: "VeraAI", href: "/work/veraai" },
    { label: "MetaMint", href: "/work/metamint" },
    { label: "Dolby Labs", href: "/work/dolby-labs" },
    { label: "Play", href: "/play" },
  ],
  spreads: [
    {
      type: "about",
      id: "about",
      name: "About",
      label: "ABOUT",
      tab: "About",
      photoPlaceholder: "[Your photo]",
      intro: "[Short intro, 2 to 3 lines]",
      cta: { label: "About me", href: "/about" },
    },
    // VeraAI: blue mixed into the warm paper reads grey, so it gets its own pastel blue
    bookCaseStudy("veraai", "VeraAI", "VERAAI", "VeraAI", {
      // blue mixed into the warm paper reads grey, so VeraAI gets its own pastel blue
      pageColor: "#DCE7FB",
      ...caseStudyPages({
        company: "VeraAI Technologies Inc.",
        role: "Product Manager",
        timeline: "August 2025 to June 2026",
        ink: ACCENTS.veraai,
        stickyColor: "#F7E3A1", // butter yellow: the warm opposite of the blue page
        learned:
          "The roadmap is a hypothesis, not a marriage. Experiment, pivot, and keep your eyes on the North Star.",
        skills: [
          "Product strategy and roadmapping",
          "Frontend development (Next.js, Tailwind CSS, Claude Code, and Google Antigravity)",
          "Product ownership and zero-to-one execution",
          "GTM strategy and pitch development",
        ],
        keyImpacts: [
          // **like this** makes a phrase bold
          "**Generated 10–15** NKBA-compliant L-shaped kitchen layouts during the pilot.",
          "Built the **product frontend end-to-end**, translating product workflows into a functional user experience.",
          "Created **VeraAI's website and go-to-market materials**, translating the product vision into customer-facing experiences.",
        ],
        photo: "/veraai/polaroid.png",
        photoAlt: "A 3D render of an L-shaped kitchen with white cabinets, a sink, stove and fridge",
        photoCaption: "three.js experimentation",
      }),
    }),
    bookCaseStudy("metamint", "MetaMint", "METAMINT", "MetaMint", {
      ...caseStudyPages({
        company: "MetaMint",
        role: "Independent Product Manager & Builder",
        timeline: "May 2026 to October 2026",
        ink: ACCENTS.metamint,
        stickyColor: "#F5D2C9", // soft blush: the warm opposite of the sage page
        skills: [
          "Product Discovery & Strategy",
          "AI Prototyping & LLM Integration",
          "UX Research & Interaction Design",
          "AI Evaluation & Testing",
        ],
        keyImpacts: [
          "Built a working **AI-powered expense-tracking** prototype.",
          "Achieved **92%** image classification and **96.6%** intent classification accuracy.*",
          "Designed **end-to-end expense workflows** for bill splitting, budgeting, and planned expenses.",
        ],
        keyImpactFootnote: "*Accuracy figures reflect prototype evaluation results.",
        learned:
          "AI is smart, but maybe don't let it do your accounting. Let AI interpret; let code calculate.",
        photo: "/metamint/polaroid.png",
        photoAlt: "Me explaining my product idea on a video call, beside the Meta personal finance prompt",
        photoCaption: "explaining my idea",
        photoPosition: "left center", // keeps me and the prompt in the square crop
      }),
    }),
    bookCaseStudy("dolby-labs", "Dolby Labs", "DOLBY LABS", "Dolby", {
      ...caseStudyPages({
        company: "Dolby Laboratories X Purdue University",
        companyOneLine: true, // runs over the fold rather than wrapping
        role: "Product AI Builder",
        roleNote:
          "Independent AI proof-of-concept (2026), building on an earlier Dolby Labs × Purdue collaboration (2023).",
        timeline: "2023 Research\u00a0| 2026 AI Build", // keeps the | with the first part when it wraps
        ink: ACCENTS.dolby,
        smallInk: "#A34E1A", // deeper orange: the tab orange is too light for small text here
        stickyColor: "#D2E2F4", // soft sky blue: the cool opposite of the peach page
        skills: [
          "Product Discovery & User Research",
          "AI Prototyping & Integration",
          "Prompt Engineering",
          "AI Evaluation & Testing",
        ],
        keyImpacts: [
          "Built an AI-assisted audiobook narration prototype with **author-controlled guidance and audio enhancement**.",
          "Improved evaluation pass rates from **20% to 53%** across the same 15 test cases.*",
          "Achieved **100% first-attempt structured-output** validity across 18 runs on six real manuscript excerpts.",
        ],
        keyImpactFootnote:
          "*Results from prototype evaluation; the 53% result is 8 of 15 cases passing all three runs.",
        learned:
          "A great AI demo can fool you. Evals are where reality shows up. Build, test, break, repeat.",
        photo: "/dolby/polaroid.png",
        photoZoom: 1.2,
        photoAlt:
          "My thought process diagram: research questions and methods, a writer's workshop to challenge assumptions, and the design areas that came out of it",
        photoCaption: "Thought process",
      }),
    }),
    {
      // the Play section of the earlier portfolio
      type: "experiments",
      id: "playground",
      name: "My Playground",
      label: "MY PLAYGROUND",
      tab: "Play",
      heading: "My Playground",
      intro:
        "A little corner of the internet where my curiosity takes over - this is what I get up to outside of work!",
      photos: [
        {
          src: "/playground/pottery.jpg",
          alt: "Two hand-painted pottery plates: sunflowers, and a swirling night sky with a boat",
          caption: "Inspired Van Gogh Pottery Paintings",
        },
        {
          src: "/playground/coins.jpg",
          alt: "An album of coins from around the world",
          caption: "Numismatist – Exploring global currencies, history, and design",
        },
        {
          src: "/playground/kyoto-cafe.jpg",
          alt: "Fluffy pancakes with strawberries and matcha at a cafe",
          caption: "Cafe hopping at Kyoto",
        },
        {
          src: "/playground/hike.jpg",
          alt: "Hills at sunset with fog in the valley below",
          caption: "Scenes from monthly hikes",
        },
      ],
      videos: [
        {
          src: "/playground/ecokinetics.mp4",
          caption:
            "Ecokinetics - A data driven biomimetic installation that showcases 100 years of marine heatwaves on corals",
          madeWith: "Made with Arduino + Figma",
        },
        {
          src: "/playground/mindfulness-pockets.mp4",
          caption: "My speculative design concept on mindfulness pockets in university spaces",
          madeWith: "Made with p5.js + ml5.js + Arduino + Figma",
        },
      ],
    },
    {
      // the contact section of the earlier portfolio
      type: "coming-soon",
      id: "contact",
      name: "Contact",
      label: "CONTACT",
      heading: "I know where to get the\nbest food in Bangalore,\nLet's talk!",
      headingSizePx: 36,
      headingAside: "(not jk!)",
      headingAsideAfter: "the",
      links: [
        {
          kind: "email",
          label: "Email",
          value: "eswarya.k@gmail.com",
          href: "mailto:eswarya.k@gmail.com",
        },
        {
          kind: "linkedin",
          label: "LinkedIn",
          value: "/in/eswarya-kotha",
          href: "https://www.linkedin.com/in/eswarya-kotha",
        },
        {
          kind: "resume",
          label: "Resume",
          value: "",
          href: "", // TODO: paste the resume link
        },
      ],
    },
  ] satisfies BookSpread[],
};
