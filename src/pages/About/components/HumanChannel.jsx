import { motion } from "framer-motion";
import SectionHeading from "../../../components/ui/SectionHeading";
import GlassPanel from "../../../components/ui/GlassPanel";
import { humanSignals } from "../../../data/aboutPage";
import { SITE } from "../../../lib/constants";

export default function HumanChannel() {
  return (
    <section className="section-container">
      <SectionHeading
        eyebrow="Human // Off-System Signal"
        title="Technology × Creativity × Human"
        description="The interface is futuristic — the operator is not. A quiet channel for the person behind the code."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <GlassPanel glow="magenta" className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-magenta-neon/10 blur-3xl" />
          <p className="font-mono text-xs uppercase tracking-widest text-magenta-neon">
            Operator Note
          </p>
          <blockquote className="mt-6 text-xl font-medium leading-relaxed text-white md:text-2xl">
            &ldquo;I build digital systems that feel{" "}
            <span className="text-cyan-neon">alive</span> — but I stay grounded in{" "}
            <span className="text-purple-neon">curiosity</span>,{" "}
            <span className="text-emerald-neon">craft</span>, and the messy human reasons
            products need to exist.&rdquo;
          </blockquote>
          <p className="mt-6 font-mono text-xs text-slate-500">
            — [{SITE.name}] // personalize this quote in aboutPage.js
          </p>
        </GlassPanel>

        <div className="grid gap-4">
          {humanSignals.map((signal, i) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassPanel className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-neon">
                  {signal.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{signal.detail}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
