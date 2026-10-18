/**
 * Shared motion language — calm, purposeful.
 * Prefer short opacity/y reveals over cinematic overshoot.
 */

export const EASE = {
  out: [0.22, 1, 0.36, 1],
  cinematic: [0.16, 1, 0.3, 1],
  snappy: [0.2, 0.8, 0.2, 1],
  settle: [0.33, 1, 0.68, 1],
};

export const DURATION = {
  fast: 0.28,
  base: 0.45,
  slow: 0.65,
  hero: 0.75,
};

export const fadeUp = (delay = 0, duration = DURATION.base) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASE.out },
});

export const fadeIn = (delay = 0, duration = DURATION.base) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, delay, ease: EASE.out },
});

export const revealViewport = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: DURATION.base, ease: EASE.out },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};
