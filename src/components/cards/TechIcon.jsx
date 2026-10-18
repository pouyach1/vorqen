import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TechIcon({ tech }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex cursor-default items-center justify-center rounded-xl border border-cyan-neon/20 bg-panel px-5 py-4 font-heading text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-neon/60 hover:text-cyan-neon">
        {tech.name}
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-10 mt-2 w-36 -translate-x-1/2 rounded-lg border border-cyan-neon/30 bg-void/95 p-3 text-center shadow-neon-cyan"
          >
            <p className="font-heading text-xs uppercase tracking-wider text-cyan-neon">{tech.level}</p>
            <p className="mt-1 text-[11px] text-slate-400">{tech.years} yrs experience</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
