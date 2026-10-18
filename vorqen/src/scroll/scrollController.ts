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
 * Lenis + ScrollTrigger official sync pattern.
 * Tall #scroll-proxy drives master 0–1 progress into the World.
 */
export function createScrollController(world: World): ScrollController {
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

  const proxy = document.querySelector<HTMLElement>("#scroll-proxy");
  if (!proxy) throw new Error("[VORQEN] #scroll-proxy missing");

  const state = { progress: 0, velocity: 0, lenis, destroy };

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

  // Kick first sync
  world.setProgress(0);
  ScrollTrigger.refresh();

  function destroy(): void {
    gsap.ticker.remove(ticker);
    ScrollTrigger.getAll().forEach((st) => st.kill());
    lenis.destroy();
  }

  return state;
}
