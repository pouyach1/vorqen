import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "../../lib/motion";
import Magnetic from "../interaction/Magnetic";

const VARIANTS = {
  cyan: "border-cyan-neon/60 text-cyan-neon hover:shadow-neon-cyan hover:border-cyan-neon hover:bg-cyan-neon/5",
  purple:
    "border-purple-neon/60 text-purple-neon hover:shadow-neon-purple hover:border-purple-neon hover:bg-purple-neon/5",
};

export default function NeonButton({
  children,
  variant = "cyan",
  as: Tag = "button",
  className = "",
  magnetic = true,
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] ?? motion.button;

  const button = (
    <MotionTag
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.28, ease: EASE.snappy }}
      data-cursor="interactive"
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border bg-void/60 px-6 py-3
        font-heading text-sm font-semibold uppercase tracking-widest transition-[box-shadow,border-color,background-color] duration-300
        ${VARIANTS[variant] ?? VARIANTS.cyan} ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent
          transition-transform duration-500 ease-out group-hover:translate-x-full"
      />
    </MotionTag>
  );

  if (!magnetic || reduce) return button;

  return <Magnetic>{button}</Magnetic>;
}
