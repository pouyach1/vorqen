/**
 * About workstation — Living Terminal story chapters.
 * Labels + Kuro dialogue live in i18n (`about:chapters.<id>`).
 * Living: identity–vision (R04.1–R04.7).
 */

export const ABOUT_CREATOR = {
  robotName: "Kuro",
  filePath: "creator/pouya.js",
};

/** Chapters with full terminal ↔ Kuro storytelling. */
export const LIVING_CHAPTER_IDS = new Set([
  "identity",
  "origin",
  "journey",
  "think",
  "skills",
  "projects",
  "vision",
]);

/** Interactive finale choices — display-only, never evaluated. */
export const FINALE_CHOICES = [
  {
    id: "learn",
    code: 'await pouya.learn("Something new");',
  },
  {
    id: "build",
    code: 'await pouya.build("The next big idea");',
  },
  {
    id: "explore",
    code: 'await pouya.explore("The unknown");',
  },
];

export const FINALE_CONTINUED = "// To be continued...";

export const FINALE_PHASE = {
  OFF: "off",
  IDLE: "idle",
  CHOOSING: "choosing",
  SELECTED: "selected",
  REVEALING: "revealing",
  COMPLETED: "completed",
};

/** Exact Chapter 04 storytelling source (display-only — not executed). */
export const THINK_CODE = `// CHAPTER 04 — HOW POUYA THINKS
// A creative process that never stops evolving.

const principles = {
  emotion: "Make people feel something",
  purpose: "Every detail should matter",
  usability: "Beautiful AND functional",
  motion: "Movement should tell a story",
  curiosity: Infinity
};

class CreativeMind {
  constructor(creator = "Pouya") {
    this.creator = creator;
    this.ideas = [];
    this.iterations = 0;
    this.isLearning = true;
    this.kuroPatience = 100;
  }

  imagine(idea) {
    this.ideas.push({
      ...idea,
      status: "Unexplored",
      potential: "Unknown"
    });

    return "What if we tried something different?";
  }

  evaluate(design) {
    const checks = {
      meaningful: design.hasPurpose,
      beautiful: design.hasVisualIdentity,
      usable: design.isAccessible,
      memorable: design.createsEmotion,
      performant: design.runsSmoothly
    };

    return {
      checks,
      approved: Object.values(checks).every(Boolean)
    };
  }

  async refine(design, maxIterations = 12) {
    let current = design;

    for (let i = 0; i < maxIterations; i++) {
      this.iterations++;

      const review = this.evaluate(current);
      if (review.approved) return current;

      current = await improveDesign(current, review.checks);
      this.kuroPatience = Math.max(
        0,
        this.kuroPatience - 8
      );
    }

    return current; // Progress, not perfection.
  }

  describe() {
    return {
      mindset: "Always exploring",
      goal: "Build meaningful experiences",
      belief: "Good design is never just decoration",
      status: "Still becoming..."
    };
  }
}

const pouya = new CreativeMind();

pouya.imagine({
  type: "Interactive Website",
  ambition: "Something worth remembering"
});

// Kuro: "Please tell me we're done..."
console.log(pouya.describe());`;

function endAfter(code, marker) {
  const i = code.indexOf(marker);
  if (i < 0) throw new Error(`Stage marker missing: ${marker.slice(0, 40)}`);
  return i + marker.length;
}

/** Five reveal stages: principles → class → evaluation → refinement → final. */
export const THINK_CODE_STAGES = [
  endAfter(THINK_CODE, "curiosity: Infinity\n};"),
  endAfter(THINK_CODE, 'return "What if we tried something different?";\n  }'),
  endAfter(THINK_CODE, "approved: Object.values(checks).every(Boolean)\n    };\n  }"),
  endAfter(THINK_CODE, 'status: "Still becoming..."\n    };\n  }\n}'),
  THINK_CODE.length,
];

