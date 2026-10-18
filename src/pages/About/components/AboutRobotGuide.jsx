import { memo } from "react";
import { KuroCompanion } from "../../../components/robot/kuro";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

/**
 * About-only Kuro guide — scaled companion, focused mood, soft interaction.
 */
function AboutRobotGuide() {
  return (
    <div className="relative mx-auto w-full max-w-[220px] lg:max-w-[260px]">
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-cyan-neon/5 blur-2xl" />
      <KuroCompanion
        scale={0.72}
        initialMood="focused"
        soundEnabled={false}
        showSfx={false}
        cycleOnTap
        className="relative z-10"
      />
      <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {ABOUT_CREATOR.robotName} · presentation assistant
      </p>
    </div>
  );
}

export default memo(AboutRobotGuide);
