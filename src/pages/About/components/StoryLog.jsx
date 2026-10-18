import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/ui/SectionHeading";
import GlassPanel from "../../../components/ui/GlassPanel";
import { storyMilestones, PLACEHOLDER_NOTE } from "../../../data/aboutPage";

export default function StoryLog() {
  const [activeId, setActiveId] = useState(storyMilestones[0]?.id);

  const active = storyMilestones.find((m) => m.id === activeId) ?? storyMilestones[0];

  return (
    <section className="section-container">
      <SectionHeading
        eyebrow="Archive // Journey"
        title="My Story"
        description="A phased log — select a milestone to decrypt the entry. Replace placeholder logs with your real path."
      />

      <p className="mb-10 font-mono text-xs text-slate-500">// {PLACEHOLDER_NOTE}</p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3">
          {storyMilestones.map((milestone, i) => {
            const isActive = milestone.id === activeId;
            return (
              <motion.button
                key={milestone.id}
                type="button"
                onClick={() => setActiveId(milestone.id)}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-left"
              >
                <GlassPanel
                  glow={isActive ? "cyan" : "cyan"}
                  className={`p-4 transition-all duration-300 ${
                    isActive
                      ? "border-cyan-neon/50 bg-cyan-neon/5"
                      : "border-cyan-neon/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-purple-neon">
                        {milestone.phase}
                      </p>
                      <p className="mt-1 font-heading text-sm font-bold uppercase tracking-wide text-white">
                        {milestone.label}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-xs ${isActive ? "text-cyan-neon" : "text-slate-600"}`}
                    >
                      {isActive ? "●" : "○"}
                    </span>
                  </div>
                </GlassPanel>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassPanel glow="purple" className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-neon via-purple-neon to-transparent" />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-neon">
              {active.phase} // decrypted
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">{active.title}</h3>
            <p className="mt-6 text-base leading-relaxed text-slate-400">{active.log}</p>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-cyan-neon/10 pt-6">
              {["INTEGRITY", "AUTH", "TIMESTAMP"].map((label) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-xs text-emerald-neon">VERIFIED</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
