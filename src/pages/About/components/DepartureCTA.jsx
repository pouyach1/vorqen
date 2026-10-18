import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GlassPanel from "../../../components/ui/GlassPanel";
import NeonButton from "../../../components/ui/NeonButton";
import { departurePaths } from "../../../data/aboutPage";
import { SITE } from "../../../lib/constants";
import { useLocale } from "../../../i18n/useLocale";

const ACCENT = {
  cyan: "border-cyan-neon/30 hover:shadow-neon-cyan text-cyan-neon",
  purple: "border-purple-neon/30 hover:shadow-neon-purple text-purple-neon",
  magenta: "border-magenta-neon/30 hover:shadow-neon-magenta text-magenta-neon",
};

export default function DepartureCTA() {
  const { t } = useTranslation("about");
  const { localizeHref } = useLocale();

  return (
    <section className="section-container pb-32">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-neon/5 via-purple-neon/5 to-magenta-neon/5 blur-2xl" />

        <GlassPanel glow="cyan" className="relative overflow-hidden p-8 md:p-12 text-center">
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-neon to-transparent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-neon">{t("departure.eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            {t("departure.titleLead")}{" "}
            <span className="bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent">
              {t("departure.titleAccent")}
            </span>
            {t("departure.titleTail")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">{t("departure.body")}</p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {departurePaths.map((path, i) => (
              <motion.a
                key={path.id}
                href={localizeHref(path.href)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`group rounded-2xl border bg-void/40 p-5 text-start transition-shadow duration-300 ${ACCENT[path.accent]}`}
              >
                <p className="font-heading text-sm font-bold uppercase tracking-widest">
                  {t(`departure.paths.${path.id}.label`)}
                </p>
                <p className="mt-2 text-xs text-slate-400 group-hover:text-slate-300">
                  {t(`departure.paths.${path.id}.desc`)}
                </p>
                <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100">
                  {t("departure.execute")}
                </span>
              </motion.a>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NeonButton as="a" href={localizeHref("/#contact")} variant="cyan">
              {t("departure.startProject")}
            </NeonButton>
            <NeonButton as="a" href={localizeHref("/")} variant="purple">
              {t("departure.returnDomain")}
            </NeonButton>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-slate-600">
            {t("departure.archived", { robot: SITE.robotName, year: new Date().getFullYear() })}
          </p>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
