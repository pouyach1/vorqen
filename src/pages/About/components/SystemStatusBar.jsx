import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

const PHASE_KEYS = {
  boot: "boot",
  typing: "typing",
  processing: "processing",
  response: "live",
  ready: "live",
};

function SystemStatusBar({ chapterLabel, phase }) {
  const { t } = useTranslation("about");
  const phaseKey = PHASE_KEYS[phase] ?? "idle";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-cyan-neon/15 bg-void/70 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
      <span className="text-emerald-neon">● {ABOUT_CREATOR.robotName}</span>
      <span className="text-slate-600">|</span>
      <span>{t("workstation.channel", { label: chapterLabel })}</span>
      <span className="text-slate-600">|</span>
      <span className="text-cyan-neon">{t(`workstation.phases.${phaseKey}`)}</span>
      <span className="ms-auto text-slate-600" dir="ltr">
        creator.env · {t("workstation.readOnly")}
      </span>
    </div>
  );
}

export default memo(SystemStatusBar);
