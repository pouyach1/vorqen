import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

/** Act 06 — Oversized words collapse into one liner (editorial). */
export default function OdysseyScale() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const words = useMemo(() => {
    const raw = t("odyssey.scale.words", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, locale]);

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const giant = q("[data-sc-word]");
    const settle = q("[data-sc-settle]");
    const caption = q("[data-sc-caption]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(giant, { scale: 1, opacity: 1, yPercent: 0 });
    gsap.set(settle, { opacity: 0, y: 36, scale: 0.94 });
    gsap.set(caption, { opacity: 0.7 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(giant, { scale: 1.35, opacity: 1, yPercent: -6, stagger: 0.05, duration: 0.4 }, 0.1);
    tl.to({}, { duration: 0.14 });
    tl.to(giant, { scale: 0.35, opacity: 0, yPercent: -40, stagger: 0.03, duration: 0.36 }, 0.55);
    tl.to(settle, { opacity: 1, y: 0, scale: 1, duration: 0.28 }, 0.78);
    tl.to(caption, { opacity: 1, duration: 0.16 }, 0.88);
    tl.to({}, { duration: 0.18 });
    tl.to([settle, caption], { opacity: 0, y: -24, duration: 0.22 }, 1.15);
    sealChapterExit(tl, stage, 0.93);
    return tl;
  }, []);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=230%",
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-scale-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-[#0a0a10] text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[200vh] overflow-hidden bg-[#0a0a10] text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {!reduce && (
            <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {words.map((w) => (
                <span
                  key={w}
                  data-sc-word
                  className={
                    isFa
                      ? "font-display text-[clamp(2.4rem,10vw,7rem)] font-black leading-none text-white/90 will-change-transform"
                      : "font-display text-[clamp(2.6rem,11vw,8rem)] font-black leading-none tracking-tight text-white/90 will-change-transform"
                  }
                >
                  {w}
                </span>
              ))}
            </div>
          )}

          <h2
            id="odyssey-scale-title"
            data-sc-settle
            className={
              isFa
                ? `${reduce ? "relative" : "absolute"} max-w-2xl text-center font-display text-[clamp(1.6rem,4vw,2.8rem)] font-black leading-[1.4] text-cyan-neon`
                : `${reduce ? "relative" : "absolute"} max-w-2xl text-center font-display text-[clamp(1.8rem,4.2vw,3rem)] font-black leading-tight text-cyan-neon`
            }
          >
            {t("odyssey.scale.settle")}
          </h2>

          <p
            data-sc-caption
            className={
              isFa
                ? `${reduce ? "relative mt-6" : "absolute bottom-16"} max-w-md text-center font-heading text-base text-slate-400`
                : `${reduce ? "relative mt-6" : "absolute bottom-16"} max-w-md text-center font-heading text-sm uppercase tracking-[0.25em] text-slate-400`
            }
          >
            {t("odyssey.scale.caption")}
          </p>
        </div>
      </div>
    </section>
  );
}
