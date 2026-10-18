import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, LOCALE_DIR, SUPPORTED_LOCALES, localizeHref } from "./locale";

/** +1 LTR / −1 RTL — multiply Framer Motion `x` values that follow reading direction. */
export function dirSignFrom(dir) {
  return dir === "rtl" ? -1 : 1;
}

export function useLocale() {
  const { i18n } = useTranslation();
  const locale = SUPPORTED_LOCALES.includes(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
  const dir = LOCALE_DIR[locale];
  const localize = useCallback((href) => localizeHref(href, locale), [locale]);
  return { locale, dir, dirSign: dirSignFrom(dir), localizeHref: localize };
}
