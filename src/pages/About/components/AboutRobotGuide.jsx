import { memo, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { KuroCompanion } from "../../../components/robot/kuro";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

const GESTURES = {
  idle: { rotate: 0, y: 0, x: 0, scale: 1 },
  tilt: {
    rotate: [0, -8, -6],
    y: [0, 2, 1],
    x: 0,
    scale: 1,
  },
  think: {
    rotate: [0, -10, -8],
    y: [0, 3, 1],
    x: [0, 4, 2],
    scale: [1, 0.98, 1],
  },
  bounce: {
    rotate: [0, -5, 5, 0],
    y: [0, -10, 0, -5, 0],
    x: 0,
    scale: [1, 1.05, 1],
  },
  look: {
    rotate: [0, -10, -7],
    y: [0, -2, 0],
    x: [0, -12, -8],
    scale: 1,
  },
  surprise: {
    rotate: [0, 3, 0],
    y: [0, -14, -6],
    x: 0,
    scale: [1, 1.08, 1.03],
  },
  confuse: {
    rotate: [0, -6, 5, -3, 0],
    y: [0, 1, 0],
    x: [0, 4, -2, 0],
    scale: 1,
  },
  shake: {
    rotate: [0, -12, 12, -9, 9, 0],
    y: [0, -2, 0],
    x: 0,
    scale: 1,
  },
  hope: {
    rotate: [-6, -2, 0],
    y: [2, -4, -2],
    x: 0,
    scale: [0.98, 1.03, 1.01],
  },
  delight: {
    rotate: [0, -6, 6, -3, 0],
    y: [0, -12, 0, -6, 0],
    x: 0,
    scale: [1, 1.06, 1],
  },
  proud: {
    rotate: [0, -3, 0],
    y: [0, -6, -3],
    x: 0,
    scale: [1, 1.04, 1.02],
  },
  wave: {
    rotate: [0, -7, 8, -5, 0],
    y: [0, -8, 0, -4, 0],
    x: 0,
    scale: 1,
  },
};

const GLOW = {
  excited: "bg-amber-300/15",
  sad: "bg-slate-400/12",
  love: "bg-pink-400/15",
  happy: "bg-cyan-neon/10",
  playful: "bg-pink-300/15",
  focused: "bg-cyan-neon/10",
  thinking: "bg-purple-neon/10",
};

/**
 * About workstation Kuro — mood + beat gestures driven by parent.
 * Happy: wave · Excited: bounce · Thinking: tilt/think/look · Sad→hope · Journey beats.
 */
function AboutRobotGuide({ mood = "happy", speaking = false, beat = "idle" }) {
  const { t, i18n } = useTranslation("about");
  const reduce = useReducedMotion();
  const isFa = i18n.language === "fa";
  const [waveTick, setWaveTick] = useState(0);

  useEffect(() => {
    if (reduce || !speaking) return undefined;
    if (beat === "wave" || (mood === "happy" && (!beat || beat === "idle"))) {
      setWaveTick((n) => n + 1);
    }
    return undefined;
  }, [speaking, mood, beat, reduce]);

  const gesture = useMemo(() => {
    if (reduce) return GESTURES.idle;
    if (speaking && beat && beat !== "idle" && GESTURES[beat]) {
      return GESTURES[beat];
    }
    if (mood === "excited" && speaking) return GESTURES.bounce;
    if (mood === "playful" && speaking) return GESTURES.bounce;
    if (mood === "thinking" && speaking) return GESTURES.tilt;
    if (mood === "sad" && speaking) return GESTURES.tilt;
    if ((mood === "happy" || mood === "love") && speaking) return GESTURES.wave;
    return GESTURES.idle;
  }, [mood, speaking, beat, reduce]);

  const motionKey =
    beat && beat !== "idle"
      ? `${mood}-${beat}-${speaking}`
      : mood === "happy"
        ? `${mood}-wave-${waveTick}`
        : `${mood}-${speaking}`;

  return (
    <div className="relative mx-auto w-full max-w-[200px] lg:max-w-[240px]">
      <div
        className={`pointer-events-none absolute -inset-4 rounded-full blur-2xl ${
          GLOW[mood] || "bg-cyan-neon/10"
        }`}
      />
      <motion.div
        key={motionKey}
        className="relative z-10"
        initial={false}
        animate={gesture}
        transition={
          beat === "confuse" || beat === "shake"
            ? { duration: 0.85, ease: "easeInOut" }
            : beat === "hope" || beat === "proud"
              ? { duration: 1.1, ease: "easeOut" }
              : beat === "surprise"
                ? { duration: 0.7, ease: "easeOut" }
                : { duration: 1.25, ease: "easeInOut" }
        }
      >
        <KuroCompanion
          scale={0.62}
          mood={mood}
          soundEnabled={false}
          showSfx={false}
          showAccessory={false}
          cycleOnTap={false}
          className="relative z-10"
        />
      </motion.div>
      <p
        className={`mt-1 text-center text-[10px] text-slate-500 ${
          isFa ? "font-heading tracking-normal" : "font-mono uppercase tracking-[0.2em]"
        }`}
      >
        {t("workstation.presenter", { robot: ABOUT_CREATOR.robotName })}
      </p>
      <p
        className={`mt-0.5 text-center text-[10px] text-cyan-neon/70 ${
          isFa ? "font-heading" : "font-mono uppercase tracking-widest"
        }`}
      >
        {t(`workstation.kuroPanel.mood.${mood}`, { defaultValue: mood })}
      </p>
    </div>
  );
}

export default memo(AboutRobotGuide);
