import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

const BEATS = ["curiosity", "craft", "vorqen", "becoming"];

/** Act 07 — Maker path timeline (resume strength). */
export default function OdysseyTimeline() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const items = useMemo(
    () =>
      BEATS.map((id) => ({
        id,
        index: t(`odyssey.timeline.${id}.index`),
        title: t(`odyssey.timeline.${id}.title`),
        body: t(`odyssey.timeline.${id}.body`),
      })),
    [t, locale]
  );

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const cards = q("[data-tl-card]");
    const line = q("[data-tl-line]");
    const kicker = q("[data-tl-kicker]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(kicker, { opacity: 1 });
    gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(cards, { opacity: 1, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(line, { scaleY: 1, duration: 0.55 }, 0.08);
    cards.forEach((_, i) => {
      const at = 0.14 + i * 0.14;
      tl.to(cards[i], { y: -6, duration: 0.14 }, at);
      if (i > 0) tl.to(cards[i - 1], { opacity: 0.5, y: 0, duration: 0.14 }, at);
    });
    tl.to({}, { duration: 0.22 });
    tl.to(cards, { opacity: 0, y: -24, stagger: 0.03, duration: 0.24 }, 0.88);
    tl.to([line, kicker], { opacity: 0, duration: 0.16 }, 0.95);
    sealChapterExit(tl, stage, 0.92);
    return tl;
  }, []);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=250%",
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-timeline-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[220vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-[100svh]"
      >
        <div
          data-chapter-stage
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24"
        >
          <p
            data-tl-kicker
            id="odyssey-timeline-title"
            className={
              isFa
                ? "mb-10 font-heading text-sm text-purple-neon"
                : "mb-10 font-mono text-[11px] uppercase tracking-[0.35em] text-purple-neon"
            }
          >
            {t("odyssey.timeline.kicker")}
          </p>

          <div className="relative grid gap-8 md:grid-cols-[48px_1fr]">
            <div className="relative mx-auto hidden w-px md:block" aria-hidden>
              <div
                data-tl-line
                className={`absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-cyan-neon via-purple-neon to-transparent ${
                  reduce ? "scale-y-100" : ""
                }`}
              />
            </div>

            <div className="grid gap-6 md:gap-8">
              {items.map((item) => (
                <article
                  key={item.id}
                  data-tl-card
                  className="relative rounded-2xl border border-cyan-neon/20 bg-[#0a1018]/70 p-5 backdrop-blur-sm md:p-6"
                >
                  <p
                    className={
                      isFa
                        ? "font-heading text-sm text-cyan-neon"
                        : "font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-neon"
                    }
                  >
                    <span dir="ltr">{item.index}</span>
                  </p>
                  <h3
                    className={
                      isFa
                        ? "mt-2 font-display text-2xl font-black leading-snug text-white md:text-3xl"
                        : "mt-2 font-display text-2xl font-black text-white md:text-3xl"
                    }
                  >
                    {item.title}
                  </h3>
                  <p
                    className={
                      isFa
                        ? "mt-3 font-heading text-base leading-[1.9] text-slate-400"
                        : "mt-3 font-heading text-base leading-relaxed text-slate-400"
                    }
                  >
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
