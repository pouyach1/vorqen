import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MOOD_ORDER, MOODS, SFX } from "./moods";
import { playKuroMood } from "./audio";
import { FONT_DISPLAY, FONT_FA } from "./tokens";
import KuroCharacter from "./KuroCharacter";

/**
 * Embeddable Kuro for Hero / About — character + optional mood SFX bubble.
 * Full-page chrome lives in KuroExperience; this is the site companion mount.
 */
export default function KuroCompanion({
  scale = 1,
  initialMood = "happy",
  soundEnabled = true,
  showSfx = true,
  showCaption = false,
  cycleOnTap = true,
  className = "",
  onInteract,
}) {
  const stageRef = useRef(null);
  const [mood, setMood] = useState(initialMood);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cfg = MOODS[mood];
  const sfx = SFX[mood];
  const AccessoryIcon = cfg.accessory;

  const playSound = useCallback(
    (moodKey) => {
      playKuroMood(moodKey, {
        soundOn: soundEnabled,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    },
    [soundEnabled]
  );

  const handleTap = useCallback(() => {
    let next = mood;
    if (cycleOnTap) {
      const idx = MOOD_ORDER.indexOf(mood);
      next = MOOD_ORDER[(idx + 1) % MOOD_ORDER.length];
      setMood(next);
    }
    playSound(next);
    onInteract?.(next);
  }, [mood, cycleOnTap, playSound, onInteract]);

  // Native character is ~220×310 including antenna; pad for glow + bob.
  const baseW = 260;
  const baseH = 340;

  return (
    <div
      ref={stageRef}
      className={`relative mx-auto flex items-center justify-center ${className}`}
      style={{
        width: baseW * scale,
        height: baseH * scale,
        perspective: 900,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: baseW,
          height: baseH,
        }}
        className="relative flex items-center justify-center"
      >
        {showSfx && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mood}-sfx`}
              initial={{ opacity: 0, scale: 0.6, rotate: -12, y: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: -6, y: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="absolute left-0 top-6 z-20 -translate-x-2 sm:left-2 sm:top-4"
              style={{ transformOrigin: "bottom center" }}
            >
              <motion.div
                className="rounded-2xl px-3 py-2 text-center"
                animate={{ scale: isSpeaking ? [1, 1.06, 1] : 1 }}
                transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0, ease: "easeInOut" }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${cfg.accent}${isSpeaking ? "cc" : "66"}`,
                  boxShadow: isSpeaking ? `0 0 24px ${cfg.glow}` : `0 0 14px ${cfg.glow}`,
                }}
              >
                <div style={{ fontFamily: FONT_DISPLAY }} className="whitespace-nowrap text-sm font-bold leading-none text-white">
                  {sfx.jp}
                </div>
                <div className="mt-1 whitespace-nowrap text-[9px] italic text-white/45">{sfx.romaji}</div>
                <div dir="rtl" style={{ fontFamily: FONT_FA }} className="mt-1 whitespace-nowrap text-[10px] text-white/80">
                  <span className="block border-t border-white/10 pt-1">{sfx.fa}</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          <motion.div
            key={`${mood}-accessory`}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 0.9, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.35 }}
            className="absolute right-4 top-8 z-10 rounded-2xl p-2"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${cfg.accent}55`,
              boxShadow: `0 0 18px ${cfg.glow}`,
            }}
          >
            <AccessoryIcon size={16} color={cfg.accessoryColor} fill={mood === "love" ? cfg.accessoryColor : "none"} />
          </motion.div>
        </AnimatePresence>

        <KuroCharacter mood={mood} onTap={handleTap} containerRef={stageRef} />

        {showCaption && (
          <p className="absolute bottom-2 left-1/2 w-max -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {cfg.caption}
          </p>
        )}
      </div>
    </div>
  );
}
