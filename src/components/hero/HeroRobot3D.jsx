import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { KuroCompanion } from "../robot/kuro";
import HologramBubble from "../robot/HologramBubble";
import { EASE } from "../../lib/motion";

export default function HeroRobot3D() {
  const [pulse, setPulse] = useState(false);
  const [wavePops, setWavePops] = useState([]);
  const hasGreeted = useRef(false);
  const reduce = useReducedMotion();

  function handleInteract() {
    setPulse(true);
    setTimeout(() => setPulse(false), 900);

    if (!hasGreeted.current) {
      hasGreeted.current = true;
    }

    const id = Date.now();
    setWavePops((prev) => [...prev, id]);
    setTimeout(() => setWavePops((prev) => prev.filter((p) => p !== id)), 900);
  }

  return (
    <div className="relative">
      {pulse && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2
            animate-ping rounded-full border-2 border-cyan-neon"
          style={{ animationDuration: "0.9s" }}
        />
      )}

      <AnimatePresence>
        {wavePops.map((id) => (
          <motion.span
            key={id}
            aria-hidden="true"
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -60, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE.out }}
            className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 text-3xl"
          >
            👋
          </motion.span>
        ))}
      </AnimatePresence>

      <HologramBubble />
      <KuroCompanion
        scale={1.05}
        soundEnabled
        showSfx
        onInteract={handleInteract}
        className="mt-2"
      />
      <motion.p
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500"
      >
        Tap Kuro — moods shift
      </motion.p>
    </div>
  );
}
