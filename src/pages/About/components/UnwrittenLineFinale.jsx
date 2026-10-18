import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FINALE_CHOICES, FINALE_PHASE } from "../../../data/aboutWorkstation";

const btnBase =
  "rounded-md px-3 py-2 font-heading text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Interactive Chapter 07 finale — choice UI only.
 * Code append + Kuro moods are owned by AboutWorkstation.
 */
function UnwrittenLineFinale({
  phase,
  selectedId,
  reaction,
  onOpenChoices,
  onSelect,
  onRun,
  onReplayEnding,
  reducedMotion,
}) {
  const { t, i18n } = useTranslation("about");
  const isFa = i18n.language === "fa";
  if (phase === FINALE_PHASE.OFF) return null;

  return (
    <div
      className="rounded-xl border border-cyan-neon/25 bg-[#061018]/90 p-4 shadow-[0_0_28px_rgba(0,243,255,0.08)]"
      role="region"
      aria-label={t("workstation.finale.regionLabel")}
    >
      <p
        className={`text-[10px] text-cyan-neon/80 ${
          isFa ? "font-heading" : "font-mono uppercase tracking-[0.25em]"
        }`}
      >
        {t("workstation.finale.title")}
      </p>

      <AnimatePresence mode="wait">
        {phase === FINALE_PHASE.IDLE && (
          <motion.div
            key="idle"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <button
              type="button"
              onClick={onOpenChoices}
              className={`${btnBase} w-full border border-emerald-neon/45 bg-emerald-neon/10 text-emerald-neon hover:bg-emerald-neon/20 focus-visible:outline-emerald-neon`}
            >
              {t("workstation.finale.writeNext")}
            </button>
          </motion.div>
        )}

        {(phase === FINALE_PHASE.CHOOSING || phase === FINALE_PHASE.SELECTED) && (
          <motion.div
            key="choices"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 space-y-3"
          >
            <p
              className={`text-[11px] text-slate-400 ${isFa ? "font-heading" : "font-mono uppercase tracking-widest"}`}
              dir="auto"
            >
              {t("workstation.finale.pickPrompt")}
            </p>
            <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label={t("workstation.finale.pickPrompt")}>
              {FINALE_CHOICES.map((choice) => {
                const active = selectedId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelect(choice.id)}
                    className={`${btnBase} border text-start ${
                      active
                        ? "border-purple-neon/60 bg-purple-neon/20 text-purple-neon focus-visible:outline-purple-neon"
                        : "border-cyan-neon/30 bg-cyan-neon/5 text-slate-200 hover:bg-cyan-neon/10 focus-visible:outline-cyan-neon"
                    }`}
                  >
                    <span className="block font-heading text-sm">
                      {t(`workstation.finale.choices.${choice.id}.label`)}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] leading-snug text-slate-500" dir="ltr">
                      {choice.code}
                    </span>
                  </button>
                );
              })}
            </div>
            {phase === FINALE_PHASE.SELECTED && (
              <button
                type="button"
                onClick={onRun}
                className={`${btnBase} w-full border border-magenta-neon/45 bg-magenta-neon/10 text-magenta-neon hover:bg-magenta-neon/20 focus-visible:outline-magenta-neon`}
              >
                {t("workstation.finale.runNext")}
              </button>
            )}
          </motion.div>
        )}

        {(phase === FINALE_PHASE.REVEALING || phase === FINALE_PHASE.COMPLETED) && reaction && (
          <motion.p
            key="reaction"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 font-heading text-sm leading-relaxed text-slate-100 ${isFa ? "leading-[1.85]" : ""}`}
            dir="auto"
          >
            {reaction}
          </motion.p>
        )}

        {phase === FINALE_PHASE.COMPLETED && (
          <motion.div
            key="done"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <button
              type="button"
              onClick={onReplayEnding}
              className={`${btnBase} w-full border border-purple-neon/45 bg-purple-neon/10 text-purple-neon hover:bg-purple-neon/20 focus-visible:outline-purple-neon`}
            >
              {t("workstation.finale.replayEnding")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(UnwrittenLineFinale);
