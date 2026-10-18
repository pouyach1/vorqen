/**
 * Locale ↔ URL mapping. The pathname is the only source of truth for language.
 * Keep LOCALE_PREFIX_RE in sync with the pre-React script in index.html.
 */

export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "fa"];

export const LOCALE_DIR = { en: "ltr", fa: "rtl" };

/** Endonyms — always shown in their own language, so they live outside the dictionaries. */
export const LOCALE_NAMES = { en: "English", fa: "فارسی" };

const LOCALE_PREFIX_RE = /^\/fa(?=\/|$)/;

const PAGE_PATHS = { home: "/", about: "/about", world: "/world" };

function normalize(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

/** `/fa/about` → { locale: "fa", page: "about" }; unknown paths → page "notFound". */
export function resolveRoute(pathname) {
  const path = normalize(pathname);
  const locale = LOCALE_PREFIX_RE.test(path) ? "fa" : DEFAULT_LOCALE;
  const rest = normalize(path.replace(LOCALE_PREFIX_RE, ""));
  const page = Object.keys(PAGE_PATHS).find((key) => PAGE_PATHS[key] === rest) ?? "notFound";
  const seoPath = page === "notFound" ? null : pagePath(page, locale);
  return { locale, page, seoPath };
}

export function getLocaleFromPath(pathname) {
  return resolveRoute(pathname).locale;
}

/** Public URL for a page in a locale: ("about", "fa") → "/fa/about". */
export function pagePath(page, locale) {
  const base = PAGE_PATHS[page] ?? "/";
  if (locale === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

/**
 * Prefix site-absolute hrefs with the locale: ("/#contact", "fa") → "/fa#contact".
 * Relative hashes and external URLs are returned unchanged.
 */
export function localizeHref(href, locale) {
  if (locale === DEFAULT_LOCALE || !href?.startsWith("/") || href.startsWith("//")) return href;
  const hashIndex = href.indexOf("#");
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  const prefixed = normalize(path) === "/" ? `/${locale}` : `/${locale}${normalize(path)}`;
  return prefixed + hash;
}

export function applyDocumentLocale(locale) {
  const root = document.documentElement;
  if (root.lang !== locale) root.lang = locale;
  if (root.dir !== LOCALE_DIR[locale]) root.dir = LOCALE_DIR[locale];
}