/** Exact Chapter 05 storytelling source (display-only — not executed). */
export const SKILLS_CODE = `// CHAPTER 05 — CURIOSITY.EXE
// Developer: Pouya
// System assistant: KURO 🤖

const pouya = {
  name: "Pouya",
  age: 22,

  interests: {
    technology: [
      "Programming",
      "Artificial Intelligence",
      "Robotics",
      "Web Design"
    ],

    sports: [
      "Parkour",
      "Basketball",
      "BMX"
    ],

    arts: ["Music"],

    science: [
      "Chemistry",
      "Biology",
      "Mathematics"
    ]
  },

  philosophy: "I find life in learning.",
  curiosity: Infinity
};

class Kuro {
  constructor() {
    this.ram = 16;
    this.usedRam = 15;
    this.mood = "playful";
  }

  scanHuman(human) {
    const interests = Object.values(human.interests).flat();

    console.log("KURO: Scanning Pouya's brain...");

    if (interests.length > 10) {
      console.warn(
        "ERROR 404: Human category not found!"
      );

      return {
        type: "Unclassifiable Human",
        superpower: "Endless Curiosity",
        lifePhilosophy: human.philosophy
      };
    }

    return { type: "Normal Human" };
  }

  addInterest(interest) {
    this.usedRam += 1;

    console.log(\`POUYA: I found a new interest! \${interest}\`);

    if (this.usedRam >= this.ram) {
      this.mood = "panicking";

      return (
        "KURO: WHAAAAT?! 😭 " +
        "My old RAM is FULL! " +
        "I NEED A RAM UPGRADE!"
      );
    }

    return "KURO: Another one?! Seriously?!";
  }
}

const kuro = new Kuro();

console.log(kuro.scanHuman(pouya));

// Everything was fine until Pouya spoke again...

function pouyaHasAnIdea() {
  console.log("POUYA: Kurooo! I found a new interest! 😎");

  const kuroReaction = kuro.addInterest(
    "Something completely new"
  );

  console.log(kuroReaction);
  return kuroReaction;
}

// Famous last words:
pouyaHasAnIdea();

// KURO: "I'M ORDERING NEW RAM!!!" 😭💜`;

/** Five reveal stages: interests → Kuro class → scan → idea → RAM panic. */
export const SKILLS_CODE_STAGES = [
  endAfter(SKILLS_CODE, "curiosity: Infinity\n};"),
  endAfter(SKILLS_CODE, 'return "KURO: Another one?! Seriously?!";\n  }\n}'),
  endAfter(SKILLS_CODE, "console.log(kuro.scanHuman(pouya));"),
  endAfter(SKILLS_CODE, "return kuroReaction;\n}"),
  SKILLS_CODE.length,
];

/** Exact Chapter 06 storytelling source (display-only — not executed). */
export const VORQEN_CODE = `// CHAPTER 06 — PROJECT: VORQEN
// Turning imagination into meaningful experiences.

class Vorqen {
  constructor(founder = "Pouya") {
    this.founder = founder;
    this.status = "Building";
    this.mission = "Make the digital world better";

    this.principles = [
      "Design with purpose",
      "Build with care",
      "Make technology feel human",
      "Never stop learning"
    ];
  }

  createExperience({ idea, people }) {
    const project = {
      idea,
      audience: people,
      design: "Thoughtful",
      experience: "Memorable",
      performance: "Essential",
      accessibility: "Important",
      status: "Work in progress"
    };

    return this.improve(project);
  }

  improve(project) {
    return {
      ...project,
      intention: "Make something worth using",
      promise: "Keep improving"
    };
  }

  getVision() {
    return {
      today: "Build better websites",
      tomorrow: "Explore what's possible",
      impact: "Make someone's day a little better"
    };
  }
}

const vorqen = new Vorqen();

const firstMission = vorqen.createExperience({
  idea: "A meaningful digital experience",
  people: "Real humans with real needs"
});

console.log(vorqen.getVision());

// KURO: "Wait... this is actually beautiful." 💜`;

/** Five reveal stages: class → create → improve → vision → mission boot. */
export const VORQEN_CODE_STAGES = [
  endAfter(VORQEN_CODE, '"Never stop learning"\n    ];\n  }'),
  endAfter(VORQEN_CODE, "return this.improve(project);\n  }"),
  endAfter(VORQEN_CODE, 'promise: "Keep improving"\n    };\n  }'),
  endAfter(
    VORQEN_CODE,
    'impact: "Make someone\'s day a little better"\n    };\n  }\n}'
  ),
  VORQEN_CODE.length,
];

