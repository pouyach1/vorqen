import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { LENIS } from "../../lib/interaction";

/**
 * Site-wide Lenis smooth scrolling.
 * - Skips when prefers-reduced-motion is on
 * - Uses a single rAF loop; destroyed on unmount
 * - Leaves Framer Motion scroll hooks on native scroll position (Lenis updates root)
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (reduce) return undefined;

    const prefersFine = window.matchMedia("(pointer: fine)").matches;
    // Keep native touch/momentum on phones; Lenis wheel smoothing on desktop/laptop.
    if (!prefersFine) return undefined;

    document.documentElement.classList.add("lenis");

    const lenis = new Lenis({
      duration: LENIS.duration,
      easing: LENIS.easing,
      smoothWheel: true,
      wheelMultiplier: LENIS.wheelMultiplier,
      touchMultiplier: LENIS.touchMultiplier,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Smooth in-page anchors without fighting Lenis
    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -88, duration: 1.15 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis");
    };
  }, [reduce]);

  return null;
}
