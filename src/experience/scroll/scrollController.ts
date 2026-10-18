import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { World } from "../core/world";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollController {
  progress: number;
  velocity: number;
  lenis: Lenis;
  destroy(): void;
}

/**
 * Lenis + ScrollTrigger sync pattern.
 * Tall scroll-proxy element drives master 0–1 progress into the World.
 */
export function createScrollController(
  world: World,
  proxy: HTMLElement
): ScrollController {
  const reduced = world.state.reducedMotion;

  const lenis = new Lenis({
    duration: reduced ? 0.6 : 1.15,
    smoothWheel: !reduced,
    touchMultiplier: 1.1,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  const state: ScrollController = {
    progress: 0,
    velocity: 0,
    lenis,
    destroy,
  };

  ScrollTrigger.create({
    trigger: proxy,
    start: "top top",
    end: "bottom bottom",
    scrub: reduced ? false : 0.65,
    onUpdate: (self) => {
      state.progress = self.progress;
      world.setProgress(self.progress);
    },
  });

  lenis.on("scroll", (e: { velocity: number }) => {
    state.velocity = e.velocity;
    world.setVelocity(e.velocity);
  });

  world.setProgress(0);
  ScrollTrigger.refresh();

  function destroy(): void {
    gsap.ticker.remove(ticker);
    ScrollTrigger.getAll().forEach((st) => st.kill());
    lenis.destroy();
  }

  return state;
}
