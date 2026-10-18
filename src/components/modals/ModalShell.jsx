import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const GLOW_CLASSES = {
  cyan: "border-cyan-neon/30 shadow-neon-cyan",
  purple: "border-purple-neon/30 shadow-neon-purple",
  magenta: "border-magenta-neon/30 shadow-neon-magenta",
  emerald: "border-emerald-neon/30 shadow-neon-emerald",
};

export default function ModalShell({ open, onClose, children, glow = "cyan", wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 backdrop-blur-sm p-4"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className={`glass-panel max-h-[88vh] w-full overflow-y-auto ${GLOW_CLASSES[glow] ?? GLOW_CLASSES.cyan} ${
              wide ? "max-w-3xl" : "max-w-lg"
            }`}
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="sticky left-full top-4 z-10 -mb-8 mr-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-void/80 text-slate-300 hover:border-cyan-neon hover:text-cyan-neon"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
