import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../../hooks/usePinnedScrollChapter";
import { SignalTick } from "../../signal/AboutSignalPrimitives";

export default function AboutTypeExplosion() {
  const { t, i18n } = useTranslation("about");
  const { locale, dirSign } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  const layers = useMemo(() => {
    const raw = t("journey.explosion.layers", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const buildTimeline = useCallback(
    (q) => {
      const stage = q("[data-chapter-stage]");
      const giant = q("[data-giant]");
      const ghost = q("[data-ghost]");
      const frame = q("[data-frame]");
      const shards = q("[data-shard]");
      const caption = q("[data-caption]");
      const align = q("[data-align]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(giant, { scale: 0.95, opacity: 1 });
      gsap.set(ghost, { opacity: 0.12, scale: 1 });
      gsap.set(frame, { scaleX: 0.25, opacity: 0.7 });
      gsap.set(shards, { opacity: 1, y: 0, x: 0 });
      gsap.set(caption, { opacity: 0.75 });
      gsap.set(align, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      tl.to(frame, { scaleX: 1, opacity: 1, duration: 0.14 }, 0.04);
      tl.to(giant, { scale: 1.45, duration: 0.26 }, 0.08);
      tl.to(ghost, { opacity: 0.28, scale: 1.3, duration: 0.22 }, 0.12);
      tl.to(
        giant,
        {
          scale: 2.05,
          xPercent: dirSign * -8,
          ...(locale === "fa" ? {} : { letterSpacing: "0.04em" }),
          duration: 0.28,
        },
        0.34
      );
      tl.to(
        shards,
        {
          x: (i) => dirSign * (i % 2 === 0 ? -90 : 100),
          y: (i) => (i % 2 === 0 ? -48 : 56),
          opacity: 0.45,
          duration: 0.24,
        },
        0.38
      );
      // Hold at peak
      tl.to({}, { duration: 0.12 }, 0.55);
      // Collapse + align
      tl.to(giant, { scale: 0.78, xPercent: 0, yPercent: -8, duration: 0.18 }, 0.68);
      tl.to(shards, { x: 0, y: 0, opacity: 0.9, duration: 0.14 }, 0.7);
      tl.to(align, { opacity: 1, y: 0, duration: 0.1 }, 0.74);
      // Full exit
      tl.to([giant, ghost, shards, caption, align, frame], { opacity: 0, y: -30, duration: 0.12 }, 0.84);
      sealChapterExit(tl, stage, 0.9);

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
    desktopEnd: "+=155%",
    deps: [layers.length],
  });

  const primary = layers[0] || "";
  const secondary = layers[1] || "";

  return (
    <section
      ref={rootRef}
      id="about-explosion"
      aria-labelledby="about-explosion-title"
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-cyan-neon"
          : "relative min-h-[100svh] max-md:min-h-[210vh] overflow-hidden bg-void text-cyan-neon"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0 flex items-center justify-center">
          <p
            data-ghost
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(3.2rem,18vw,13rem)] font-black leading-none text-purple-neon/25"
          >
            {secondary}
          </p>

          <div className="relative z-10 w-full px-4 text-center">
            <SignalTick
              className="mb-5 justify-center"
              label={`${t("journey.explosion.index")} / ${t("journey.explosion.kicker")}`}
            />
            <h2 id="about-explosion-title" className="sr-only">
              {t("journey.explosion.kicker")}
            </h2>
            <div className="relative mx-auto inline-block max-w-full">
              <span
                data-frame
                className="pointer-events-none absolute -inset-x-4 -inset-y-2 border border-cyan-neon/40 md:-inset-x-8"
                aria-hidden
              />
              <p
                data-giant
                className="relative font-display text-[clamp(2.8rem,15vw,9.5rem)] font-black leading-[0.84] tracking-[-0.045em] text-cyan-neon will-change-transform"
              >
                {primary}
              </p>
            </div>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
              {layers.slice(2).map((shard) => (
                <span
                  key={shard}
                  data-shard
                  className="border border-purple-neon/40 px-3.5 py-1.5 font-heading text-sm uppercase tracking-[0.18em] text-slate-300"
                >
                  {shard}
                </span>
              ))}
            </div>
            <p
              data-caption
              className="mx-auto mt-7 max-w-md font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"
            >
              {t("journey.explosion.caption")}
            </p>
            <p
              data-align
              className="mx-auto mt-4 max-w-sm font-heading text-xs uppercase tracking-[0.24em] text-cyan-neon/80"
            >
              {t("journey.explosion.align")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
