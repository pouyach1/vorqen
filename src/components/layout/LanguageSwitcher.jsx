import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { LOCALE_NAMES, pagePath, resolveRoute } from "../../i18n/locale";

const SECTION_HASH = /^#[A-Za-z][\w-]*$/;

/**
 * Real link to the same page in the other locale, so the target loads with the
 * correct lang/dir before paint. Carries the current homepage section hash.
 */
export default function LanguageSwitcher({ className = "", onNavigate }) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const target = locale === "fa" ? "en" : "fa";
  const { page } = resolveRoute(window.location.pathname);
  const href = pagePath(page === "notFound" ? "home" : page, target);
  const targetName = LOCALE_NAMES[target];

  function handleClick(event) {
    const { hash } = window.location;
    if (page === "home" && SECTION_HASH.test(hash) && document.getElementById(hash.slice(1))) {
      event.currentTarget.setAttribute("href", href + hash);
    }
    onNavigate?.();
  }

  return (
    <a
      href={href}
      hrefLang={target}
      onClick={handleClick}
      aria-label={`${targetName} — ${t("language.switchLabel")}`}
      data-cursor="interactive"
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-cyan-neon/30 bg-void/60 px-3 text-cyan-neon transition-[border-color,box-shadow] duration-300 hover:border-cyan-neon hover:shadow-neon-cyan ${className}`}
    >
      <Languages size={14} aria-hidden="true" />
      <span
        lang={target}
        className={
          target === "fa"
            ? "text-sm font-medium leading-none"
            : "font-heading text-xs font-semibold uppercase leading-none tracking-widest"
        }
      >
        {targetName}
      </span>
    </a>
  );
}
