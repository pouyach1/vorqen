import { useCallback, useRef } from "react";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

/** Act 01 — Giant SIGNAL ignition (cyber). */
export default function OdysseyIgnition() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const word = q("[data-ig-word]");
    const caption = q("[data-ig-caption]");
    const cue = q("[data-ig-cue]");
    const wash = q("[data-ig-wash]");
    const rays = q("[data-ig-ray]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(word, { scale: 1, yPercent: 0, opacity: 1 });
    gsap.set([caption, cue], { opacity: 1, y: 0 });
    gsap.set(wash, { opacity: 0.4 });
    gsap.set(rays, { scaleX: 0.4, opacity: 0.35 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(wash, { opacity: 0.7, duration: 0.2 }, 0);
    tl.to(rays, { scaleX: 1.2, opacity: 0.7, duration: 0.35 }, 0.05);
    tl.to(word, { scale: 1.14, yPercent: -8, duration: 0.5 }, 0.1);
    tl.to(caption, { y: -20, opacity: 0.5, duration: 0.22 }, 0.28);
    tl.to(cue, { opacity: 0, y: 14, duration: 0.14 }, 0.35);
    tl.to({}, { duration: 0.16 }, 0.55);
    tl.to(word, { scale: 1.45, yPercent: -28, opacity: 0, duration: 0.32 }, 0.72);
    tl.to([caption, wash, rays], { opacity: 0, duration: 0.18 }, 0.85);
    sealChapterExit(tl, stage, 0.92);
    return tl;
  }, []);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=220%",
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-ignition-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[200vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div
            data-ig-wash
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.14),transparent_55%),radial-gradient(ellipse_at_80%_15%,rgba(112,0,255,0.16),transparent_48%)]"
          />
          {[0, 45, 90, 135].map((deg) => (
            <span
              key={deg}
              data-ig-ray
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[min(80vw,640px)] origin-center bg-gradient-to-r from-transparent via-cyan-neon/70 to-transparent will-change-transform"
              style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
            />
          ))}

          <motion.h1
            id="odyssey-ignition-title"
            data-ig-word
            initial={reduce ? false : { opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className={
              isFa
                ? "relative z-10 w-full max-w-[96vw] text-center font-display text-[clamp(3.4rem,15vw,10.5rem)] font-black leading-[1.1] tracking-normal will-change-transform"
                : "relative z-10 w-full max-w-[96vw] text-center font-display text-[clamp(3.6rem,18vw,14rem)] font-black leading-[0.82] tracking-[-0.04em] will-change-transform"
            }
          >
            <span className="bg-gradient-to-br from-cyan-neon via-white to-purple-neon bg-clip-text text-transparent">
              {t("odyssey.ignition.word")}
            </span>
          </motion.h1>

          <p
            data-ig-caption
            className={
              isFa
                ? "relative z-10 mt-8 max-w-lg text-center font-heading text-base leading-relaxed text-slate-400 md:text-lg"
                : "relative z-10 mt-8 max-w-md text-center font-heading text-sm uppercase tracking-[0.28em] text-slate-400 md:text-base"
            }
          >
            {t("odyssey.ignition.caption")}
          </p>

          <p
            data-ig-cue
            className={
              isFa
                ? "absolute bottom-10 z-10 font-heading text-sm text-cyan-neon/85"
                : "absolute bottom-10 z-10 font-mono text-xs uppercase tracking-[0.32em] text-cyan-neon/75"
            }
          >
            {t("odyssey.ignition.scroll")}
          </p>
        </div>
      </div>
    </section>
  );
}
