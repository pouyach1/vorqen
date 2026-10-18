import { useEffect } from "react";
import { getSeoForPath, resolveSiteOrigin } from "../../i18n/seo";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href, hreflang) {
  if (!href) return;
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Keeps document title/meta aligned with the active route after client navigation.
 * Initial HTML shells (post-build) carry the same values for first paint / crawlers.
 */
export default function DocumentMeta({ pathname }) {
  useEffect(() => {
    const seo = getSeoForPath(pathname);
    if (!seo) return;

    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:type", seo.ogType);
    upsertMeta("property", "og:locale", seo.localeTag);
    upsertMeta("property", "og:site_name", seo.siteName);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);

    const origin = resolveSiteOrigin(import.meta.env.VITE_SITE_URL);
    if (origin) {
      const canonical = `${origin}${seo.path === "/" ? "/" : seo.path}`;
      const alternate = `${origin}${seo.alternatePath === "/" ? "/" : seo.alternatePath}`;
      upsertLink("canonical", canonical);
      upsertMeta("property", "og:url", canonical);
      upsertLink("alternate", canonical, seo.locale);
      upsertLink("alternate", alternate, seo.alternateLocale);
      upsertLink("alternate", `${origin}/`, "x-default");
    }
  }, [pathname]);

  return null;
}
