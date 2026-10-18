# VORQEN — Cyber Portfolio

Scroll-driven 3D cyberpunk portfolio (Persian RTL + English LTR).

## Stack

Vite · TypeScript (strict) · Three.js · GSAP ScrollTrigger · Lenis · postprocessing · Tone.js

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Quality override

```
http://localhost:5173/?quality=low|medium|high
```

## Content

Edit bilingual data in `/src/data` (projects, skills, about).  
Dialogue & UI strings live in `/src/i18n`.

## Env

Copy `.env.example` → `.env` and set `VITE_CONTACT_ENDPOINT`.

## Status

- **Step 1** scaffold, tokens, fonts, folders  
- **Step 2** WebGL renderer, CatmullRom camera rig, quality tiers, RAF loop  
- **Step 3** Lenis + GSAP ScrollTrigger → 0–1 world progress  

Debug neon markers are temporary until Scene 1 (Signal) lands.
