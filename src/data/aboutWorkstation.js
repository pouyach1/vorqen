/**
 * About workstation content — English storytelling for the IDE experience.
 * Portfolio project/tech entries that come from demo data are flagged.
 */

export const ABOUT_CREATOR = {
  name: "Pouya",
  role: "Creative Developer & Experience Builder",
  robotName: "Kuro",
  filePath: "creator/profile.js",
};

export const CHAPTERS = [
  { id: "identity", index: "01", label: "IDENTITY", command: "whoami" },
  { id: "origin", index: "02", label: "ORIGIN", command: "origin" },
  { id: "journey", index: "03", label: "JOURNEY", command: "journey" },
  { id: "think", index: "04", label: "THINKING", command: "think" },
  { id: "skills", index: "05", label: "SKILLS", command: "skills" },
  { id: "projects", index: "06", label: "PROJECTS", command: "projects" },
  { id: "vision", index: "07", label: "VISION", command: "vision" },
];

export const BOOT_LINES = [
  "Initializing creator profile…",
  "Mounting development environment…",
  "Connecting presentation assistant…",
  "Ready.",
];

/**
 * Each chapter drives the code editor + AI response panel.
 * `code` appears as typed source. `response` is the system readout.
 */
export const ABOUT_CHAPTERS = {
  identity: {
    id: "identity",
    title: "IDENTITY",
    prompt: "$ whoami",
    code: `const creator = {
  name: "Pouya",
  role: "Creative Developer",
  focus: ["interactive systems", "product craft"],
  mindset: "build > imagine",
  status: "always learning",
};

export default creator;`,
    responseTitle: "SYSTEM / IDENTITY",
    response: [
      "Profile resolved.",
      "",
      "Pouya builds digital experiences — interfaces that feel intentional, systems that stay readable, and products that people can actually use.",
      "",
      "Not a résumé dump. A working identity.",
    ],
    meta: { query: "creator.whoami", status: "OK" },
  },
  origin: {
    id: "origin",
    title: "ORIGIN",
    prompt: "$ origin --trace",
    code: `creator.origin = {
  spark: "curiosity",
  firstMove: "open the editor",
  constraint: "limited space, unlimited questions",
  loop: ["ask", "build", "break", "learn"],
};`,
    responseTitle: "SYSTEM / ORIGIN",
    response: [
      "Origin identified.",
      "",
      "It did not begin with a perfect roadmap.",
      "It began with curiosity — one question becoming another, one experiment becoming a project, one project becoming direction.",
      "",
      "[Editable: replace with your specific starting story.]",
    ],
    meta: { query: "creator.origin", status: "OK" },
  },
  journey: {
    id: "journey",
    title: "JOURNEY",
    prompt: "$ journey --map",
    code: `const path = [
  "Curiosity",
  "Experimentation",
  "Failure",
  "Learning",
  "Building",
  "Iteration",
];

path.reduce((self, step) => self.grow(step), creator);`,
    responseTitle: "SYSTEM / JOURNEY",
    response: [
      "Progression mapped.",
      "",
      "Curiosity → Experimentation → Failure → Learning → Building → Iteration",
      "",
      "The path is not linear. It compounds. Each rebuild sharpens the next attempt.",
      "",
      "[Placeholder timeline — connect real milestones when ready.]",
    ],
    meta: { query: "creator.journey", status: "OK" },
  },
  think: {
    id: "think",
    title: "THINKING",
    prompt: "$ think --process",
    code: `function approach(problem) {
  return problem
    .question()
    .explore()
    .prototype()
    .break()
    .understand()
    .rebuild();
}`,
    responseTitle: "SYSTEM / HOW I THINK",
    response: [
      "Process loaded.",
      "",
      "QUESTION → EXPLORE → PROTOTYPE → BREAK → UNDERSTAND → REBUILD",
      "",
      "Prefer shipping a sharp slice over polishing a vague idea. Prefer evidence over ego. Prefer systems that stay maintainable after the excitement fades.",
    ],
    meta: { query: "creator.think", status: "OK" },
  },
  skills: {
    id: "skills",
    title: "SKILLS",
    prompt: "$ skills --list",
    code: `creator.stack = {
  frontend: ["React", "JavaScript", "Tailwind CSS", "Three.js", "Framer Motion"],
  systems: ["Node.js", "Git"],
  craft: ["UI engineering", "interactive storytelling"],
};

// Note: levels/years in portfolio data are demo values.`,
    responseTitle: "SYSTEM / TECHNOLOGY",
    response: [
      "Stack inventory (from this repository).",
      "",
      "Frontend: React · JavaScript · Tailwind CSS · Three.js · Framer Motion",
      "Tooling: Vite · Git",
      "Adjacent portfolio modules also reference Node / bot stacks — treat detailed seniority as demo until verified.",
      "",
      "Evidence over claims.",
    ],
    tags: ["React", "JavaScript", "Tailwind", "Three.js", "Framer Motion", "Vite", "Git"],
    meta: { query: "creator.skills", status: "OK" },
  },
  projects: {
    id: "projects",
    title: "PROJECTS",
    prompt: "$ projects --creator",
    code: `await scan("./portfolio");

// Records found in this workspace:
// - cyber-portfolio (this site)
// - showcase entries in data/webProjects.js (demo)
// - telegram bot showcases (demo copy present)`,
    responseTitle: "SYSTEM / PROJECTS",
    response: [
      "Workspace scan complete.",
      "",
      "LIVE IN REPO",
      "• cyber-portfolio — this interactive site",
      "",
      "SHOWCASE DATA (demo / placeholder records)",
      "• CyberVerse Landing · Aura AI Dashboard · Nexus DEX",
      "• Telegram bot demos with sample metrics",
      "",
      "Open the main domain to explore the showcase UI. Replace demo records with shipping work when ready.",
    ],
    meta: { query: "creator.projects", status: "DEMO_FLAGGED" },
  },
  vision: {
    id: "vision",
    title: "VISION",
    prompt: "$ vision --next",
    code: `creator.next = {
  version: "building",
  objective: "create something worth remembering",
  northStar: "experiences > pages",
};

console.log(creator.next);`,
    responseTitle: "SYSTEM / VISION",
    response: [
      "Forward vector locked.",
      "",
      "CURRENT VERSION: BUILDING",
      "NEXT OBJECTIVE: CREATE SOMETHING WORTH REMEMBERING",
      "",
      "This profile is not a final release. It is a living environment — still compiling, still curious, still shipping.",
    ],
    meta: { query: "creator.vision", status: "OK" },
  },
};
