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
    before: { count: number; total: number };
    after: { count: number; total: number };
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
  solutionSection?: SolutionData;
  evaluationSection?: EvaluationData;
  overview: string;
  problem: string;
  myRole: string;
  process?: string[];
  solution: string;
  impact?: string[];
  learnings?: string[];
  learningItems?: Array<{ title: string; body: string }>;
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
              title: "Reliability loop around the model",
              body: "Validator, retry note with the error, repairs, fallback. On real text, valid first attempts went from 9/18 to 18/18 after a prompt fix.",
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
              title: "Evaluation",
              body: "18 cases, 3 runs each, rule checks plus a judge model. Results tracked in Google Sheets.",
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
          caption: "First-attempt validity, six real excerpts, 3 runs each",
          before: { count: 9, total: 18 },
          after: { count: 18, total: 18 },
          annotation: "after the prompt fix",
          ariaLabel: "First attempt validity before: 9 of 18 runs valid, 50 percent. After: 18 of 18 runs valid, 100 percent.",
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
        { title: "The same short line in two stories", detail: "The AI sometimes reads an encouraging sister as anxious, which the judge rejects as not warm." },
        { title: "Author says a character is softening", detail: "The AI sometimes labels the part sharp ache or stinging instead of something that shows softening." },
        { title: "A line with a name and an apartment code", detail: "Sometimes only one tip comes back, with no pronunciation help." },
        { title: "A line with only everyday words", detail: "Tips sometimes invent a detail that is not in the text." },
        { title: "Six real excerpts", detail: "Output is valid every time, but in one run a character had no feeling listed for some parts." },
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
