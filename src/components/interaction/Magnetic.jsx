import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { MAGNETIC } from "../../lib/interaction";

/**
 * Subtle magnetic pull for primary CTAs.
 * Uses springs — no per-frame React state.
 */
export default function Magnetic({
  children,
  className = "",
  strength = MAGNETIC.strength,
  maxPull = MAGNETIC.maxPull,
  disabled = false,
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, MAGNETIC.spring);
  const sy = useSpring(y, MAGNETIC.spring);

  if (reduce || disabled) {
    return <div className={className}>{children}</div>;
  }

  function onMove(e) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    x.set(Math.max(-maxPull, Math.min(maxPull, dx)));
    y.set(Math.max(-maxPull, Math.min(maxPull, dy)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="interactive"
    >
      {children}
    </motion.div>
  );
}
