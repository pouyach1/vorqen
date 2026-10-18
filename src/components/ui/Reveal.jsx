import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "../../lib/motion";

/** Lightweight scroll reveal — opacity + small y only. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 14,
  as: Tag = "div",
  once = true,
  amount = 0.2,
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] ?? motion.div;

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: DURATION.base, delay, ease: EASE.out }}
    >
      {children}
    </MotionTag>
  );
}
