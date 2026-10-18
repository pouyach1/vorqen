# AUGE /works — OBSERVED interaction logic

Source: live inspection of https://auge-xp.com/works (2026-10-16).

## Layout (viewport = one composition)

| Zone | Role |
|------|------|
| Far start edge | Vertical thumbnail strip (small covers), offset outward as distance from focus grows |
| Center | Large active cover (~16:10), scale slightly above 1 |
| Beside cover | Index `(001)` + oversized project title + thin category under active |
| Above / below focus | Other titles, smaller / lower opacity — same vertical list |

## Scroll model (INFERRED from DOM + behavior)

- Document height ≈ viewport on Works route — list motion is scrubbed / virtualized, not a normal long page of cards.
- Project names repeat in the accessibility tree (circular / recycled list).
- GSAP present (`gsapVersions` on `window`).
- Active item = list row nearest vertical focus; cover swaps with clip/scale, not a card grid.
- Click cover / title opens project detail.

## Portfolio mapping (implemented)

- Homepage `#projects` → pinned works reel (desktop), stacked covers (mobile), ProjectCard grid (reduced motion).
- Data: existing `webProjects` + `home:projects.items.*` (EN/FA).
- Brand: void + cyan accent — not AUGE type, assets, or copy.
