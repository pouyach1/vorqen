const INTL_LOCALES = { en: "en-US", fa: "fa-IR" };

const cache = new Map();

/** Locale-aware number formatting (Persian digits for `fa`). Values are never altered. */
export function formatNumber(value, locale, options) {
  const key = `${locale}|${options ? JSON.stringify(options) : ""}`;
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(INTL_LOCALES[locale] ?? INTL_LOCALES.en, options);
    cache.set(key, formatter);
  }
  return formatter.format(value);
}
