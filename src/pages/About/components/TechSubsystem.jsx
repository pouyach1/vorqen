import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/ui/SectionHeading";
import GlassPanel from "../../../components/ui/GlassPanel";
import SkillsRadarChart from "../../../components/charts/SkillsRadarChart";
import { skillsRadar } from "../../../data/skillsRadar";
import { techStack, techCategories } from "../../../data/techStack";

const LEVEL_WIDTH = {
  Expert: "w-full",
  Advanced: "w-4/5",
  Intermediate: "w-3/5",
};

export default function TechSubsystem() {
  const [category, setCategory] = useState(techCategories[0]);
  const filtered = techStack.filter((t) => t.category === category);

  return (
    <section className="section-container">
      <SectionHeading
        eyebrow="Subsystem // Capabilities"
        title="Skills & Technology"
        description="Radar scan of core competencies plus a live module registry from project demo data."
      />

      <div className="grid items-start gap-10 lg:grid-cols-2">
        <GlassPanel className="p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-neon">
            Competency Radar
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Hover axes to inspect signal strength. Values reflect demo portfolio data.
          </p>
          <div className="mt-6">
            <SkillsRadarChart data={skillsRadar} />
          </div>
        </GlassPanel>

        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {techCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-2 font-heading text-xs uppercase tracking-widest transition-all ${
                  category === cat
                    ? "border-cyan-neon/60 bg-cyan-neon/10 text-cyan-neon shadow-neon-cyan"
                    : "border-cyan-neon/20 text-slate-400 hover:border-cyan-neon/40 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <GlassPanel className="p-5">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-purple-neon">
              Module Registry // {category}
            </p>

            <div className="space-y-3">
              {filtered.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-cyan-neon/10 bg-void/30 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-heading text-sm font-bold text-white">{tech.name}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        {tech.level} · {tech.years}y
                      </p>
                    </div>
                    <span className="font-mono text-xs text-emerald-neon">LOADED</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-800">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r from-cyan-neon to-purple-neon ${LEVEL_WIDTH[tech.level] ?? "w-1/2"}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="mt-5 font-mono text-[10px] text-slate-600">
              // tech stack data is demo — update in data/techStack.js
            </p>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
