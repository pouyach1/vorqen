import { memo } from "react";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

function SystemStatusBar({ chapterLabel, phase }) {
  const phaseLabel =
    phase === "boot"
      ? "BOOT"
      : phase === "typing"
        ? "WRITING"
        : phase === "processing"
          ? "EVAL"
          : phase === "response" || phase === "ready"
            ? "LIVE"
            : "IDLE";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-cyan-neon/15 bg-void/70 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
      <span className="text-emerald-neon">● {ABOUT_CREATOR.robotName}</span>
      <span className="text-slate-600">|</span>
      <span>Channel: {chapterLabel}</span>
      <span className="text-slate-600">|</span>
      <span className="text-cyan-neon">{phaseLabel}</span>
      <span className="ml-auto text-slate-600">creator.env · read-only session</span>
    </div>
  );
}

export default memo(SystemStatusBar);
