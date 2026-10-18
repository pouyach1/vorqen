import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { ensureScrollTrigger } from "../../../lib/scrollTriggerLenis";

const PANELS = ["craft", "systems", "human", "build"];

/** Act 04 — Horizontal editorial corridor (4 panels). */
export default function OdysseyCorridor() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const isFa = locale === "fa";

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
        gsap.set(panels, { scale: 0.92, opacity: 0.45 });
        gsap.set(panels[0], { scale: 1, opacity: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=320%",
            pin,
            pinSpacing: true,
            scrub: 0.45,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            anticipatePin: 1,
          },
        });

        const step = 100 / PANELS.length;
        for (let i = 0; i < PANELS.length - 1; i += 1) {
          const at = 0.1 + i * 0.42;
          tl.to({}, { duration: 0.1 }, at);
          tl.to(track, { xPercent: -step * (i + 1), duration: 0.32 }, at + 0.1);
          tl.to(panels[i], { scale: 0.9, opacity: 0.35, duration: 0.32 }, at + 0.1);
          tl.to(panels[i + 1], { scale: 1, opacity: 1, duration: 0.32 }, at + 0.1);
        }
        tl.to({}, { duration: 0.16 });
      });

      mm.add("(max-width: 767px)", () => {
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 28, opacity: 0.5 },
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
    const tmr = window.setTimeout(refresh, 200);
    return () => {
      window.clearTimeout(tmr);
      ctx.revert();
    };
  }, [reduce, locale]);

  return (
    <section
      ref={rootRef}
      aria-label={t("odyssey.corridor.label")}
      lang={locale}
      className="relative overflow-hidden bg-[#050508] text-slate-100"
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative min-h-[100svh] w-full overflow-hidden md:h-[100svh]"
      >
        <p
          className={
            isFa
              ? "absolute start-6 top-8 z-20 font-heading text-sm text-purple-neon md:start-12"
              : "absolute start-6 top-8 z-20 font-mono text-[11px] uppercase tracking-[0.35em] text-purple-neon md:start-12"
          }
        >
          {t("odyssey.corridor.kicker")}
        </p>

        {/* Desktop horizontal track */}
        <div
          ref={trackRef}
          dir="ltr"
          className="hidden h-full will-change-transform md:flex md:w-[400%]"
        >
          {PANELS.map((id) => (
            <article
              key={id}
              data-corridor-panel
              className="flex h-full w-1/4 flex-col justify-center px-12 lg:px-20"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">
                {t(`odyssey.corridor.${id}.kicker`)}
              </p>
              <h3 className="mt-4 max-w-xl font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] text-white">
                {t(`odyssey.corridor.${id}.title`)}
              </h3>
              <p className="mt-6 max-w-md font-heading text-base leading-relaxed text-slate-400">
                {t(`odyssey.corridor.${id}.body`)}
              </p>
            </article>
          ))}
        </div>

        {/* Mobile stacked */}
        <div className="flex flex-col gap-16 px-6 py-24 md:hidden" dir={isFa ? "rtl" : "ltr"}>
          {PANELS.map((id) => (
            <article key={id} data-corridor-panel>
              <p
                className={
                  isFa
                    ? "font-heading text-sm text-cyan-neon"
                    : "font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon"
                }
              >
                {t(`odyssey.corridor.${id}.kicker`)}
              </p>
              <h3
                className={
                  isFa
                    ? "mt-3 font-display text-3xl font-black leading-snug text-white"
                    : "mt-3 font-display text-3xl font-black text-white"
                }
              >
                {t(`odyssey.corridor.${id}.title`)}
              </h3>
              <p
                className={
                  isFa
                    ? "mt-4 font-heading text-base leading-[1.9] text-slate-400"
                    : "mt-4 font-heading text-base text-slate-400"
                }
              >
                {t(`odyssey.corridor.${id}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
