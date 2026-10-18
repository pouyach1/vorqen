import { motion } from "framer-motion";
import { Search, PenTool, Palette, Code2, CheckCircle2, Rocket } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import GlassPanel from "../ui/GlassPanel";
import { designProcess } from "../../data/designProcess";

const ICONS = { Search, PenTool, Palette, Code2, CheckCircle2, Rocket };

export default function DesignProcessSection() {
  return (
    <section id="process" className="section-container">
      <SectionHeading
        eyebrow="How I Work"
        title="Design Process"
        description="From first call to launch day — the same six-stage process behind every project on this page."
      />

      <div className="relative">
        {/* Connecting line — desktop only, draws in on scroll */}
        <div className="absolute left-0 right-0 top-9 hidden h-px bg-slate-800 lg:block" aria-hidden="true">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
            className="h-full bg-gradient-to-r from-cyan-neon via-purple-neon to-magenta-neon"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          {designProcess.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div className="relative z-10 mb-4 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-2 border-cyan-neon/40 bg-void shadow-neon-cyan">
                  <Icon size={26} className="text-cyan-neon" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-neon font-mono text-[10px] font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <GlassPanel glow="none" className="w-full p-4">
                  <h3 className="font-heading text-sm font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.description}</p>
                  <div className="mt-3 space-y-1.5 border-t border-slate-800 pt-3">
                    <p className="text-[10px] uppercase tracking-wide text-purple-neon">{step.deliverable}</p>
                    <p className="font-mono text-[10px] text-slate-500">{step.duration}</p>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
