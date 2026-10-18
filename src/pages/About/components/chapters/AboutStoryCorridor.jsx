import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../../i18n/useLocale";
import { ensureScrollTrigger } from "../../../../lib/scrollTriggerLenis";
import { SignalTick } from "../../signal/AboutSignalPrimitives";

const PANELS = ["vision", "craft", "impact"];

/**
 * Horizontal editorial corridor — desktop: vertical scroll drives horizontal track.
 * Mobile: stacked vertical panels (no sideways overflow).
 */
export default function AboutStoryCorridor() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!root || !pin || !track || reduce) return undefined;

    const ScrollTrigger = ensureScrollTrigger();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray("[data-corridor-panel]", pin);

      mm.add("(min-width: 768px)", () => {
        gsap.set(track, { x: 0 });
        gsap.set(panels, { scale: 0.94, opacity: 0.55 });
        gsap.set(panels[0], { scale: 1, opacity: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=280%",
            pin,
            pinSpacing: true,
            scrub: 0.45,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            anticipatePin: 1,
          },
        });

        // Panel 0 hold → slide to 1
        tl.to({}, { duration: 0.12 });
        tl.to(track, { xPercent: -33.333, duration: 0.34 }, 0.12);
        tl.to(panels[0], { scale: 0.9, opacity: 0.4, duration: 0.34 }, 0.12);
        tl.to(panels[1], { scale: 1, opacity: 1, duration: 0.34 }, 0.12);

        // Hold panel 1 → slide to 2
        tl.to({}, { duration: 0.12 });
        tl.to(track, { xPercent: -66.666, duration: 0.34 }, 0.58);
        tl.to(panels[1], { scale: 0.9, opacity: 0.4, duration: 0.34 }, 0.58);
        tl.to(panels[2], { scale: 1, opacity: 1, duration: 0.34 }, 0.58);

        // Readable hold on impact, then soft settle
        tl.to({}, { duration: 0.14 });
        tl.to(panels[2], { scale: 0.98, duration: 0.1 }, 1.06);
      });

      // Mobile: light vertical reveals only
      mm.add("(max-width: 767px)", () => {
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 28, opacity: 0.55 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top 85%",
                end: "top 45%",
                scrub: 0.4,
              },
            }
          );
        });
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 200);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [reduce, locale]);

  return (
    <section
      ref={rootRef}
      id="about-corridor"
      aria-label={t("journey.corridor.label")}
      className="relative bg-void text-slate-100"
    >
      <div
        ref={pinRef}
        className="relative overflow-hidden md:h-[100svh] md:min-h-[100svh]"
      >
        {/* Desktop horizontal track */}
        <div
          ref={trackRef}
          dir="ltr"
          className="hidden h-full md:flex md:w-[300%] md:will-change-transform"
        >
          {PANELS.map((id, i) => (
            <CorridorPanel key={id} id={id} index={i} t={t} locale={locale} desktop />
          ))}
        </div>

        {/* Mobile vertical stack */}
        <div className="flex flex-col gap-0 md:hidden">
          {PANELS.map((id, i) => (
            <CorridorPanel key={id} id={id} index={i} t={t} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CorridorPanel({ id, index, t, locale, desktop = false }) {
  return (
    <article
      data-corridor-panel
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={
        desktop
          ? "relative flex h-full w-1/3 flex-none items-center overflow-hidden px-10 lg:px-16"
          : "relative min-h-[88svh] overflow-hidden px-6 py-24"
      }
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            index === 0
              ? "radial-gradient(ellipse at 30% 40%, rgba(0,243,255,0.14), transparent 50%)"
              : index === 1
                ? "radial-gradient(ellipse at 70% 35%, rgba(112,0,255,0.16), transparent 48%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(0,243,255,0.1), rgba(112,0,255,0.08), transparent 55%)",
        }}
      />

      {/* Editorial geometry */}
      <span
        className={`pointer-events-none absolute ${
          index === 0
            ? "start-0 top-[18%] h-[55%] w-[3px] bg-cyan-neon"
            : index === 1
              ? "end-[12%] top-[22%] h-40 w-40 rounded-full border border-purple-neon/40"
              : "start-[10%] bottom-[18%] h-24 w-36 bg-gradient-to-r from-cyan-neon/30 to-purple-neon/20"
        }`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <SignalTick
          label={`${String(index + 1).padStart(2, "0")} / ${t(`journey.corridor.${id}.kicker`)}`}
        />
        <h2 className="mt-6 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-black leading-[0.92] tracking-[-0.03em] text-white">
          <span className="block">{t(`journey.corridor.${id}.line1`)}</span>
          <span className="mt-1 block bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent">
            {t(`journey.corridor.${id}.line2`)}
          </span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
          {t(`journey.corridor.${id}.body`)}
        </p>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-neon/70">
          {t(`journey.corridor.${id}.note`)}
        </p>
      </div>
    </article>
  );
}
