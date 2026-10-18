import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../../i18n/useLocale";
import { sealChapterExit, usePinnedScrollChapter } from "../../hooks/usePinnedScrollChapter";

const THUMB_TINTS = [
  "from-cyan-neon/40 to-purple-neon/30",
  "from-purple-neon/45 to-cyan-neon/20",
  "from-cyan-neon/25 to-magenta-neon/30",
];

/** Mirror LTR-leaning arrows in RTL so motion still reads “forward”. */
function localizeSymbol(text, isRtl) {
  if (!isRtl) return text;
  if (text === "➝") return "←";
  if (text === "↳") return "↲";
  return text;
}

function Token({ token, isFa, isRtl }) {
  if (token.type === "image") {
    const tint = THUMB_TINTS[token.tint % THUMB_TINTS.length];
    return (
      <span
        data-thumb
        className="mx-1 inline-flex h-[0.72em] w-[1.15em] shrink-0 overflow-hidden rounded-sm align-middle md:mx-2"
        style={{ minWidth: "1.15em" }}
        aria-hidden
      >
        <span className={`block h-full w-full bg-gradient-to-br ${tint}`} />
      </span>
    );
  }
  if (token.type === "symbol") {
    return (
      <span
        data-token
        dir="ltr"
        className="mx-0.5 inline-block font-heading text-[0.55em] text-cyan-neon md:mx-1"
      >
        {localizeSymbol(token.text, isRtl)}
      </span>
    );
  }
  if (token.type === "italic") {
    // Persian italics often look broken — use weight/colour contrast instead
    return (
      <span
        data-token
        className={
          isFa
            ? "mx-0.5 inline-block font-heading font-bold text-purple-neon md:mx-1"
            : "mx-0.5 inline-block font-heading italic font-semibold text-purple-neon/90 md:mx-1"
        }
      >
        {token.text}
      </span>
    );
  }
  return (
    <span
      data-token
      className={
        isFa
          ? "mx-0.5 inline-block font-display font-black text-white md:mx-1"
          : "mx-0.5 inline-block font-display font-black text-white md:mx-1"
      }
    >
      {token.text}
    </span>
  );
}

/**
 * Kinetic type chapter — mixed tokens, symbols, inline thumbs, multi-speed scrub.
 * RTL-aware arrows + FA typography (no italic / no Latin uppercase tracking).
 */
export default function AboutKineticType() {
  const { t, i18n } = useTranslation("about");
  const { locale, dir, dirSign } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const isFa = locale === "fa";
  const isRtl = dir === "rtl";

  const lines = useMemo(() => {
    const raw = t("kineticType.lines", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const buildTimeline = useCallback(
    (q) => {
      const stage = q("[data-chapter-stage]");
      const rows = q("[data-k-line]");
      const label = q("[data-k-label]");

      gsap.set(stage, { autoAlpha: 1, y: 0 });
      gsap.set(rows, { xPercent: 0, yPercent: 0, opacity: 1 });
      gsap.set(label, { opacity: 0.7, y: 0 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(label, { opacity: 1, y: -8, duration: 0.12 }, 0.02);

      rows.forEach((row, i) => {
        const dirN = i % 2 === 0 ? 1 : -1;
        const speed = 18 + i * 10;
        tl.to(
          row,
          {
            xPercent: dirSign * dirN * speed,
            yPercent: (i - 1) * -6,
            duration: 0.55,
          },
          0.08 + i * 0.04
        );
      });

      tl.to({}, { duration: 0.14 }, 0.55);
      tl.to(rows, { opacity: 0, yPercent: -28, duration: 0.18, stagger: 0.03 }, 0.72);
      tl.to(label, { opacity: 0, duration: 0.1 }, 0.78);
      sealChapterExit(tl, stage, 0.9);
      return tl;
    },
    [dirSign]
  );

  usePinnedScrollChapter({
    rootRef,
    pinRef,
    reduce,
    locale,
    buildTimeline,
    desktopEnd: "+=160%",
    deps: [lines.length],
  });

  return (
    <section
      ref={rootRef}
      id="about-kinetic-type"
      aria-labelledby="about-kinetic-type-title"
      lang={locale}
      dir={dir}
      className={
        reduce
          ? "relative min-h-[100svh] overflow-hidden bg-void text-slate-100"
          : "relative min-h-[100svh] max-md:min-h-[210vh] overflow-hidden bg-void text-slate-100"
      }
      style={{ isolation: "isolate" }}
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-[100svh]"
      >
        <div data-chapter-stage className="absolute inset-0 flex flex-col justify-center px-4 py-24 md:px-8">
          <p
            data-k-label
            className={
              isFa
                ? "mb-8 text-center font-heading text-xs tracking-normal text-cyan-neon/80"
                : "mb-8 text-center font-mono text-[10px] uppercase tracking-[0.34em] text-cyan-neon/70"
            }
          >
            {t("kineticType.label")}
          </p>
          <h2 id="about-kinetic-type-title" className="sr-only">
            {t("kineticType.label")}
          </h2>

          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-5">
            {lines.map((line, li) => (
              <p
                key={`${locale}-kline-${li}`}
                data-k-line
                className={
                  isFa
                    ? "flex flex-wrap items-center justify-center gap-y-2 text-center text-[clamp(1.45rem,4.8vw,3.6rem)] leading-[1.35] tracking-normal will-change-transform max-md:justify-start"
                    : "flex flex-wrap items-center justify-center text-center text-[clamp(1.65rem,5.5vw,4.25rem)] leading-[1.05] tracking-[-0.03em] will-change-transform max-md:justify-start"
                }
              >
                {(line.tokens || []).map((token, ti) => (
                  <Token
                    key={`${locale}-kt-${li}-${ti}`}
                    token={token}
                    isFa={isFa}
                    isRtl={isRtl}
                  />
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
