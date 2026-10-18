import { useEffect } from "react";
import gsap from "gsap";
import { ensureScrollTrigger } from "../../../lib/scrollTriggerLenis";

/**
 * Seal a chapter stage so unpinned leftover transforms never ghost over later scenes.
 * Call at the end of every scrub timeline (progress ≈ 1 → fully gone).
 */
export function sealChapterExit(tl, stage, at = 0.9) {
  if (!stage?.length && !stage) return;
  tl.to(
    stage,
    {
      autoAlpha: 0,
      y: -28,
      duration: 0.12,
      overwrite: "auto",
    },
    at
  );
}

/**
 * Desktop-pinned / mobile-flow scrub chapter with clear visual ownership.
 * buildTimeline(q, pin) must:
 *  - keep primary copy readable at progress 0
 *  - include a hold
 *  - call sealChapterExit (or end at autoAlpha 0)
 */
export function usePinnedScrollChapter({
  rootRef,
  pinRef,
  reduce,
  locale,
  buildTimeline,
  desktopEnd = "+=150%",
  deps = [],
}) {
  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin || reduce) return undefined;

    const ScrollTrigger = ensureScrollTrigger();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(pin);
      const stage = q("[data-chapter-stage]");
      const mm = gsap.matchMedia();

      const wire = (config) => {
        const animation = buildTimeline(q, pin);
        // Progress 0: visible ownership of this chapter
        if (stage.length) gsap.set(stage, { autoAlpha: 1, y: 0, clearProps: "visibility" });
        animation.progress(0).pause();

        ScrollTrigger.create({
          ...config,
          trigger: root,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          anticipatePin: 1,
          animation,
          // When fully past, force sealed end-state (prevents ghost text after unpin)
          onLeave: () => {
            if (stage.length) gsap.set(stage, { autoAlpha: 0, y: -28 });
            animation.progress(1);
          },
          // Re-enter from below — scrub will reverse; restore stage for reverse playback
          onEnterBack: () => {
            if (stage.length) gsap.set(stage, { autoAlpha: 1, y: 0 });
          },
          // Entering from above — ensure start state
          onEnter: () => {
            if (stage.length) gsap.set(stage, { autoAlpha: 1, y: 0 });
          },
          // Left upward past start — don't leave mid-transforms for the next paint
          onLeaveBack: () => {
            animation.progress(0);
            if (stage.length) gsap.set(stage, { autoAlpha: 1, y: 0 });
          },
        });
      };

      mm.add("(min-width: 768px)", () => {
        wire({
          start: "top top",
          end: desktopEnd,
          pin,
          pinSpacing: true,
          scrub: 0.4,
        });
      });

      mm.add("(max-width: 767px)", () => {
        wire({
          start: "top 75%",
          end: "bottom 15%",
          scrub: 0.5,
        });
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 60);
    const t2 = window.setTimeout(refresh, 380);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, locale, desktopEnd, ...deps]);
}