/** Exact Chapter 07 storytelling source — ends on the unwritten line. */
export const VISION_CODE = `// CHAPTER 07 — FUTURE.JS
// The file that isn't finished yet.

const future = {
  status: "Unwritten",
  scanned: false,
  certainty: 0
};

function scanFuture() {
  console.log("KURO: Scanning the future...");
  // 10%... 47%... 99%...
  throw new Error("FUTURE NOT FOUND");
}

try {
  scanFuture();
} catch (error) {
  console.warn(error.message);
}

// The story isn't over.
// It's just waiting for the next line.

const possibilities = Infinity;`;

export const VISION_CODE_STAGES = [
  endAfter(VISION_CODE, 'certainty: 0\n};'),
  endAfter(VISION_CODE, "throw new Error(\"FUTURE NOT FOUND\");\n}"),
  endAfter(VISION_CODE, "console.warn(error.message);\n}"),
  VISION_CODE.length,
];

/** Resolve the latest mapped value at or before `count`. */
export function resolveMappedBeat(map, count, fallback) {
  if (!map || count < 1) return fallback;
  if (map[count]) return map[count];
  return Object.keys(map)
    .map(Number)
    .filter((n) => n <= count)
    .sort((a, b) => a - b)
    .reduce((acc, n) => map[n] || acc, fallback);
}
export const CHAPTERS = [
  { id: "identity", index: "01", command: "whoami" },
  { id: "origin", index: "02", command: "origin" },
  { id: "journey", index: "03", command: "journey" },
  { id: "think", index: "04", command: "think" },
  { id: "skills", index: "05", command: "skills" },
  { id: "projects", index: "06", command: "projects" },
  { id: "vision", index: "07", command: "vision" },
];

/**
 * Terminal source (English / JS). Kuro interprets in the locale UI.
 * `kuroGate` = fraction of code typed before Kuro may speak.
 * `reactionBeats` = revealedCount → gesture id for AboutRobotGuide.
 */
