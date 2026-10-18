import { motion } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";
import TypewriterText from "../ui/TypewriterText";
import { ROBOT_MESSAGES, SITE } from "../../lib/constants";
import { EASE, DURATION } from "../../lib/motion";

export default function HologramBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.85, duration: DURATION.slow, ease: EASE.cinematic }}
      className="absolute -top-4 right-0 w-64 md:-top-2 md:right-4"
    >
      <GlassPanel glow="purple" className="p-4 shadow-neon-purple">
        <p className="mb-1 font-heading text-xs uppercase tracking-widest text-purple-neon">
          {SITE.robotName} // online
        </p>
        <TypewriterText messages={ROBOT_MESSAGES} />
      </GlassPanel>
    </motion.div>
  );
}
