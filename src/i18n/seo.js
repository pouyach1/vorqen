/**
 * Localized document metadata for the four public routes.
 * Absolute URLs (canonical, og:url, hreflang, sitemap) require VITE_SITE_URL.
 */

export const SEO_ROUTES = [
  { path: "/", locale: "en", page: "home", dir: "ltr" },
  { path: "/about", locale: "en", page: "about", dir: "ltr" },
  { path: "/fa", locale: "fa", page: "home", dir: "rtl" },
  { path: "/fa/about", locale: "fa", page: "about", dir: "rtl" },
];

export const SEO_COPY = {
  en: {
    home: {
      title: "Kuro // Creative Developer & Bot Architect",
      description:
        "Cyberpunk portfolio — Telegram bots, immersive web apps, and a 3D robot assistant.",
      ogType: "website",
    },
    about: {
      title: "About // Kuro Creator Workspace",
      description:
        "Explore the creator workspace — identity, craft, and process behind Kuro's cyber domain.",
      ogType: "profile",
    },
    siteName: "Kuro",
    localeTag: "en_US",
  },
  fa: {
    home: {
      title: "Kuro // توسعه‌دهنده‌ی خلاق و معمار ربات",
      description:
        "پورتفولیوی سایبرپانک — ربات‌های تلگرام، اپلیکیشن‌های وب فراگیر و دستیار ربات سه‌بعدی.",
      ogType: "website",
    },
    about: {
      title: "درباره // فضای کار سازنده Kuro",
      description:
        "فضای کار سازنده را ببینید — هویت، مهارت و فرآیند پشت دامنه‌ی سایبری Kuro.",
      ogType: "profile",
    },
    siteName: "Kuro",
    localeTag: "fa_IR",
  },
};

/** Mirror path in the other locale: "/" ↔ "/fa", "/about" ↔ "/fa/about". */
export function alternatePath(path) {
  if (path === "/fa" || path.startsWith("/fa/")) {
    const rest = path.replace(/^\/fa/, "") || "/";
    return rest;
  }
  return path === "/" ? "/fa" : `/fa${path}`;
}

export function getSeoForPath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const route = SEO_ROUTES.find((r) => r.path === normalized);
  if (!route) return null;
  const pack = SEO_COPY[route.locale];
  const page = pack[route.page];
  return {
    ...route,
    title: page.title,
    description: page.description,
    ogType: page.ogType,
    siteName: pack.siteName,
    localeTag: pack.localeTag,
    alternatePath: alternatePath(route.path),
    alternateLocale: route.locale === "en" ? "fa" : "en",
  };
}

/** Strip trailing slash from site origin. Empty if unset. */
export function resolveSiteOrigin(raw) {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(trimmed)) return "";
  return trimmed;
}
