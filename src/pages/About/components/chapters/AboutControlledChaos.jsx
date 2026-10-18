import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../../hooks/usePinnedScrollChapter";
import { SignalTick } from "../../signal/AboutSignalPrimitives";

const FRAGMENTS = [
  { id: "a", className: "start-[5%] top-[16%] h-24 w-36 bg-cyan-neon md:h-32 md:w-48", rot: -7, depth: 1.25 },
  { id: "b", className: "end-[7%] top-[20%] h-24 w-24 rounded-full border-2 border-purple-neon/80", rot: 14, depth: 0.75 },
  { id: "c", className: "start-[38%] top-[10%] h-2.5 w-2.5 bg-cyan-neon", rot: 0, depth: 1.7 },
  { id: "d", className: "end-[16%] bottom-[26%] h-40 w-16 bg-purple-neon/50 md:h-48", rot: 5, depth: 0.95 },
  { id: "e", className: "start-[10%] bottom-[20%] h-14 w-44 border border-cyan-neon/40 bg-void/60", rot: -5, depth: 1.15 },
  { id: "f", className: "start-[52%] top-[38%] h-32 w-32 border border-magenta-neon/45", rot: 20, depth: 1.4 },
];

export default function AboutControlledChaos() {
  const { t, i18n } = useTranslation("about");
  const { locale, dirSign } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  const tags = useMemo(() => {
    const raw = t("journey.chaos.tags", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const buildTimeline = useCallback(
    (q) => {
      const stage = q("[data-chapter-stage]");
      const frags = q("[data-frag]");
      const titles = q("[data-chaos-line]");
      const tagsEl = q("[data-tag]");
      const slash = q("[data-slash]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(frags, { opacity: 0.9, scale: 1, y: 0 });
      gsap.set(titles, { yPercent: 0, opacity: 1 });
      gsap.set(tagsEl, { opacity: 1, y: 0 });
      gsap.set(slash, { scaleX: 0, transformOrigin: locale === "fa" ? "100% 50%" : "0% 50%" });

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      tl.to(slash, { scaleX: 1, duration: 0.12 }, 0.04);
      tl.to(
        frags,
        {
          y: (_i, el) => -60 * Number(el.getAttribute("data-depth") || 1),
          x: (i) => dirSign * (i % 2 === 0 ? -40 : 48),
          rotation: (_i, el) => Number(el.getAttribute("data-rot") || 0) * 1.5,
          duration: 0.4,
          stagger: 0.02,
        },
        0.08
      );
      tl.to(titles, { yPercent: -14, scale: 1.06, xPercent: dirSign * -6, duration: 0.32 }, 0.12);
      tl.to(tagsEl, { y: -24, opacity: 0.65, duration: 0.2 }, 0.28);
      tl.to({}, { duration: 0.14 }, 0.5);
      tl.to(titles, { yPercent: -50, opacity: 0, duration: 0.14 }, 0.68);
      tl.to([frags, tagsEl, slash], { opacity: 0, y: -20, duration: 0.12 }, 0.72);
      sealChapterExit(tl, stage, 0.84);

      return tl;
    },
    [dirSign, locale]
  );

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=145%",
    deps: [tags.length],
  });

  return (
    <section
      ref={rootRef}
      id="about-chaos"
      aria-labelledby="about-chaos-title"
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
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {FRAGMENTS.map((f) => (
              <div
                key={f.id}
                data-frag
                data-depth={f.depth}
                data-rot={f.rot}
                className={`absolute ${f.className}`}
                style={{ transform: `rotate(${f.rot}deg)` }}
              />
            ))}
            <span
              data-slash
              className="absolute start-[12%] top-[30%] h-px w-[40%] bg-gradient-to-r from-cyan-neon to-purple-neon"
            />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-6 py-24 md:px-10">
            <div>
              <SignalTick
                label={`${t("journey.chaos.index")} / ${t("journey.chaos.kicker")}`}
              />
              <h2
                id="about-chaos-title"
                className="mt-5 font-display text-[clamp(2.1rem,6.5vw,4.75rem)] font-black leading-[0.94] text-white"
              >
                <span data-chaos-line className="block">
                  {t("journey.chaos.line1")}
                </span>
                <span data-chaos-line className="mt-2 block bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent">
                  {t("journey.chaos.line2")}
                </span>
              </h2>
              <p data-chaos-line className="mt-6 max-w-lg text-base text-slate-400 md:text-lg">
                {t("journey.chaos.body")}
              </p>
              <ul className="mt-10 flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    data-tag
                    className="border border-cyan-neon/35 bg-void/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-neon"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
