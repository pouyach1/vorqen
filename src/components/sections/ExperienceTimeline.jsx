import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import GlassPanel from "../ui/GlassPanel";
import { experience } from "../../data/experience";
import { EASE, DURATION } from "../../lib/motion";

export default function ExperienceTimeline() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="section-container">
      <SectionHeading
        eyebrow="Career Log"
        title="Experience"
        description="Selected chapters from the build log — not a résumé dump."
      />

      <div className="relative border-l border-cyan-neon/20 pl-8">
        {experience.map((item, i) => (
          <motion.div
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: DURATION.base, delay: i * 0.05, ease: EASE.out }}
            className="relative mb-8 last:mb-0"
          >
            <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full bg-cyan-neon" />
            <GlassPanel className="surface-interactive p-5">
              <p className="font-heading text-xs uppercase tracking-widest text-purple-neon">
                {item.period}
              </p>
              <h3 className="mt-1 font-heading text-lg font-bold text-white">{item.role}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.summary}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
