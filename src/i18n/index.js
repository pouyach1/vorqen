import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocaleFromPath } from "./locale";
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enAbout from "./locales/en/about.json";
import faCommon from "./locales/fa/common.json";
import faHome from "./locales/fa/home.json";
import faAbout from "./locales/fa/about.json";

// Resources are bundled, so init is synchronous and the first render already has text.
i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, home: enHome, about: enAbout },
    fa: { common: faCommon, home: faHome, about: faAbout },
  },
  lng: getLocaleFromPath(window.location.pathname),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  ns: ["common", "home", "about"],
  defaultNS: "common",
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
