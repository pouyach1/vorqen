/**
 * Interaction-layer constants — keep motion.js as the reveal language;
 * these tune scroll / magnetic / cursor feel only.
 */

export const LENIS = {
  duration: 0.9,
  wheelMultiplier: 0.95,
  touchMultiplier: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

export const MAGNETIC = {
  strength: 0.22,
  maxPull: 7,
  spring: { stiffness: 260, damping: 26, mass: 0.3 },
};

export const CURSOR = {
  ringSpring: { stiffness: 200, damping: 28, mass: 0.35 },
  dotSpring: { stiffness: 520, damping: 38, mass: 0.18 },
  idleScale: 1,
  hoverScale: 1.4,
};
