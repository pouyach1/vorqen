import { motion } from "framer-motion";
import SectionHeading from "../../../components/ui/SectionHeading";
import GlassPanel from "../../../components/ui/GlassPanel";
import { experience } from "../../../data/experience";

export default function JourneyArchive() {
  return (
    <section className="section-container">
      <SectionHeading
        eyebrow="Career // Experience Log"
        title="Experience & Journey"
        description="Timeline entries sourced from project demo data — treat as placeholder until you replace them."
      />

      <GlassPanel glow="purple" className="mb-8 border-purple-neon/20 p-4">
        <p className="font-mono text-xs text-amber-400/90">
          ⚠ DEMO DATA — roles and periods below are portfolio placeholders, not verified biography.
          Replace in <span className="text-slate-300">src/data/experience.js</span>.
        </p>
      </GlassPanel>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-neon/40 via-purple-neon/30 to-transparent md:left-1/2" />

        {experience.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative mb-10 flex md:mb-14 ${
                isLeft ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <span
                className="absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-neon shadow-neon-cyan md:left-1/2"
              />

              <GlassPanel
                className={`ml-10 w-full max-w-md p-5 md:ml-0 ${
                  isLeft ? "md:mr-[calc(50%+2rem)]" : "md:ml-[calc(50%+2rem)]"
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-purple-neon">
                  LOG_{String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-heading text-xs uppercase tracking-widest text-cyan-neon">
                  {item.period}
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">{item.role}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.summary}</p>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