export const ABOUT_CHAPTERS = {
  identity: {
    id: "identity",
    living: true,
    prompt: "$ whoami --identity",
    kuroGate: 0.72,
    kuroMood: "happy",
    code: `const pouya = {
  name: "Pouya",
  age: 22,
  role: "Creative Technologist",
  passion: "Building things that don't exist yet",

  believes: [
    "Technology is a tool for imagination",
    "Every idea deserves a chance to exist",
    "Great work is built with curiosity"
  ],

  currentStatus: "Still becoming...",
  journey: "Just getting started"
};

export default pouya;`,
    meta: { query: "creator.identity", status: "OK" },
  },
  origin: {
    id: "origin",
    living: true,
    prompt: "$ origin --beginning",
    kuroGate: 0.42,
    kuroMood: "excited",
    // revealedCount → gesture (matches FA/EN dialogue segment structure)
    reactionBeats: {
      1: "bounce",
      3: "look",
      7: "look",
      9: "surprise",
      11: "shake",
      15: "shake",
      19: "delight",
    },
    code: `const beginning = {
  curiosity: Infinity,
  firstLove: "Technology",
  favoriteAction: "Build",

  ideaToReality(idea) {
    const tools = ["Code", "AI", "Creativity"];
    const attempts = [];

    while (!idea.isReal) {
      attempts.push("Try again");
      learnSomethingNew();
      improve(idea, tools);
    }

    return "Something that didn't exist yesterday";
  },

  currentMission: "Turn imagination into reality"
};`,
    meta: { query: "creator.beginning", status: "OK" },
  },
  journey: {
    id: "journey",
    living: true,
    prompt: "$ journey --path",
    kuroGate: 0.38,
    kuroMood: "sad",
    defaultBeat: "tilt",
    // revealedCount → facial mood (SAD → HOPEFUL/HAPPY)
    moodBeats: {
      1: "sad",
      31: "happy",
      49: "love",
    },
    // revealedCount → gesture
    reactionBeats: {
      1: "tilt",
      5: "tilt",
      15: "look",
      17: "look",
      23: "look",
      27: "confuse",
      31: "hope",
      35: "hope",
      41: "delight",
      49: "proud",
    },
    code: `const journey = {
  heart: "Always trying for loved ones",

  challenges: [
    "Heavy expectations",
    "Emotional exhaustion",
    "Difficult days",
    "Finding his own way"
  ],

  soundtrack: "Dalu - 3:33",
  observer: "Kuro, behind the screen",

  turningPoint: "He chose his own path",
  status: "Still here. Still building."
};`,
    meta: { query: "creator.journey", status: "OK" },
  },
  think: {
    id: "think",
    living: true,
    prompt: "$ perspective --mind",
    filePath: "creator/pouya.perspective.js",
    kuroGate: 0.22,
    kuroMood: "thinking",
    codeReveal: "stages",
    codeStages: THINK_CODE_STAGES,
    dialogueAdvance: "continue",
    defaultBeat: "tilt",
    // Continue steps: unlock code stage + dialogue slice together
    storyBeats: [
      { codeStage: 1, dialogueUntil: 1 },
      { codeStage: 1, dialogueUntil: 5 },
      { codeStage: 1, dialogueUntil: 9 },
      { codeStage: 2, dialogueUntil: 13 },
      { codeStage: 2, dialogueUntil: 15 },
      { codeStage: 3, dialogueUntil: 21 },
      { codeStage: 3, dialogueUntil: 27 },
      { codeStage: 4, dialogueUntil: 29 },
      { codeStage: 4, dialogueUntil: 33 },
      { codeStage: 4, dialogueUntil: 35 },
      { codeStage: 5, dialogueUntil: 41 },
      { codeStage: 5, dialogueUntil: 47 },
      { codeStage: 5, dialogueUntil: 51 },
    ],
    moodBeats: {
      1: "thinking",
      51: "excited",
    },
    reactionBeats: {
      1: "tilt",
      5: "think",
      9: "look",
      17: "look",
      21: "confuse",
      27: "shake",
      29: "confuse",
      35: "surprise",
      47: "hope",
      51: "delight",
    },
    code: THINK_CODE,
    meta: { query: "creator.perspective", status: "OK" },
  },

  skills: {
    id: "skills",
    living: true,
    prompt: "$ curiosity --scan",
    filePath: "creator/curiosity.exe.js",
    kuroGate: 0.2,
    kuroMood: "playful",
    codeReveal: "stages",
    codeStages: SKILLS_CODE_STAGES,
    dialogueAdvance: "continue",
    defaultBeat: "bounce",
    storyBeats: [
      { codeStage: 1, dialogueUntil: 1 },
      { codeStage: 1, dialogueUntil: 5 },
      { codeStage: 1, dialogueUntil: 11 },
      { codeStage: 1, dialogueUntil: 15 },
      { codeStage: 2, dialogueUntil: 17 },
      { codeStage: 3, dialogueUntil: 19 },
      { codeStage: 3, dialogueUntil: 23 },
      { codeStage: 3, dialogueUntil: 31 },
      { codeStage: 4, dialogueUntil: 35 },
      { codeStage: 5, dialogueUntil: 37 },
    ],
    moodBeats: {
      1: "playful",
      17: "thinking",
      19: "playful",
      23: "happy",
      31: "love",
      35: "excited",
    },
    reactionBeats: {
      1: "bounce",
      5: "look",
      9: "surprise",
      11: "shake",
      15: "shake",
      17: "think",
      19: "surprise",
      23: "hope",
      31: "proud",
      35: "confuse",
      37: "shake",
    },
    code: SKILLS_CODE,
    meta: { query: "creator.curiosity", status: "OK" },
  },
  projects: {
    id: "projects",
    living: true,
    prompt: "$ vorqen --mission",
    filePath: "creator/vorqen.js",
    kuroGate: 0.2,
    kuroMood: "excited",
    codeReveal: "stages",
    codeStages: VORQEN_CODE_STAGES,
    dialogueAdvance: "continue",
    defaultBeat: "bounce",
    storyBeats: [
      { codeStage: 1, dialogueUntil: 1 },
      { codeStage: 1, dialogueUntil: 5 },
      { codeStage: 1, dialogueUntil: 9 },
      { codeStage: 2, dialogueUntil: 11 },
      { codeStage: 2, dialogueUntil: 17 },
      { codeStage: 3, dialogueUntil: 19 },
      { codeStage: 3, dialogueUntil: 21 },
      { codeStage: 4, dialogueUntil: 25 },
      { codeStage: 4, dialogueUntil: 31 },
      { codeStage: 5, dialogueUntil: 37 },
    ],
    moodBeats: {
      1: "excited",
      11: "love",
      19: "love",
      31: "happy",
      35: "playful",
    },
    reactionBeats: {
      1: "surprise",
      3: "bounce",
      5: "bounce",
      7: "look",
      9: "look",
      11: "hope",
      19: "delight",
      21: "shake",
      25: "hope",
      31: "proud",
      35: "confuse",
      37: "shake",
    },
    code: VORQEN_CODE,
    meta: { query: "creator.vorqen", status: "OK" },
  },
  vision: {
    id: "vision",
    living: true,
    hasFinale: true,
    prompt: "$ future --open",
    filePath: "creator/future.js",
    kuroGate: 0.2,
    kuroMood: "thinking",
    codeReveal: "stages",
    codeStages: VISION_CODE_STAGES,
    dialogueAdvance: "continue",
    defaultBeat: "tilt",
    storyBeats: [
      { codeStage: 1, dialogueUntil: 1 },
      { codeStage: 1, dialogueUntil: 5 },
      { codeStage: 2, dialogueUntil: 11 },
      { codeStage: 2, dialogueUntil: 13 },
      { codeStage: 2, dialogueUntil: 17 },
      { codeStage: 3, dialogueUntil: 25 },
      { codeStage: 3, dialogueUntil: 31 },
      { codeStage: 3, dialogueUntil: 41 },
      { codeStage: 4, dialogueUntil: 47 },
      { codeStage: 4, dialogueUntil: 55 },
      { codeStage: 4, dialogueUntil: 61 },
      { codeStage: 4, dialogueUntil: 65 },
    ],
    moodBeats: {
      1: "thinking",
      13: "playful",
      39: "love",
      47: "excited",
      61: "happy",
      65: "excited",
    },
    reactionBeats: {
      1: "look",
      5: "surprise",
      9: "think",
      13: "surprise",
      17: "shake",
      25: "tilt",
      39: "hope",
      47: "bounce",
      55: "confuse",
      61: "proud",
      65: "delight",
    },
    code: VISION_CODE,
    meta: { query: "creator.future", status: "UNWRITTEN" },
  },
};

