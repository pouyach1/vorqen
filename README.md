# Cyber Portfolio — DEX-v2

Cyberpunk / sci-fi personal portfolio built with React + Vite, Tailwind CSS,
React Three Fiber (Three.js), Framer Motion, and Zustand. Features a
procedural interactive 3D robot assistant, a searchable/filterable Telegram
bot hub with a live in-chat simulator modal (typing indicator + code
snippet view), a project gallery with 3D-tilt cards and case-study modals
(device frame toggle, architecture breakdown, Lighthouse scorecard), a
3-step live project cost estimator that generates a pre-filled Telegram
proposal link, a holographic tech-stack matrix, and a CLI-style terminal
contact widget.

## Requirements
- Node.js 18+ and npm 9+

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Project structure

```
cyber-portfolio/
├── index.html                     # HTML entry + Google Fonts (Orbitron, Rajdhani, JetBrains Mono)
├── package.json
├── vite.config.js
├── tailwind.config.js             # neon color tokens, glow shadows, grid/float keyframes
├── postcss.config.js
├── src/
│   ├── main.jsx                   # React root
│   ├── App.jsx                    # composes background layers + all sections
│   ├── index.css                  # Tailwind layers, glass-panel, neon-text utilities
│   │
│   ├── lib/
│   │   └── constants.js           # site name, nav links, hero stats, social links, robot messages
│   │
│   ├── data/                      # content — edit these to update the site
│   │   ├── telegramBots.js        # bots + categories, metrics, /commands, code snippets
│   │   ├── webProjects.js         # projects + brief, challenges, architecture, Lighthouse scores
│   │   ├── techStack.js
│   │   ├── experience.js
│   │   └── configurator.js        # project types, feature add-ons, timeline multipliers
│   │
│   ├── store/
│   │   └── useAppStore.js         # Zustand: active bot/project modal + configurator selections
│   │
│   ├── hooks/
│   │   ├── useMousePosition.js    # normalized cursor position for eye-tracking
│   │   └── useTypewriter.js       # typing/deleting message cycler
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # glass navbar, mobile menu, Hire Me CTA
│   │   │   └── Footer.jsx         # CLI terminal + social links
│   │   │
│   │   ├── background/
│   │   │   ├── NeonGrid.jsx       # animated CSS grid layer
│   │   │   ├── ParticleField.jsx  # R3F floating particle canvas
│   │   │   └── NoiseOverlay.jsx   # SVG film-grain texture
│   │   │
│   │   ├── robot/
│   │   │   ├── RobotModel.jsx     # procedural 3D mesh: head/eyes/core/hands + behaviors
│   │   │   ├── RobotCanvas.jsx    # R3F <Canvas>, lighting, Float wrapper
│   │   │   └── HologramBubble.jsx # speech bubble with typewriter text
│   │   │
│   │   ├── hero/
│   │   │   ├── Hero.jsx           # two-column hero layout
│   │   │   ├── HeroRobot3D.jsx    # robot canvas + bubble + click-pulse ring
│   │   │   └── StatsCounter.jsx   # animated count-up stats
│   │   │
│   │   ├── sections/
│   │   │   ├── TelegramBotsShowcase.jsx  # search, category filter, live status dashboard
│   │   │   ├── WebProjectsShowcase.jsx
│   │   │   ├── TechStackMatrix.jsx       # category filters + hover tooltips
│   │   │   ├── ExperienceTimeline.jsx
│   │   │   └── ContactTerminal.jsx       # simulated live chat widget
│   │   │
│   │   ├── configurator/
│   │   │   └── CostEstimator.jsx  # 4-step wizard: type → features → timeline → live estimate
│   │   │
│   │   ├── modals/
│   │   │   ├── ModalShell.jsx           # portal + AnimatePresence backdrop/panel wrapper
│   │   │   ├── BotSimulatorModal.jsx    # Telegram clone: commands, typing indicator, code view
│   │   │   └── ProjectDetailModal.jsx   # device frame, architecture, Lighthouse scorecard
│   │   │
│   │   ├── terminal/
│   │   │   └── TerminalContact.jsx  # CLI widget: help / contact / skills / clear
│   │   │
│   │   ├── cards/
│   │   │   ├── BotCard.jsx            # metrics grid + Launch + Interactive Demo
│   │   │   ├── ProjectCard.jsx        # mouse-tilt 3D hover, opens case-study modal
│   │   │   └── TechIcon.jsx
│   │   │
│   │   └── ui/
│   │       ├── GlassPanel.jsx
│   │       ├── NeonButton.jsx         # sweeping shine hover
│   │       ├── SectionHeading.jsx
│   │       ├── TypewriterText.jsx
│   │       └── StatusDot.jsx          # pulsing "ONLINE 24/7" dot
│   │
│   └── lib/
│       ├── constants.js
│       └── pricing.js             # configurator price/timeline math + Telegram deep-link builder
```

## Editing content
All real content lives under `src/data/` and `src/lib/constants.js` — swap in
your own name, bots, projects, tech stack, and experience there; components
never hardcode copy.

## Connecting to the shared admin dashboard (optional)
This site can share a live Supabase project with `cyber-admin-ai` (the admin
panel). Nothing here is required for the site to work — it's fully static
by default — but wiring it up gets you two things:

1. **Real site traffic in the admin dashboard.** Copy `.env.example` to
   `.env.local` and fill in the same Supabase URL/anon key used by
   `cyber-admin-ai`. `src/hooks/useTrackPageView.js` then logs one
   anonymous visit per page load to the shared `site_visits` table — no
   cookies, no personal data, just path/referrer/a random session id. The
   admin's Overview tab picks this up automatically.
2. **Live bot status on the Telegram Bots Hub.** `src/hooks/useLiveBotStats.js`
   reads the same `bots` table the admin panel manages and overlays real
   status/active-users/latency onto each bot card, matched by name — if a
   bot's name here doesn't match a row in Supabase (or Supabase isn't
   configured), that card just keeps its static demo numbers.

See `cyber-admin-ai/README.md` for the full shared schema and SQL.

## Notes
- The robot is built from primitive Three.js geometry (no external `.glb`
  needed), so it stays lightweight. Swap `RobotModel.jsx` for a loaded GLTF
  model later if you want a more detailed mesh — the eye-tracking/float/flip
  logic is written to be reusable against any `group` ref.
- Replace the placeholder Telegram links, GitHub/live URLs, and social links
  in `src/data/` and `src/lib/constants.js` with your real ones.
