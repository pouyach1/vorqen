import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../../hooks/usePinnedScrollChapter";
import { SignalCore, SignalTick } from "../../signal/AboutSignalPrimitives";

export default function AboutStoryBridge() {
  const { t, i18n } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  const paragraphs = useMemo(() => {
    const raw = t("journey.bridge.paragraphs", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const pillars = useMemo(() => {
    const raw = t("journey.bridge.pillars", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const buildTimeline = useCallback(
    (q) => {
      const stage = q("[data-chapter-stage]");
      const nodes = q("[data-node]");
      const lines = q("[data-link]");
      const title = q("[data-bridge-title]");
      const paras = q("[data-bridge-p]");
      const pillarsEl = q("[data-pillar]");
      const cta = q("[data-bridge-cta]");
      const rule = q("[data-bridge-rule]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(nodes, { scale: 0.7, opacity: 0.55 });
      gsap.set(lines, { scaleX: 0, transformOrigin: locale === "fa" ? "100% 50%" : "0% 50%" });
      gsap.set([title, paras, cta], { opacity: 1, y: 0 });
      gsap.set(pillarsEl, { y: 10, opacity: 0.6 });
      gsap.set(rule, { scaleX: 0.35 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      tl.to(nodes, { scale: 1, opacity: 1, duration: 0.16, stagger: 0.03 }, 0.04);
      tl.to(lines, { scaleX: 1, duration: 0.18, stagger: 0.04 }, 0.1);
      tl.to(rule, { scaleX: 1, duration: 0.12 }, 0.16);
      tl.to(pillarsEl, { y: 0, opacity: 1, duration: 0.14, stagger: 0.04 }, 0.2);
      tl.to({}, { duration: 0.2 }, 0.45);
      tl.to([title, paras, pillarsEl, cta, nodes, lines, rule], { opacity: 0, y: -24, duration: 0.14 }, 0.72);
      sealChapterExit(tl, stage, 0.86);

      return tl;
    },
    [locale]
  );

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=130%",
    deps: [paragraphs.length, pillars.length],
  });

  return (
    <section
      ref={rootRef}
      id="about-story-bridge"
      aria-labelledby="about-story-bridge-title"
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-[#070b16] text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[180vh] overflow-hidden bg-[#070b16] text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(0,243,255,0.1),transparent_45%)]" />
            <span data-node className="absolute start-[12%] top-[28%]">
              <SignalCore size={10} />
            </span>
            <span data-node className="absolute start-[28%] top-[22%]">
              <SignalCore size={8} className="!bg-purple-neon !shadow-neon-purple" />
            </span>
            <span data-node className="absolute end-[18%] top-[34%]">
              <SignalCore size={10} />
            </span>
            <span
              data-link
              className="absolute start-[14%] top-[29%] h-px w-[14%] bg-gradient-to-r from-cyan-neon/80 to-purple-neon/50"
            />
            <span data-link className="absolute end-[20%] top-[35%] h-px w-[12%] bg-cyan-neon/40" />
          </div>

          <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-[1fr_1.15fr] md:px-10">
            <div>
              <SignalTick label={`${t("journey.bridge.index")} / ${t("journey.bridge.kicker")}`} />
              <h2
                id="about-story-bridge-title"
                data-bridge-title
                className="mt-5 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-black leading-[1.08] text-white"
              >
                {t("journey.bridge.title")}
              </h2>
              <div
                data-bridge-rule
                className="mt-6 h-1 w-28 origin-left bg-gradient-to-r from-cyan-neon to-purple-neon rtl:origin-right"
                aria-hidden
              />
              <ul className="mt-8 space-y-3">
                {pillars.map((item) => (
                  <li
                    key={item}
                    data-pillar
                    className="border-s-2 border-cyan-neon/50 ps-3 font-heading text-sm uppercase tracking-[0.16em] text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              {paragraphs.map((p) => (
                <p
                  key={p.slice(0, 32)}
                  data-bridge-p
                  className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg"
                >
                  {p}
                </p>
              ))}
              <p
                data-bridge-cta
                className="pt-3 font-heading text-sm uppercase tracking-[0.22em] text-cyan-neon"
              >
                {t("journey.bridge.cta")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