/** Pause longer after blank lines / before punchlines so visitors can read. */
export function nextRevealDelay(responseLines, revealedCount) {
  const justShown = responseLines[revealedCount - 1];
  const upcoming = responseLines[revealedCount];
  if (justShown === "") return 860;
  if (upcoming === "") return 800;
  if (
    typeof justShown === "string" &&
    /Infinity|خاموش|power|😭|😂|🚀|🥲|💜|😍|🤨|⚡|3:33|Dalu|لیوان|glass of water|ذهن‌خوان|mind-read|خفن‌تر|better idea|ERROR 404|FUTURE NOT FOUND|کهکشان|galaxy|RAM|رم|VORQEN|دیباگ|debug|ارزش ساخته|نوشته نشده|unwritten/.test(
      justShown
    )
  ) {
    return 980;
  }
  return 600;
}

export function getFinaleChoice(id) {
  return FINALE_CHOICES.find((c) => c.id === id) || null;
}

/** Apply a story beat: code stage length + dialogue reveal count. */
export function applyStoryBeat(chapter, beatIndex) {
  const beats = chapter?.storyBeats;
  if (!beats?.length) return null;
  const beat = beats[Math.max(0, Math.min(beatIndex, beats.length - 1))];
  const stages = chapter.codeStages;
  const stageIdx = Math.max(0, (beat.codeStage || 1) - 1);
  const typedLength = stages?.[stageIdx] ?? chapter.code?.length ?? 0;
  return {
    typedLength,
    revealedCount: beat.dialogueUntil,
    isLast: beatIndex >= beats.length - 1,
  };
}
