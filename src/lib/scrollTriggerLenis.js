import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register ScrollTrigger once; safe to call repeatedly. */
export function ensureScrollTrigger() {
  if (registered) return ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
  return ScrollTrigger;
}

/**
 * Keep ScrollTrigger in sync with Lenis without changing Lenis options.
 * Call from the Lenis "scroll" handler; returns nothing.
 */
export function syncScrollTriggerWithLenis() {
  ensureScrollTrigger();
  ScrollTrigger.update();
}
