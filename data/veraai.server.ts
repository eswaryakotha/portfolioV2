import "server-only";
import { ACCENTS, ACCENTS_BRIGHT, type CaseStudy } from "./content";

/* The VeraAI case study is password protected (see app/work/[slug]/page.tsx), so its content
   lives here, in a server-only module: it is never part of the JavaScript sent to browsers,
   and the page only sends it after the password has been entered. */
export const veraai: CaseStudy = {
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
      note: "(average time: 32 days)",
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
};
