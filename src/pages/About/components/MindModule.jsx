import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/ui/SectionHeading";
import GlassPanel from "../../../components/ui/GlassPanel";
import { mindPillars } from "../../../data/aboutPage";

export default function MindModule() {
  const [focused, setFocused] = useState(mindPillars[0]?.id);

  const active = mindPillars.find((p) => p.id === focused) ?? mindPillars[0];

  return (
    <section className="section-container">
      <SectionHeading
        eyebrow="Cognition // Operating Principles"
        title="How I Think"
        description="Six channels in my mental stack — hover or focus to read the signal behind each principle."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
          {mindPillars.map((pillar, i) => {
            const isFocused = pillar.id === focused;
            return (
              <motion.button
                key={pillar.id}
                type="button"
                onMouseEnter={() => setFocused(pillar.id)}
                onFocus={() => setFocused(pillar.id)}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-left"
              >
                <GlassPanel
                  glow={isFocused ? "magenta" : "cyan"}
                  className={`group relative h-full p-4 transition-all duration-300 ${
                    isFocused ? "border-magenta-neon/40 shadow-neon-magenta" : ""
                  }`}
                >
                  <span className="text-2xl text-purple-neon/80">{pillar.glyph}</span>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {pillar.channel}
                  </p>
                  <p className="mt-1 font-heading text-sm font-bold uppercase tracking-wide text-white">
                    {pillar.title}
                  </p>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-neon to-purple-neon"
                    initial={{ width: 0 }}
                    animate={{ width: isFocused ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </GlassPanel>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-1"
        >
          <GlassPanel glow="emerald" className="flex h-full flex-col p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-neon">
              Signal // {active.channel}
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">{active.title}</h3>
            <p className="mt-4 flex-grow text-sm leading-relaxed text-slate-400">{active.thought}</p>
            <p className="mt-6 font-mono text-[10px] text-slate-600">
              // placeholder thought — personalize in aboutPage.js
            </p>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
