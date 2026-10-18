import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../hooks/usePinnedScrollChapter";

/** Act 02 — Masked identity lines (editorial). */
export default function OdysseyIdentity() {
  const { t } = useTranslation("about");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";

  const lines = useMemo(() => {
    const raw = t("odyssey.identity.lines", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, locale]);

  const buildTimeline = useCallback(
    (q) => {
      const stage = q("[data-chapter-stage]");
      const masks = q("[data-id-mask]");
      const items = q("[data-id-line]");
      const kicker = q("[data-id-kicker]");
      const note = q("[data-id-note]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(kicker, { opacity: 1, y: 0 });
      gsap.set(note, { opacity: 0.9, y: 0 });
      gsap.set(masks, { yPercent: 0, opacity: 0.35 });
      gsap.set(items, { yPercent: 0, opacity: 1 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to({}, { duration: 0.14 });
      items.forEach((_, i) => {
        const at = 0.16 + i * 0.12;
        tl.to(masks[i], { opacity: 0.75, duration: 0.16 }, at);
        tl.to(items[i], { x: isFa ? -8 : 8, duration: 0.16 }, at);
      });
      tl.to({}, { duration: 0.22 });
      tl.to(kicker, { opacity: 0.35, y: -12, duration: 0.16 }, ">-0.05");
      tl.to(note, { opacity: 0, y: 16, duration: 0.14 }, "<");
      tl.to(items, { yPercent: -36, opacity: 0, duration: 0.28, stagger: 0.04 }, ">-0.02");
      tl.to(masks, { opacity: 0, duration: 0.16 }, "<");
      sealChapterExit(tl, stage, 0.9);
      return tl;
    },
    [isFa]
  );

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=200%",
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="odyssey-identity-title"
      lang={locale}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-[#07070c] text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[190vh] overflow-hidden bg-[#07070c] text-slate-100"
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
            data-id-kicker
            id="odyssey-identity-title"
            className={
              isFa
                ? "mb-8 font-heading text-sm text-purple-neon"
                : "mb-8 font-mono text-[11px] uppercase tracking-[0.35em] text-purple-neon"
            }
          >
            {t("odyssey.identity.kicker")}
          </p>

          <div className="space-y-3 md:space-y-4">
            {lines.map((line, i) => (
              <div key={i} className="relative overflow-hidden py-1">
                <span
                  data-id-mask
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-bottom bg-gradient-to-r from-cyan-neon/20 via-purple-neon/15 to-transparent"
                />
                <p
                  data-id-line
                  className={
                    isFa
                      ? "relative font-display text-[clamp(1.6rem,4.5vw,3.4rem)] font-black leading-[1.35] text-white"
                      : "relative font-display text-[clamp(1.8rem,5vw,3.8rem)] font-black leading-[1.05] tracking-tight text-white"
                  }
                >
                  {line}
                </p>
              </div>
            ))}
          </div>

          <p
            data-id-note
            className={
              isFa
                ? "mt-10 max-w-xl font-heading text-base leading-[1.9] text-slate-400"
                : "mt-10 max-w-lg font-heading text-base leading-relaxed text-slate-400"
            }
          >
            {t("odyssey.identity.note")}
          </p>
        </div>
      </div>
    </section>
  );
}
