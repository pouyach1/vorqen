# Homepage Redesign Plan — R01

**Scope:** Architecture + motion strategy only. No implementation.  
**AUGE visual translation:** BLOCKED until reference media lands in `cyber-portfolio/reference/`.

---

## 1. Existing homepage architecture

### Mounted (`src/App.jsx`)

| Order | Section | Component | Anchor / id | Motion / notes |
|------:|---------|-----------|-------------|----------------|
| — | Global FX | `CosmosLayer`, `NeonGrid`, `AmbientGlows`, `NoiseOverlay` | — | Continuous atmosphere; WebGL/CSS |
| — | Nav / footer | `Navbar`, `Footer` | hash + `/about` | Milan RAF nav dot; `LanguageSwitcher` |
| — | Loader | `MotionLoader` | — | Scene-ready gate |
| 1 | Hero | `Hero` + `HeroRobot3D` + `StatsCounter` | `#home` (implied) | Letter glow (EN only); scroll fade via Milan |
| 2 | Bridge | `ConstellationField` | `#constellation` | Scroll-synced field |
| 3 | Projects | `WebProjectsShowcase` + `ProjectCard` | `#projects` | Milan section progress; modal |
| 4 | Bots | `TelegramBotsShowcase` + `BotCard` | `#bots` | Simulator modal |
| 5 | Stack | `TechStackMatrix` | `#stack` | Icon grid |
| 6 | Estimator | `CostEstimator` | (configurator) | RTL slide motion; i18n pricing |
| 7 | Experience | `ExperienceTimeline` | `#experience` | Timeline list |
| 8 | Contact | `ContactTerminal` | `#contact` | Scroll reveal choreography |

**Modals (global):** `BotSimulatorModal`, `ProjectDetailModal`  
**Router shell:** `AppRouter` + `InteractionLayer` (Lenis + custom cursor) + `MotionFoundation` + SEO `DocumentMeta`  
**About page:** separate route (`/about`, `/fa/about`) — out of homepage mount; keep.

### Unmounted (present, not in `App.jsx`)

- `TestimonialsShowcase`, `DesignProcessSection`, `SkillsRadarSection`
- Legacy `terminal/TerminalContact.jsx` (superseded by `ContactTerminal`)

### Stack facts to preserve

- EN/FA routes, Vazirmatn on FA, logical CSS, `dirSign`, no FA per-character split
- Lenis (desktop fine pointer); reduced-motion skip
- Milan master RAF (`motion/`) — shared scroll state
- Framer Motion for UI / reduced-motion
- Three.js Kuro in hero
- i18n namespaces: `common`, `home`, `about` + SEO shells
- Theme tokens: void / cyan / purple / magenta; Orbitron / Rajdhani / JetBrains Mono (+ Vazirmatn FA)

---

## 2. Proposed new homepage architecture

AUGE-level ambition adapted to a **personal Kuro portfolio** — not a clone. No AUGE brand, copy, or images.

| # | Proposed section | Intent | Feature integration |
|---|------------------|--------|---------------------|
| A | **Cinematic typographic hero** | Brand-first full-bleed type; Kuro as spatial accent, not card | Reuse Kuro 3D; slim/remove hero stats strip from first viewport |
| B | **Kinetic manifesto + editorial collage** | Statement + original imagery/layout collage | Replace/absorb `ConstellationField` role as scroll bridge |
| C | **Introduction & capabilities** | Clean bio + what you ship | Fold `TechStackMatrix` (+ optional unmounted skills) into quieter layout |
| D | **Selected work** | Interactive rows / hover previews | Keep `WebProjectsShowcase` + bots as two work lanes or unified “Selected work” |
| E | **Engage** | Estimator as tool, then strong contact | Keep `CostEstimator`; elevate `ContactTerminal` as finale |

**Preserve (do not delete without approval):** bots showcase, project modals, bot simulator, cost estimator, contact terminal, Kuro, i18n/SEO, About route, language switcher, hash nav.

**Relocate / compress (propose, need approval):**
- Hero `StatsCounter` → below fold or About
- `ExperienceTimeline` → About or compact strip under intro
- Heavy stacked neon backgrounds → thinner system so type/collage can breathe

---

## 3. Mapping (provisional — AUGE OBSERVED TBD)

