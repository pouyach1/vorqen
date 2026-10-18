import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

const SHARDS = [
  { className: "start-[6%] top-[18%] h-20 w-32 bg-cyan-neon md:h-28 md:w-44", rot: -8, depth: 1.3 },
  { className: "end-[8%] top-[22%] h-24 w-24 rounded-full border-2 border-purple-neon/80", rot: 14, depth: 0.8 },
  { className: "start-[40%] top-[12%] h-2 w-2 bg-cyan-neon", rot: 0, depth: 1.6 },
  { className: "start-[18%] bottom-[22%] h-16 w-16 border border-cyan-neon/50", rot: 22, depth: 1.1 },
  { className: "end-[18%] bottom-[18%] h-12 w-28 bg-purple-neon/80", rot: -12, depth: 0.9 },
  { className: "start-[55%] top-[48%] h-px w-40 bg-gradient-to-r from-cyan-neon to-transparent", rot: 0, depth: 1.4 },
];

/** Act 05 — Controlled fragment field (hybrid). */
export default function OdysseyFragments() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const tags = useMemo(() => {
    const raw = t("odyssey.fragments.tags", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, locale]);

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const shards = q("[data-fg-shard]");
    const tagEls = q("[data-fg-tag]");
    const title = q("[data-fg-title]");
    const body = q("[data-fg-body]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(shards, { x: 0, y: 0, rotate: 0, opacity: 0.85 });
    gsap.set(tagEls, { opacity: 0.85, y: 0 });
    gsap.set([title, body], { opacity: 1, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to({}, { duration: 0.1 });
    shards.forEach((el, i) => {
      const d = SHARDS[i]?.depth || 1;
      tl.to(
        el,
        {
          x: (i % 2 === 0 ? -1 : 1) * 40 * d,
          y: (i % 3 === 0 ? -1 : 1) * 50 * d,
          rotate: (SHARDS[i]?.rot || 0) * 1.5,
          opacity: 0.35,
          duration: 0.55,
        },
        0.08
      );
    });
    tl.to(tagEls, { opacity: 1, y: -4, stagger: 0.04, duration: 0.28 }, 0.18);
    tl.to({}, { duration: 0.2 });
    tl.to(title, { scale: 1.04, duration: 0.2 }, 0.55);
    tl.to([title, body, tagEls], { opacity: 0, y: -30, duration: 0.28 }, 0.78);
    tl.to(shards, { opacity: 0, duration: 0.2 }, 0.85);
    sealChapterExit(tl, stage, 0.92);
    return tl;
  }, []);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=210%",
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-fragments-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-[#06060a] text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[190vh] overflow-hidden bg-[#06060a] text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0">
          {SHARDS.map((s, i) => (
            <span
              key={i}
              data-fg-shard
              aria-hidden
              className={`pointer-events-none absolute ${s.className} will-change-transform`}
              style={{ transform: `rotate(${s.rot}deg)` }}
            />
          ))}

          <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:px-24">
            <p
              className={
                isFa
                  ? "mb-4 font-heading text-sm text-cyan-neon"
                  : "mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-neon"
              }
            >
              {t("odyssey.fragments.kicker")}
            </p>
            <h2
              id="odyssey-fragments-title"
              data-fg-title
              className={
                isFa
                  ? "max-w-2xl font-display text-[clamp(2rem,5.5vw,3.6rem)] font-black leading-[1.3] text-white"
                  : "max-w-2xl font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-black leading-[1.08] text-white"
              }
            >
              {t("odyssey.fragments.title")}
            </h2>
            <p
              data-fg-body
              className={
                isFa
                  ? "mt-5 max-w-lg font-heading text-base leading-[1.9] text-slate-400"
                  : "mt-5 max-w-lg font-heading text-base text-slate-400"
              }
            >
              {t("odyssey.fragments.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  data-fg-tag
                  className="rounded-full border border-cyan-neon/30 bg-cyan-neon/5 px-3 py-1 font-heading text-xs text-cyan-neon/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
