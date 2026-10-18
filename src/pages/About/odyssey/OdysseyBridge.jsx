import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

/** Act 08 — Bridge into Living Terminal. */
export default function OdysseyBridge() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const wash = q("[data-br-wash]");
    const title = q("[data-br-title]");
    const body = q("[data-br-body]");
    const cta = q("[data-br-cta]");
    const bar = q("[data-br-bar]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(wash, { opacity: 0.25 });
    gsap.set([title, body, cta], { opacity: 1, y: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: isFa ? "right center" : "left center" });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(wash, { opacity: 0.55, duration: 0.25 }, 0);
    tl.to(bar, { scaleX: 1, duration: 0.35 }, 0.1);
    tl.to({}, { duration: 0.28 });
    tl.to(cta, { y: -8, opacity: 0.85, duration: 0.16 }, 0.55);
    tl.to([title, body, cta, bar], { opacity: 0, y: -36, duration: 0.28 }, 0.78);
    tl.to(wash, { opacity: 0, duration: 0.18 }, 0.88);
    sealChapterExit(tl, stage, 0.93);
    return tl;
  }, [isFa]);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=180%",
  });

  const scrollToTerminal = () => {
    document.getElementById("about-workstation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-bridge-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[170vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-[100svh]"
      >
        <div
          data-chapter-stage
          className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-16 lg:px-24"
        >
          <div
            data-br-wash
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,243,255,0.12),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(112,0,255,0.14),transparent_45%)]"
          />

          <p
            className={
              isFa
                ? "relative z-10 mb-4 font-heading text-sm text-cyan-neon"
                : "relative z-10 mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-neon"
            }
          >
            {t("odyssey.bridge.kicker")}
          </p>
          <h2
            id="odyssey-bridge-title"
            data-br-title
            className={
              isFa
                ? "relative z-10 max-w-3xl font-display text-[clamp(2rem,5.5vw,3.8rem)] font-black leading-[1.3] text-white"
                : "relative z-10 max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4rem)] font-black leading-[1.08] text-white"
            }
          >
            {t("odyssey.bridge.title")}
          </h2>
          <div
            data-br-bar
            aria-hidden
            className="relative z-10 mt-6 h-1 w-28 bg-gradient-to-r from-cyan-neon to-purple-neon"
          />
          <p
            data-br-body
            className={
              isFa
                ? "relative z-10 mt-6 max-w-xl font-heading text-base leading-[1.9] text-slate-400"
                : "relative z-10 mt-6 max-w-xl font-heading text-base leading-relaxed text-slate-400"
            }
          >
            {t("odyssey.bridge.body")}
          </p>
          <button
            type="button"
            data-br-cta
            onClick={scrollToTerminal}
            className="relative z-10 mt-8 rounded-md border border-cyan-neon/45 bg-cyan-neon/10 px-5 py-2.5 font-heading text-sm text-cyan-neon transition hover:bg-cyan-neon/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-neon"
          >
            {t("odyssey.bridge.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
