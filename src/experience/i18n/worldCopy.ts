export type WorldLocale = "en" | "fa";

const COPY = {
  en: {
    connecting: "connecting to vorqen...",
    chapter: "01 / SIGNAL",
    scrollHint: "scroll to lock signal",
  },
  fa: {
    connecting: "\u062F\u0631 \u062D\u0627\u0644 \u0627\u062A\u0635\u0627\u0644 \u0628\u0647 vorqen...",
    chapter: "\u06F0\u06F1 / \u0633\u06CC\u06AF\u0646\u0627\u0644",
    scrollHint: "\u0627\u0633\u06A9\u0631\u0648\u0644 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u0633\u06CC\u06AF\u0646\u0627\u0644 \u0642\u0641\u0644 \u0634\u0648\u062F",
  },
} as const;

/** Resolve FA/EN from document lang (portfolio i18n sets html[lang]). */
export function getWorldLocale(): WorldLocale {
  const lang = (document.documentElement.lang || "en").toLowerCase();
  return lang.startsWith("fa") ? "fa" : "en";
}

export function worldText<K extends keyof (typeof COPY)["en"]>(key: K): string {
  return COPY[getWorldLocale()][key];
}