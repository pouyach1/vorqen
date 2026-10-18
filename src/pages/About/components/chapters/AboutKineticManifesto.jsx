import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../../hooks/usePinnedScrollChapter";
import { SignalTick } from "../../signal/AboutSignalPrimitives";

/**
 * Asymmetric editorial breakout — Doctrine chapter.
 * Off-grid type, diagonal plate, parallax annotations, sealed exit.
 */
export default function AboutKineticManifesto() {
  const { t, i18n } = useTranslation("about");
  const { locale, dirSign } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  const words = useMemo(() => {
    const raw = t("journey.manifesto.words", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const buildTimeline = useCallback(
    (q) => {
      const stage = q("[data-chapter-stage]");
      const wordsEl = q("[data-word]");
      const plate = q("[data-plate]");
      const notes = q("[data-note]");
      const rule = q("[data-rule]");
      const ghost = q("[data-ghost-type]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(wordsEl, { yPercent: 0, opacity: 1, scale: 1, xPercent: 0 });
      gsap.set(plate, { rotate: -8 * dirSign, xPercent: dirSign * -6, opacity: 0.85 });
      gsap.set(notes, { opacity: 0.7, y: 0 });
      gsap.set(rule, { scaleX: 0.25 });
      gsap.set(ghost, { opacity: 0.08, yPercent: 10 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // Entrance settle
      tl.to(rule, { scaleX: 1, duration: 0.12 }, 0.04);
      tl.to(plate, { rotate: -14 * dirSign, xPercent: 0, opacity: 1, duration: 0.2 }, 0.06);
      tl.to(ghost, { opacity: 0.14, yPercent: 0, duration: 0.18 }, 0.1);

      // Readable hold + asymmetric drift
      tl.to(
        wordsEl,
        {
          scale: (i) => (i === 0 ? 1.08 : 1.02 - i * 0.04),
          xPercent: (i) => dirSign * (i === 0 ? -4 : i === 1 ? 18 : -10),
          yPercent: (i) => (i === 1 ? 8 : -4 - i * 3),
          duration: 0.28,
          stagger: 0.04,
        },
        0.22
      );
      tl.to(plate, { yPercent: -12, xPercent: dirSign * 8, duration: 0.28 }, 0.22);
      tl.to(notes, { x: dirSign * 28, opacity: 0.9, duration: 0.18 }, 0.3);

      // Hold
      tl.to({}, { duration: 0.16 }, 0.52);

      // Complete exit — no residual glyphs
      tl.to(wordsEl, { yPercent: -40, opacity: 0, duration: 0.14, stagger: 0.02 }, 0.7);
      tl.to([plate, notes, rule, ghost], { opacity: 0, y: -24, duration: 0.12 }, 0.74);
      sealChapterExit(tl, stage, 0.86);

      return tl;
    },
    [dirSign]
  );

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=150%",
    deps: [words.length],
  });

  return (
    <section
      ref={rootRef}
      id="about-manifesto"
      aria-labelledby="about-manifesto-title"
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[200vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0">
          {/* Ghost oversized type — off grid */}
          <p
            data-ghost-type
            aria-hidden
            className="pointer-events-none absolute -end-[8%] top-[8%] font-display text-[clamp(5rem,22vw,14rem)] font-black leading-none text-cyan-neon/10"
          >
            {words[0]}
          </p>

          {/* Diagonal geometric plate */}
          <div
            data-plate
            className="pointer-events-none absolute start-[8%] top-[18%] h-[58%] w-[42%] max-w-md border border-cyan-neon/35 bg-gradient-to-br from-cyan-neon/15 via-transparent to-purple-neon/20 md:start-[12%]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute end-[14%] bottom-[22%] h-3 w-3 bg-purple-neon"
            aria-hidden
          />

          <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl items-center gap-8 px-6 py-28 md:grid-cols-[1.1fr_0.9fr] md:px-10">
            <div className="md:-rotate-1">
              <SignalTick
                label={`${t("journey.manifesto.index")} / ${t("journey.manifesto.kicker")}`}
              />
              <h2 id="about-manifesto-title" className="sr-only">
                {t("journey.manifesto.kicker")}
              </h2>

              <div className="mt-6 space-y-0">
                {words.map((word, i) => (
                  <p
                    key={`${locale}-m-${i}`}
                    data-word
                    className={`font-display font-black leading-[0.88] tracking-[-0.035em] text-[clamp(2.8rem,9vw,6.5rem)] will-change-transform ${
                      i === 0
                        ? "text-white"
                        : i === 1
                          ? "bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent md:ps-[18%]"
                          : "text-slate-200 md:ps-[8%]"
                    }`}
                  >
                    {word}
                  </p>
                ))}
              </div>

              <div
                data-rule
                className="mt-8 h-px w-full max-w-md origin-left bg-cyan-neon rtl:origin-right"
                aria-hidden
              />
            </div>

            <aside className="md:translate-y-10 md:ps-6">
              <p
                data-note
                className="max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-slate-500"
              >
                {t("journey.manifesto.annotation")}
              </p>
              <p
                data-note
                className="mt-6 max-w-sm font-heading text-sm uppercase tracking-[0.18em] text-slate-300"
              >
                {t("journey.manifesto.footer")}
              </p>
              <div
                data-note
                className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-neon/60"
              >
                <span className="h-px w-10 bg-cyan-neon/50" aria-hidden />
                {t("journey.manifesto.breakout")}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
