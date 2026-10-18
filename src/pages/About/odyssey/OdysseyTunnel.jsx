import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

/** Act 03 — Perspective signal tunnel (cyber). */
export default function OdysseyTunnel() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const buildTimeline = useCallback((q) => {
    const stage = q("[data-chapter-stage]");
    const tunnel = q("[data-tn-tunnel]");
    const rings = q("[data-tn-ring]");
    const title = q("[data-tn-title]");
    const body = q("[data-tn-body]");

    gsap.set(stage, { autoAlpha: 1, y: 0 });
    gsap.set(tunnel, { z: 0, opacity: 1 });
    gsap.set(rings, { scale: 1, opacity: 0.35 });
    gsap.set([title, body], { opacity: 1, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to({}, { duration: 0.1 });
    tl.to(rings, { scale: 1.8, opacity: 0.15, stagger: 0.04, duration: 0.55 }, 0.08);
    tl.to(tunnel, { z: 180, opacity: 0.55, duration: 0.55 }, 0.08);
    tl.to(title, { y: -30, opacity: 0.7, duration: 0.25 }, 0.2);
    tl.to({}, { duration: 0.18 });
    tl.to(rings, { scale: 3.2, opacity: 0, duration: 0.4 }, 0.62);
    tl.to([title, body], { y: -60, opacity: 0, duration: 0.28 }, 0.7);
    tl.to(tunnel, { opacity: 0, duration: 0.2 }, 0.82);
    sealChapterExit(tl, stage, 0.91);
    return tl;
  }, []);

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=240%",
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-tunnel-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[210vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:h-[100svh]"
        style={{ perspective: "900px" }}
      >
        <div data-chapter-stage className="absolute inset-0 flex items-center justify-center">
          <div
            data-tn-tunnel
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[0.35, 0.55, 0.75, 1, 1.25, 1.55].map((s, i) => (
              <span
                key={i}
                data-tn-ring
                className="absolute rounded-full border border-cyan-neon/40"
                style={{
                  width: `${s * 42}vmin`,
                  height: `${s * 42}vmin`,
                  boxShadow: `0 0 ${12 + i * 4}px rgba(0,243,255,${0.12 + i * 0.03})`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,6,10,0.85)_75%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(0,243,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(112,0,255,0.08)_1px,transparent_1px)] [background-size:48px_48px] [transform:rotateX(62deg)_scale(1.4)]" />
          </div>

          <div className="relative z-10 max-w-2xl px-6 text-center">
            <p
              className={
                isFa
                  ? "mb-4 font-heading text-sm text-cyan-neon"
                  : "mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-neon"
              }
            >
              {t("odyssey.tunnel.kicker")}
            </p>
            <h2
              id="odyssey-tunnel-title"
              data-tn-title
              className={
                isFa
                  ? "font-display text-[clamp(2rem,6vw,3.8rem)] font-black leading-[1.25] text-white"
                  : "font-display text-[clamp(2.2rem,6.5vw,4.2rem)] font-black leading-[1.05] tracking-tight text-white"
              }
            >
              {t("odyssey.tunnel.title")}
            </h2>
            <p
              data-tn-body
              className={
                isFa
                  ? "mx-auto mt-6 max-w-lg font-heading text-base leading-[1.9] text-slate-400"
                  : "mx-auto mt-6 max-w-lg font-heading text-base leading-relaxed text-slate-400"
              }
            >
              {t("odyssey.tunnel.body")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
