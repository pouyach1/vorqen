import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import GlassPanel from "../ui/GlassPanel";
import SkillsRadarChart from "../charts/SkillsRadarChart";
import { skillsRadar } from "../../data/skillsRadar";

export default function SkillsRadarSection() {
  return (
    <section id="skills" className="section-container">
      <SectionHeading
        eyebrow="Capability Map"
        title="Skills Radar"
        description="A proficiency snapshot across the disciplines behind every project above."
      />

      <GlassPanel glow="purple" className="grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-10">
        <SkillsRadarChart data={skillsRadar} />

        <div className="space-y-3">
          {skillsRadar.map((skill, i) => (
            <motion.div
              key={skill.axis}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-300">{skill.axis}</span>
                <span className="font-mono text-cyan-neon">{skill.value}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-neon to-purple-neon"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
}
