import { useEffect, useState } from "react";
import App from "./App";
import About from "./pages/About/About";
import WorldPage from "./pages/World/WorldPage";
import NotFound from "./pages/NotFound/NotFound";
import InteractionLayer from "./components/interaction/InteractionLayer";
import DocumentMeta from "./components/seo/DocumentMeta";
import i18n from "./i18n";
import { applyDocumentLocale, resolveRoute } from "./i18n/locale";

const PAGES = { home: App, about: About, world: WorldPage, notFound: NotFound };

export default function AppRouter() {
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname));

  useEffect(() => {
    const onNavigate = () => setRoute(resolveRoute(window.location.pathname));
    window.addEventListener("popstate", onNavigate);
    return () => window.removeEventListener("popstate", onNavigate);
  }, []);

  useEffect(() => {
    applyDocumentLocale(route.locale);
    if (i18n.language !== route.locale) i18n.changeLanguage(route.locale);
  }, [route.locale]);

  const Page = PAGES[route.page] ?? NotFound;

  return (
    <>
      <DocumentMeta pathname={route.seoPath} />
      <InteractionLayer enableSmoothScroll={route.page !== "world"} />
      <Page />
    </>
  );
}