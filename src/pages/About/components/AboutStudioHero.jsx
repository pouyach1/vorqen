import { useCallback, useRef } from "react";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

/**
 * Giant-word studio hero — reference rhythm, brand palette (void / cyan / purple).
 * Pin + scrub on desktop; static on mobile / reduced-motion.
 * FA: no uppercase / wide tracking; taller leading so Persian glyphs don't clip.
 */
export default function AboutStudioHero() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const word = q("[data-hero-word]");
    const caption = q("[data-hero-caption]");
    const cue = q("[data-hero-cue]");
    const wash = q("[data-hero-wash]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(word, { scale: 1, yPercent: 0, opacity: 1 });
    gsap.set([caption, cue], { opacity: 1, y: 0 });
    gsap.set(wash, { opacity: 0.35 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(wash, { opacity: 0.55, duration: 0.18 }, 0);
    tl.to(word, { scale: 1.12, yPercent: -6, duration: 0.45 }, 0.08);
    tl.to(caption, { y: -18, opacity: 0.55, duration: 0.2 }, 0.2);
    tl.to(cue, { opacity: 0, y: 12, duration: 0.14 }, 0.28);
    tl.to({}, { duration: 0.12 }, 0.48);
    tl.to(word, { scale: 1.28, yPercent: -22, opacity: 0, duration: 0.28 }, 0.62);
    tl.to([caption, wash], { opacity: 0, duration: 0.16 }, 0.72);
    sealChapterExit(tl, stage, 0.88);
    return tl;
  }, []);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=120%",
  });

  return (
    <section
      ref={rootRef}
      id="about-studio-hero"
      aria-labelledby="about-studio-hero-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[180vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div
            data-hero-wash
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.12),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(112,0,255,0.14),transparent_45%)]"
          />

          <motion.h1
            id="about-studio-hero-title"
            data-hero-word
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className={
              isFa
                ? "relative z-10 w-full max-w-[96vw] text-center font-display text-[clamp(3.2rem,14vw,10rem)] font-black leading-[1.12] tracking-normal will-change-transform"
                : "relative z-10 w-full max-w-[96vw] text-center font-display text-[clamp(3.5rem,18vw,14rem)] font-black leading-[0.82] tracking-[-0.04em] will-change-transform"
            }
          >
            <span className="bg-gradient-to-br from-cyan-neon via-white to-purple-neon bg-clip-text text-transparent">
              {t("studioHero.word")}
            </span>
          </motion.h1>

          <motion.p
            data-hero-caption
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className={
              isFa
                ? "relative z-10 mt-8 max-w-lg text-center font-heading text-sm leading-relaxed tracking-normal text-slate-400 md:text-base"
                : "relative z-10 mt-8 max-w-md text-center font-heading text-sm uppercase tracking-[0.28em] text-slate-400 md:text-base"
            }
          >
            {t("studioHero.caption")}
          </motion.p>

          <motion.p
            data-hero-cue
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className={
              isFa
                ? "absolute bottom-10 z-10 font-heading text-xs tracking-normal text-cyan-neon/80"
                : "absolute bottom-10 z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-neon/70"
            }
          >
            {t("studioHero.scroll")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
