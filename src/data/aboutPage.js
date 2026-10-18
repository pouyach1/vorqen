/**
 * About page content — placeholders are marked with [BRACKETS].
 * Demo identity fields (name, role) are read from lib/constants at render time.
 */

export const PLACEHOLDER_NOTE =
  "Placeholder content — replace bracketed fields with your real story and details.";

export const bootLines = [
  "KURO IDENTITY KERNEL v3.2",
  ">> mounting neural profile...",
  ">> decrypting creator dossier...",
  ">> calibrating holographic panels...",
  ">> identity interface online.",
];

export const identityDescriptors = [
  { key: "MODE", value: "CREATIVE BUILDER" },
  { key: "FOCUS", value: "INTERACTIVE SYSTEMS" },
  { key: "OUTPUT", value: "PRODUCTS + EXPERIENCES" },
  { key: "STATUS", value: "ALWAYS LEARNING" },
];

export const storyMilestones = [
  {
    id: "origin",
    phase: "PHASE_00",
    label: "[ORIGIN]",
    title: "[YOUR STARTING POINT]",
    log: "[YOUR STORY — Describe where your journey began: environment, constraints, and the first spark that made you want to build.]",
  },
  {
    id: "discovery",
    phase: "PHASE_01",
    label: "[DISCOVERY]",
    title: "[FIRST BREAKTHROUGH]",
    log: "[YOUR STORY — A moment when code, design, or automation clicked — and you realized you could create real things.]",
  },
  {
    id: "craft",
    phase: "PHASE_02",
    label: "[CRAFT]",
    title: "[DEEPENING SKILLS]",
    log: "[YOUR STORY — How you sharpened your craft through projects, failures, late nights, and deliberate practice.]",
  },
  {
    id: "vision",
    phase: "PHASE_03",
    label: "[VISION]",
    title: "[WHERE YOU'RE HEADED]",
    log: "[YOUR STORY — What you're building toward: products, teams, experiences, or a new way of designing digital worlds.]",
  },
];

export const mindPillars = [
  {
    id: "curiosity",
    channel: "CH-01",
    title: "Curiosity",
    glyph: "◎",
    thought: "[How you explore unknowns — reading, breaking things, asking why before accepting defaults.]",
  },
  {
    id: "experiment",
    channel: "CH-02",
    title: "Experimentation",
    glyph: "△",
    thought: "[How you prototype fast, test ideas in small loops, and ship learnings instead of perfection.]",
  },
  {
    id: "solve",
    channel: "CH-03",
    title: "Problem Solving",
    glyph: "◇",
    thought: "[How you decompose messy problems into systems, constraints, and shippable slices.]",
  },
  {
    id: "tech",
    channel: "CH-04",
    title: "Technology",
    glyph: "⬡",
    thought: "[How you treat tools as leverage — choosing stack for the experience, not the hype cycle.]",
  },
  {
    id: "create",
    channel: "CH-05",
    title: "Creativity",
    glyph: "✦",
    thought: "[How you blend aesthetics with engineering so interfaces feel alive, not assembled.]",
  },
  {
    id: "learn",
    channel: "CH-06",
    title: "Continuous Learning",
    glyph: "∞",
    thought: "[How you stay current without losing depth — building while studying, teaching while building.]",
  },
];

export const humanSignals = [
  {
    id: "offline",
    label: "OFF-SCREEN",
    detail: "[YOUR HOBBIES — music, walks, games, coffee rituals, or whatever keeps you human.]",
  },
  {
    id: "drive",
    label: "CORE DRIVE",
    detail: "[WHAT MOTIVATES YOU — impact, craft, freedom, team, or building things people actually use.]",
  },
  {
    id: "collab",
    label: "COLLABORATION",
    detail: "[HOW YOU WORK WITH OTHERS — async, direct feedback, shared ownership, calm under pressure.]",
  },
];

export const departurePaths = [
  {
    id: "projects",
    label: "View Projects",
    href: "/#projects",
    desc: "Explore shipped work and case studies.",
    accent: "cyan",
  },
  {
    id: "contact",
    label: "Initiate Contact",
    href: "/#contact",
    desc: "Open a direct line — terminal or social.",
    accent: "purple",
  },
  {
    id: "bots",
    label: "Test Live Bots",
    href: "/#bots",
    desc: "Interact with Telegram automations in the wild.",
    accent: "magenta",
  },
];
