import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { CURSOR } from "../../lib/interaction";

/**
 * Desktop-only custom cursor.
 * Hover detection uses a ref flag + rAF-coalesced state to avoid render storms.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);
  const rafHover = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, CURSOR.dotSpring);
  const dotY = useSpring(y, CURSOR.dotSpring);
  const ringX = useSpring(x, CURSOR.ringSpring);
  const ringY = useSpring(y, CURSOR.ringSpring);

  useEffect(() => {
    if (reduce) return undefined;

    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return undefined;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const onOver = (e) => {
      const el = e.target.closest(
        "a, button, [role='button'], input, textarea, label, .cursor-pointer, [data-cursor='interactive']"
      );
      const next = Boolean(el);
      if (next === hoveringRef.current) return;
      hoveringRef.current = next;
      cancelAnimationFrame(rafHover.current);
      rafHover.current = requestAnimationFrame(() => setHovering(next));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(rafHover.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        className="absolute top-0 left-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: hovering ? CURSOR.hoverScale : CURSOR.idleScale,
          opacity: hovering ? 0.8 : 0.45,
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
