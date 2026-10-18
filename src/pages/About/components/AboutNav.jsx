import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GlassPanel from "../../../components/ui/GlassPanel";
import NeonButton from "../../../components/ui/NeonButton";
import LanguageSwitcher from "../../../components/layout/LanguageSwitcher";
import { useLocale } from "../../../i18n/useLocale";
import { SITE } from "../../../lib/constants";
import AboutBenchHeader from "./AboutBenchHeader";

const ABOUT_NAV = [
  { key: "home", href: "/" },
  { key: "world", href: "/world" },
  { key: "projects", href: "/#projects" },
  { key: "bots", href: "/#bots" },
  { key: "contact", href: "/#contact" },
];

export default function AboutNav() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { localizeHref } = useLocale();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-4 z-50 mx-auto w-[92%] max-w-7xl overflow-visible"
    >
      <GlassPanel className="relative flex items-center justify-between overflow-visible px-5 py-3.5 md:py-4">
        <AboutBenchHeader />

        <a href={localizeHref("/")} className="relative z-10 flex items-center gap-3 font-display text-lg font-bold tracking-widest">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-neon to-purple-neon font-display text-lg font-black text-void shadow-neon-cyan">
            {SITE.robotName.charAt(0)}
          </span>
          <span className="bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent">
            {SITE.robotName}
          </span>
          <span className="text-slate-500">.dev</span>
        </a>

        <nav className="relative z-10 hidden items-center gap-5 xl:flex">
          <span className="whitespace-nowrap font-heading text-xs uppercase tracking-wide text-cyan-neon">
            {t("nav.about")}
          </span>
          <span className="text-slate-600">|</span>
          {ABOUT_NAV.map((link) => (
            <a
              key={link.href}
              href={localizeHref(link.href)}
              className="whitespace-nowrap font-heading text-xs uppercase tracking-wide text-slate-300 transition-colors hover:text-cyan-neon"
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <LanguageSwitcher />

          <NeonButton as="a" href={localizeHref("/#contact")} className="hidden xl:inline-flex">
            {t("nav.hire")}
          </NeonButton>

          <button
            className="text-2xl text-cyan-neon xl:hidden"
            aria-label={t("nav.toggleMenu")}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </GlassPanel>

      {open && (
        <GlassPanel className="mt-2 flex flex-col gap-4 p-5 xl:hidden">
          <span className="font-heading text-sm uppercase tracking-wider text-cyan-neon">{t("nav.about")}</span>
          {ABOUT_NAV.map((link) => (
            <a
              key={link.href}
              href={localizeHref(link.href)}
              onClick={() => setOpen(false)}
              className="font-heading text-sm uppercase tracking-wider text-slate-300 hover:text-cyan-neon"
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <NeonButton as="a" href={localizeHref("/#contact")} onClick={() => setOpen(false)}>
            {t("nav.hire")}
          </NeonButton>
        </GlassPanel>
      )}
    </motion.header>
  );
}
