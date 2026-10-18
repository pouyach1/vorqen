import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

function AIResponsePanel({
  chapter,
  phase,
  reducedMotion,
  revealedCount = 0,
  locked = false,
  showContinueHint = false,
}) {
  const { t, i18n } = useTranslation("about");
  const isFa = i18n.language === "fa";
  const showBody = phase === "response" || phase === "ready";
  const processing = phase === "processing" && !locked;
  const lines = chapter.response ?? [];
  const visibleLines = showBody
    ? reducedMotion || phase === "ready" || locked
      ? lines
      : lines.slice(0, revealedCount)
    : [];

  return (
    <div className="relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-xl border border-purple-neon/35 bg-[#0a0614] shadow-[0_0_36px_rgba(112,0,255,0.12)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(112,0,255,0.18),transparent_55%)]"
      />

      <div className="relative z-[1] flex items-center justify-between border-b border-purple-neon/20 px-4 py-2.5">
        <div>
          <p className="font-heading text-xs tracking-wide text-purple-neon">
            {locked
              ? t("workstation.comingSoon.title", { robot: ABOUT_CREATOR.robotName })
              : t("workstation.kuroPanel.title", { robot: ABOUT_CREATOR.robotName })}
          </p>
          <p className="mt-0.5 font-heading text-[10px] text-slate-500">{chapter.responseTitle}</p>
        </div>
        <span
          dir="ltr"
          className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
            locked
              ? "border-slate-500/40 text-slate-400"
              : processing
                ? "border-cyan-neon/40 text-cyan-neon"
                : "border-emerald-neon/30 text-emerald-neon/90"
          }`}
        >
          {locked
            ? t("workstation.comingSoon.badge")
            : processing
              ? t("workstation.kuroPanel.reading")
              : t("workstation.kuroPanel.live")}
        </span>
      </div>

      <div className="relative z-[1] flex-1 overflow-auto p-4">
        {!locked && (
          <p
            className={`mb-3 text-[11px] text-slate-500 ${isFa ? "font-heading" : "font-mono uppercase tracking-widest"}`}
            dir="auto"
          >
            {t("workstation.kuroPanel.readingCode")}
          </p>
        )}

        <AnimatePresence mode="wait">
          {processing && (
            <motion.p
              key="processing"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-heading text-sm text-cyan-neon"
              dir="auto"
            >
              {t("workstation.processing")}
              {!reducedMotion && <span className="animate-pulse">…</span>}
            </motion.p>
          )}

          {showBody && (
            <motion.div
              key={`${chapter.id}-${locked ? "locked" : "live"}`}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {visibleLines.map((line, i) => (
                <motion.p
                  key={`${chapter.id}-r${i}`}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  dir="auto"
                  className={
                    line === ""
                      ? "h-2"
                      : isFa
                        ? "font-heading text-sm leading-[1.85] text-slate-100 md:text-[15px]"
                        : "font-heading text-sm leading-relaxed text-slate-200 md:text-base"
                  }
                >
                  {line}
                </motion.p>
              ))}
              {showContinueHint && (
                <p
                  className={`pt-2 text-[11px] text-emerald-neon/80 ${
                    isFa ? "font-heading" : "font-mono uppercase tracking-widest"
                  }`}
                  dir="auto"
                >
                  {t("workstation.controls.continueHint")}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(AIResponsePanel);
