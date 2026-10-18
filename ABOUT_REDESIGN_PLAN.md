# About Me Redesign Plan — R01

**Routes:** `/about` (EN LTR), `/fa/about` (FA RTL)  
**Do not redesign:** homepage `/` or `/fa`  
**Code changes:** none in R01 (documentation only)

---

## 1. Current About architecture

### Entry & routing

| Concern | Path / behavior |
|---------|-----------------|
| Page entry | `src/pages/About/About.jsx` |
| Router | `src/AppRouter.jsx` → `resolveRoute` page `"about"` |
| Locale / dir | `src/i18n/locale.js` (`applyDocumentLocale`); pre-React script in `index.html` |
| SEO shells | `src/i18n/seo.js` + post-build `scripts/generate-seo.mjs` → `dist/about/`, `dist/fa/about/` |
| Client meta | `src/components/seo/DocumentMeta.jsx` |
| Smooth scroll | Global `InteractionLayer` → `SmoothScroll` (Lenis) — shared with homepage; **do not retune Lenis in R-series without approval** |
| Motion foundation | Global `MotionFoundation` (Milan RAF) — About mostly ignores section metrics today |

### Mounted hierarchy (`About.jsx`)

```
About
├── NeonGrid, AmbientGlows, NoiseOverlay   (shared neon atmosphere)
├── AboutNav                               (fixed floating nav + LanguageSwitcher)
└── main
    ├── AboutWorkstation                   (primary experience)
    │   ├── boot sequence (Framer)
    │   ├── AboutChapterRail
    │   ├── CodeEditor                     (LTR code; typewriter)
    │   ├── AIResponsePanel                (i18n chapter responses)
    │   ├── AboutRobotGuide → KuroCompanion
    │   └── SystemStatusBar
    └── DepartureCTA                       (paths + hire / return)
```

### Data & i18n

| Asset | Role |
|-------|------|
| `src/i18n/locales/en/about.json` | Workstation UI, 7 chapters, departure |
| `src/i18n/locales/fa/about.json` | Matching FA keys |
| `src/data/aboutWorkstation.js` | Chapter IDs, commands, **untranslated** `code` strings, Kuro name |
| `src/data/aboutPage.js` | Used by DepartureCTA paths (+ legacy unmounted sections) |

### Chapters (content narrative today)

`identity` → `origin` → `journey` → `think` → `skills` → `projects` → `vision`  
Driven by rail selection + auto-advance typewriter session (not long-page scroll storytelling).

### Unmounted legacy (same folder — not in `About.jsx`)

`IdentityHero.jsx`, `StoryLog.jsx`, `JourneyArchive.jsx`, `MindModule.jsx`, `HumanChannel.jsx`, `TechSubsystem.jsx`  
Hardcoded EN in places; treat as salvage/reference only unless explicitly remounted.

### Motion today

- **Framer Motion:** boot/IDE presence, panel swaps, DepartureCTA `whileInView`, CodeEditor caret accents
- **Timers:** boot lines, code typing, chapter auto-advance; cleaned via `clearTimers`
- **Reduced motion:** `usePrefersReducedMotion` in workstation — skips boot/typing choreography
- **Three.js:** Kuro via `KuroCompanion` inside About (not hero homepage robot)
- **Lenis:** site-wide; About does not own a separate scroller
- **GSAP:** not present

---

## 2. Features that must remain intact

| Must keep | Why |
|-----------|-----|
| Routes `/about`, `/fa/about` + language switcher | Bilingual public contract |
| Locale `lang`/`dir` + Vazirmatn on FA | A11y / RTL |
| About i18n namespace + chapter content model | Truthful personal copy EN/FA |
| LTR islands for code / terminal strings | Technical readability |
| Kuro as presentation assistant (can restyle/reposition) | Brand character |
| Chapter technical `code` blocks (can restage visually) | Distinct “builder” identity |
| Departure links to home projects/bots/contact | Conversion paths |
| SEO about titles/descriptions (update copy later if needed) | M05 shells |
| Reduced-motion readable About | A11y |
| No Persian character-splitting | Script integrity |
| Homepage components untouched | Scope lock |

**Reusable with visual redesign:** AboutNav (simplify), chapter copy keys, CodeEditor/AIResponsePanel concepts, KuroCompanion, DepartureCTA content, shared UI (`NeonButton`, `GlassPanel` optional).

**Requires visual redesign:** overall composition (IDE-card as sole hero), neon atmosphere dominance, mid-size CTA, session-first vs scroll-story hierarchy.

---

## 3. Proposed About redesign architecture

Cinematic editorial **scroll narrative**, personal (Pouya / Kuro), not AUGE.

| # | Section | Narrative role | Content source | Visual approach |
|---|---------|----------------|----------------|-----------------|
| 0 | **Nav** | Minimal floating | `AboutNav` | Lighter chrome; keep locale + hire |
| 1 | **Identity** | Cinematic intro | `workstation` name/role + `chapters.identity` | Oversized type hero (R02); Kuro accent; FA line-safe |
| 2 | **Manifesto** | Kinetic type + collage | New keys from philosophy (`think` / vision beats) | Asymmetric type; original collage; color-field shifts (black ↔ accent cream/yellow translated to brand-safe tokens) |
| 3 | **Story** | Background & interests | `origin`, `journey` | Editorial columns / hover list; no fake milestones |
| 4 | **Expertise** | Technical identity | `skills` + LTR code excerpts | Stack + live code fragments from `aboutWorkstation` |
| 5 | **Highlights** | Meaningful work | `projects` (honest: live repo vs demo flags) | Interactive rows; link home `#projects` / `#bots` |
| 6 | **Finale** | Oversized CTA | `departure` | Full-bleed type CTA; paths retained |

