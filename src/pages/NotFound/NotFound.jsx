import { useTranslation } from "react-i18next";
import NeonGrid from "../../components/background/NeonGrid";
import AmbientGlows from "../../components/background/AmbientGlows";
import NoiseOverlay from "../../components/background/NoiseOverlay";
import GlassPanel from "../../components/ui/GlassPanel";
import NeonButton from "../../components/ui/NeonButton";
import { useLocale } from "../../i18n/useLocale";

export default function NotFound() {
  const { t } = useTranslation();
  const { localizeHref } = useLocale();

  return (
    <div className="relative min-h-screen">
      <NeonGrid />
      <AmbientGlows />
      <NoiseOverlay />

      <main className="section-container flex min-h-screen items-center justify-center">
        <GlassPanel className="max-w-lg p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-magenta-neon">
            {t("notFound.eyebrow")}
          </p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">{t("notFound.title")}</h1>
          <p className="mt-4 text-slate-400">{t("notFound.body")}</p>
          <NeonButton as="a" href={localizeHref("/")} className="mt-8">
            {t("notFound.cta")}
          </NeonButton>
        </GlassPanel>
      </main>
    </div>
  );
}
