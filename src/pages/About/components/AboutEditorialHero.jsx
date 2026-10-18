import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { ensureScrollTrigger } from "../../../lib/scrollTriggerLenis";
import { sealChapterExit } from "../hooks/usePinnedScrollChapter";
import { SignalCross, SignalGrid, SignalTick } from "../signal/AboutSignalPrimitives";

/**
 * THE SIGNAL — Origin → Expansion → Revelation → Transfer
 * Signature moment #1: lattice expands, then a cyan scanline splits the scene.
 */
export default function AboutEditorialHero() {
  const { t, i18n } = useTranslation("about");
  const { locale, dirSign } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  const lines = useMemo(() => {
    const raw = t("hero.lines", { returnObjects: true });
    return Array.isArray(raw) ? raw : [String(raw)];
  }, [t, i18n.language]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin || reduce) return undefined;

    const ScrollTrigger = ensureScrollTrigger();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(pin);
      const core = q("[data-signal='core']");
      const ringA = q("[data-ring='a']");
      const ringB = q("[data-ring='b']");
      const rays = q("[data-signal='ray']");
      const grid = q("[data-signal='grid']");
      const plates = q("[data-plate]");
      const linesEl = q("[data-line]");
      const masks = q("[data-mask]");
      const kicker = q("[data-el='kicker']");
      const lede = q("[data-el='lede']");
      const meta = q("[data-el='meta']");
      const cue = q("[data-el='scroll']");
      const scan = q("[data-scan]");
      const veil = q("[data-veil]");
      const stage = q("[data-chapter-stage]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(core, { scale: 1, opacity: 1 });
      gsap.set(ringA, { scale: 0.55, opacity: 0.7 });
      gsap.set(ringB, { scale: 0.85, opacity: 0.35 });
      gsap.set(rays, { scaleX: 0.2, opacity: 0.4, transformOrigin: "50% 50%" });
      gsap.set(grid, { opacity: 0.1 });
      gsap.set(plates, { opacity: 0.35, y: 24 });
      gsap.set(linesEl, { yPercent: 0, opacity: 1, scale: 1 });
      gsap.set(masks, { clipPath: "inset(0% 0 0 0)" });
      gsap.set([kicker, lede, meta, cue], { opacity: 1, y: 0 });
      gsap.set(scan, { scaleX: 0, opacity: 0 });
      gsap.set(veil, { yPercent: 100 });

      const build = () => {
        const tl = gsap.timeline({ defaults: { ease: "none" } });

        tl.to(ringA, { scale: 0.7, opacity: 0.85, duration: 0.14 }, 0);
        tl.to(ringB, { scale: 1.05, opacity: 0.5, duration: 0.14 }, 0);
        tl.to(core, { scale: 1.35, duration: 0.22 }, 0.12);
        tl.to(ringA, { scale: 1.25, duration: 0.24 }, 0.12);
        tl.to(ringB, { scale: 1.85, opacity: 0.55, duration: 0.26 }, 0.12);
        tl.to(rays, { scaleX: 1, opacity: 0.75, duration: 0.24, stagger: 0.02 }, 0.14);
        tl.to(grid, { opacity: 0.32, duration: 0.2 }, 0.16);
        tl.to(plates, { opacity: 0.75, y: 0, duration: 0.22, stagger: 0.04 }, 0.18);
        tl.to(
          linesEl,
          {
            scale: (i) => 1.08 - i * 0.06,
            yPercent: (i) => -8 - i * 8,
            xPercent: (i) => dirSign * (i === 1 ? 6 : -4),
            duration: 0.28,
            stagger: 0.03,
          },
          0.36
        );
        tl.to(kicker, { y: -20, opacity: 0.55, duration: 0.14 }, 0.4);
        tl.to(meta, { x: dirSign * 28, opacity: 0.4, duration: 0.14 }, 0.42);
        // Readable hold
        tl.to({}, { duration: 0.12 }, 0.52);
        tl.to(scan, { scaleX: 1, opacity: 1, duration: 0.1 }, 0.64);
        tl.to(scan, { y: "-40vh", duration: 0.16 }, 0.72);
        tl.to(veil, { yPercent: 0, duration: 0.16 }, 0.74);
        tl.to(linesEl, { yPercent: -60, opacity: 0, duration: 0.14, stagger: 0.02 }, 0.78);
        tl.to(
          [core, ringA, ringB, rays, plates, grid, kicker, lede, meta, cue, scan],
          { opacity: 0, y: -24, duration: 0.1 },
          0.82
        );
        sealChapterExit(tl, stage, 0.9);
        return tl;
      };

      const wire = (config) => {
        const animation = build();
        animation.progress(0).pause();
        ScrollTrigger.create({
          ...config,
          trigger: root,
          pinSpacing: true,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          anticipatePin: 1,
          animation,
          onLeave: () => {
            gsap.set(stage, { autoAlpha: 0, y: -28 });
            animation.progress(1);
          },
          onEnterBack: () => gsap.set(stage, { autoAlpha: 1, y: 0 }),
          onEnter: () => gsap.set(stage, { autoAlpha: 1, y: 0 }),
          onLeaveBack: () => {
            animation.progress(0);
            gsap.set(stage, { autoAlpha: 1, y: 0 });
          },
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        wire({ start: "top top", end: "+=175%", pin, scrub: 0.4 });
      });
      mm.add("(max-width: 767px)", () => {
        wire({ start: "top top", end: "bottom bottom", scrub: 0.5 });
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 60);
    const t2 = window.setTimeout(refresh, 340);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reduce, locale, dirSign, lines.length]);

  return (
    <section
      ref={rootRef}
      id="about-hero"
      aria-labelledby="about-hero-title"
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[210vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0 flex flex-col justify-end">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-void" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_48%_40%,rgba(0,243,255,0.16),transparent_48%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_22%,rgba(112,0,255,0.14),transparent_42%)]" />
          <SignalGrid id="signal-grid-hero" />
          <SignalCross />

          <span
            data-ring="a"
            className="absolute left-1/2 top-[40%] h-[min(42vw,280px)] w-[min(42vw,280px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-neon/55"
          />
          <span
            data-ring="b"
            className="absolute left-1/2 top-[40%] h-[min(58vw,400px)] w-[min(58vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-neon/35"
          />
          <span
            data-signal="core"
            className="absolute left-1/2 top-[40%] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-neon shadow-neon-cyan"
          />

          {/* Editorial plates */}
          <span
            data-plate
            className="absolute start-[6%] top-[24%] h-20 w-28 border border-cyan-neon/30 bg-cyan-neon/5 md:h-28 md:w-40"
          />
          <span
            data-plate
            className="absolute end-[8%] top-[28%] h-[3px] w-28 bg-gradient-to-l from-purple-neon to-transparent"
          />
          <span
            data-plate
            className="absolute end-[14%] bottom-[34%] h-32 w-16 bg-gradient-to-b from-purple-neon/30 to-cyan-neon/10"
          />

          {/* Signature scanline */}
          <span
            data-scan
            className="absolute left-0 top-1/2 h-px w-full origin-left bg-cyan-neon shadow-neon-cyan"
          />
          <div data-veil className="absolute inset-0 translate-y-full bg-void" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-6 pb-12 pt-28 md:grid-cols-[1fr_auto] md:items-end md:px-10 md:pb-16 md:pt-36">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <SignalTick label={`${t("hero.index")} / ${t("hero.kicker")}`} />
              <p
                data-el="meta"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500"
              >
                {t("hero.annotation")}
              </p>
            </div>

            <p
              data-el="kicker"
              className="mb-4 font-heading text-sm uppercase tracking-[0.3em] text-purple-neon"
            >
              {t("hero.eyebrow")}
            </p>

            <h1
              id="about-hero-title"
              className="font-display text-[clamp(2.5rem,8.5vw,6.75rem)] font-black leading-[0.9] tracking-[-0.035em]"
            >
              {lines.map((line, i) => (
                <span key={`${locale}-${i}`} data-mask className="block overflow-hidden">
                  <span
                    data-line
                    className={`block will-change-transform ${
                      i === 1
                        ? "bg-gradient-to-r from-cyan-neon via-cyan-neon to-purple-neon bg-clip-text text-transparent"
                        : "text-white"
                    }`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-el="lede"
              className="mt-7 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg"
            >
              {t("hero.lede")}
            </p>
          </div>

          <aside className="hidden w-44 flex-col gap-4 border-s border-cyan-neon/20 ps-6 md:flex">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              {t("hero.sideNote")}
            </p>
            <div className="space-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span>{t("hero.metaFocus")}</span>
                <span className="text-cyan-neon">{t("hero.metaFocusValue")}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span>{t("hero.metaMode")}</span>
                <span className="text-purple-neon">{t("hero.metaModeValue")}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>{t("hero.metaLocale")}</span>
                <span dir="ltr" className="text-slate-200">
                  {locale.toUpperCase()}
                </span>
              </div>
            </div>
          </aside>

          <div
            data-el="scroll"
            className="col-span-full mt-2 flex items-center gap-3 border-t border-cyan-neon/15 pt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500"
          >
            <span className="relative h-8 w-5 overflow-hidden rounded-full border border-cyan-neon/35">
              <span className="absolute start-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-cyan-neon" />
            </span>
            {t("hero.scroll")}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