**Workstation integration (preserve function, change stage):**  
After Identity (or within Expertise), remount a **compressed** “creator session” (rail + editor + AI panel + Kuro) as an interactive module — not the entire page metaphor. Boot sequence optional / reduced-motion instant.

**Background:** move from stacked neon grid/glow as primary identity toward editorial color fields + selective texture; keep subtle cyber cues so About still belongs to the same site.

---

## 4. EN / FA typography strategy

| | English | Persian |
|--|---------|---------|
| Display | Orbitron / Rajdhani OK for oversized kinetic lines | Vazirmatn; **no** per-character split or aggressive tracking |
| Motion units | Letter or word (gated) | Line or word-safe only; grapheme-aware if typewriter reused |
| Layout | Physical left emphasis OK if logical props used | RTL mirroring via logical CSS; **do not** auto-mirror collage art |
| Code | Always `dir="ltr"` | Same |
| Hierarchy | Hero name/role dominates first viewport | Same weight; translated strings from `about.json` |

---

## 5. Motion architecture recommendation

### Prefer (default)

- **CSS** for color/layout transitions and simple hovers
- **Framer Motion** for hero entrance, section reveals, hover list feedback, CTA
- **Existing Lenis** unchanged for smooth scroll
- **Existing timers / reduced-motion** patterns from workstation for any retained typing

### GSAP + ScrollTrigger

**Recommendation for R02–R03: do not add GSAP yet.**

| Factor | Assessment |
|--------|------------|
| Current About motion | Framer + timers sufficient for hero + section reveals |
| Complex multi-track scrub / pin | Not proven necessary; reference media UNKNOWN |
| Bundle / device cost | Extra dependency risky on weak hardware |
| Ownership conflict | Lenis + Milan RAF + GSAP ST needs careful proxying |
| Strict Mode | Double-mount cleanup burden increases with ST |

**Revisit GSAP only if** manifesto collage needs multi-element scrub beyond what Framer `useScroll`/`useTransform` + CSS can do cleanly. If added later: ST only on About route, kill on unmount, Lenis sync via scroll updates, full reduced-motion bypass, no scroll hijacking, minimal pins.

### Performance

- Cap continuous blur/backdrop-filter and infinite opacity loops on CTA
- One Kuro instance; pause when offscreen if feasible later
- Prefer `transform`/`opacity`; avoid full-viewport WebGL on About
- Honor `prefers-reduced-motion` with static editorial layout

---

## 6. Risks & unresolved assumptions

| Item | Status |
|------|--------|
| AUGE frame-accurate pacing | UNKNOWN — brief characteristics only |
| Exact yellow/cream token mapping vs cyan/purple brand | Assumption: adapt, don’t replace site identity wholesale |
| Collage image sources | Unresolved — must be original/licensed |
| Placeholder chapter lines (`[Editable…]`, demo projects) | Keep honesty; do not invent achievements |
| Unmounted legacy components | Reuse selectively or leave dead until cleanup milestone |
| SEO title still says “Creator Workspace” | May update when narrative renames — needs copy approval |
| Whether workstation stays mid-page or becomes optional drawer | Propose compressed mid-page module; confirm in R03 |

---

## 7. R02–R06 milestones

| Phase | Focus | Deliverable |
|-------|--------|-------------|
| **R02** | About **Identity Hero** (EN+FA) | Visually reviewable cinematic hero on `/about` & `/fa/about`; nav/locale intact; no homepage edits |
| **R03** | Manifesto + color/collage storytelling | Scroll section; original assets; FA-safe type motion |
| **R04** | Story + Expertise | Narrative + skills/code module; compressed workstation optional here |
| **R05** | Highlights + hover lists | Honest project/bot highlights; links home |
| **R06** | Oversized finale CTA + polish | Departure paths; reduced-motion; SEO copy tweak if approved |

Await approval between phases. No GSAP install unless a later phase proves need.

---

## 8. R02 visual acceptance criteria

R02 is **not** docs-only. Ship a reviewable About Hero:

1. **First viewport** reads as cinematic identity (name/role dominant), not the IDE workstation card.
2. Works on **`/about` and `/fa/about`** with correct `dir` and translated hero copy.
3. **No Persian character splitting**; FA typography remains connected.
4. Kuro may appear as secondary presence (existing companion OK) without blocking type.
5. Floating nav + language switch + hire path still work.
6. Reduced motion: hero still readable without entrance dependence.
7. Homepage files under `src/App.jsx` / homepage sections **unchanged**.
8. No new dependencies; no Lenis config changes.
9. Placeholder/demo honesty preserved — no invented awards.

---

## 9. Mapping: brief cues → About → reuse

| Brief cue (OBSERVED text) | Proposed About section | Existing pieces | Change type |
|---------------------------|------------------------|-----------------|-------------|
| Oversized kinetic type | Identity (+ Manifesto) | `AboutWorkstation` title → new Hero | Redesign |
| Editorial collage | Manifesto / Story | none mounted | New (original assets) |
| Hover lists | Story / Highlights | `AboutChapterRail`, departure cards | Adapt |
| Minimal floating nav | Nav | `AboutNav` | Light redesign |
| Color transitions | Global About chrome | `NeonGrid` / glows | Reduce / re-stage |
| Oversized final CTA | Finale | `DepartureCTA` | Scale up |
| Scroll storytelling | Page flow | Chapter session model | Add scroll sections; keep session as module |
| Interactive technical identity | Expertise | `CodeEditor`, `AIResponsePanel`, Kuro | Reuse inside new layout |