| Reference intent (from brief, not frames) | Proposed section | Existing component(s) | Required changes |
|-------------------------------------------|------------------|----------------------|------------------|
| Cinematic type hero | A Hero | `Hero`, `HeroRobot3D`, `Navbar` | Type scale/layout redesign; FA line-safe motion; Kuro secondary |
| Kinetic manifesto / collage | B Manifesto | `ConstellationField` (role), new collage layer | New copy keys; original assets; scroll-linked collage; no FA char-split |
| Clean intro / capabilities | C Intro | `TechStackMatrix`, maybe `SkillsRadarSection` | Quieter UI; logical props; LTR islands for code |
| Project rows / previews | D Work | `WebProjectsShowcase`, `TelegramBotsShowcase`, cards, modals | Row/preview interaction; keep data + modals |
| Final contact | E Contact | `ContactTerminal`, `CostEstimator` | Estimator before contact; contact as climax |
| Fixed nav / menu | Global | `Navbar`, `LanguageSwitcher` | Keep locale routes; refine hover only after AUGE menu OBSERVED |
| Background transitions | Global FX | `CosmosLayer`, glows, noise | Reduce competing loops; scene continuity TBD from reference |

---

## 4. Motion technology decisions

### Recommendation

| Layer | Tool | When |
|-------|------|------|
| Layout / type / simple hover | CSS + Tailwind | Default |
| Component enter/exit, buttons, modals | Framer Motion | Keep |
| Smooth scroll | Existing Lenis | Keep; no scroll hijack |
| Coordinated multi-element scroll scenes (manifesto collage, project row scrub) | **GSAP + ScrollTrigger — conditional** | Only if R01b frames show multi-track scrub beyond Milan progress |
| 3D | Existing R3F Kuro | Hero (and optional sparse accents); no full-page WebGL |
| Global scroll progress | Existing Milan `masterRaf` / `motionState` | Prefer extending before adding GSAP |

### If GSAP is added later

- **Scenes that may need it:** B (collage timeline), possibly D (row scrub). Not hero letter FX if Milan covers it.
- **Coexist with Framer:** GSAP owns scroll timelines; Framer owns discrete UI. No dual control of same transform.
- **Lenis sync:** `ScrollTrigger.scrollerProxy` or update ST on Lenis `scroll` + `ScrollTrigger.update`; one RAF owner.
- **Route cleanup:** kill tweens / `ScrollTrigger.getAll().forEach(t => t.kill())` on homepage unmount (About route).
- **Reduced motion:** skip Lenis + GSAP timelines; static layouts; Framer `useReducedMotion` already wired.
- **Do not install in R01.** Re-evaluate after AUGE sheets prove need. Prefer Milan extension first to avoid dependency weight on weak machines.

### Performance guardrails

- Prefer `transform` / `opacity`
- Cap continuous blur / backdrop-filter
- No large video backgrounds
- One primary scroll loop; avoid competing animation loops
- Lazy/mount Three only where meaningful

---

## 5. EN / FA architecture

- Design both locales from R02 onward; no EN-only motion that FA cannot do safely
- Persian: line/word-safe motion only; connected script; Vazirmatn retained
- English: Orbitron/Rajdhani OK; letter-split only where already gated (`locale !== "fa"`)
- Logical CSS (`ms`/`me`, `start`/`end`); do not auto-mirror decorative collage
- Code / terminal / technical strings stay LTR islands
- Preserve `/`, `/about`, `/fa`, `/fa/about` and translation keys; add `home` keys for new sections

---

## 6. R02–R06 implementation plan

| Phase | Goal | Exit criteria |
|-------|------|---------------|
| **R01b** (if needed) | Ingest AUGE video + sheets; fill `REFERENCE_BREAKDOWN.md` timeline | OBSERVED timeline + palette/type notes |
| **R02** | Hero redesign (type + Kuro placement + nav polish) | EN/FA hero, no FA char-split, reduced-motion OK |
| **R03** | Manifesto + collage (original assets) | Scroll continuity; performance budget on weak GPU |
| **R04** | Intro + capabilities compression | Stack/skills integrated; experience relocated or approved cut |
| **R05** | Selected work rows/previews + keep modals/bots | Interaction polish; i18n intact |
| **R06** | Estimator + contact climax + cleanup | SPA routes/SEO untouched; one production build when approved |

Each phase: no admin apps; preserve uncommitted work; await approval between phases.

---

## 7. Risks & unresolved decisions

| Item | Status |
|------|--------|
| AUGE visual ground truth | **BLOCKED** — media missing |
| GSAP vs Milan-only | Unresolved until R01b |
| First-viewport stats / awards | Do not invent; relocate or drop with approval |
| Collage imagery source | Must be original / licensed — never AUGE assets |
| Background system weight | Likely reduce; confirm after reference |
| Unified work feed vs projects+bots split | Needs product preference |
| Hosting / `VITE_SITE_URL` | Unrelated to R01; still open from M05 |

---

## 8. R02 readiness

**Not ready to implement visual redesign** until AUGE reference media is supplied **or** you explicitly approve proceeding from brief-only architecture (higher clone-risk / wrong pacing).

Ready now for: asset drop path, architecture agreement, feature-preservation list.
