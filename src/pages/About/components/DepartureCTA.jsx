import { motion } from "framer-motion";
import GlassPanel from "../../../components/ui/GlassPanel";
import NeonButton from "../../../components/ui/NeonButton";
import { departurePaths } from "../../../data/aboutPage";
import { SITE } from "../../../lib/constants";

const ACCENT = {
  cyan: "border-cyan-neon/30 hover:shadow-neon-cyan text-cyan-neon",
  purple: "border-purple-neon/30 hover:shadow-neon-purple text-purple-neon",
  magenta: "border-magenta-neon/30 hover:shadow-neon-magenta text-magenta-neon",
};

export default function DepartureCTA() {
  return (
    <section className="section-container pb-32">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-neon/5 via-purple-neon/5 to-magenta-neon/5 blur-2xl" />

        <GlassPanel glow="cyan" className="relative overflow-hidden p-8 md:p-12 text-center">
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-neon to-transparent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-neon">
            Session Complete
          </p>
          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Ready to build something{" "}
            <span className="bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent">
              unforgettable
            </span>
            ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            You&apos;ve toured the identity interface. The main domain holds projects, live bots,
            and a direct contact terminal — pick your next vector.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {departurePaths.map((path, i) => (
              <motion.a
                key={path.id}
                href={path.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`group rounded-2xl border bg-void/40 p-5 text-left transition-shadow duration-300 ${ACCENT[path.accent]}`}
              >
                <p className="font-heading text-sm font-bold uppercase tracking-widest">
                  {path.label}
                </p>
                <p className="mt-2 text-xs text-slate-400 group-hover:text-slate-300">
                  {path.desc}
                </p>
                <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100">
                  execute →
                </span>
              </motion.a>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NeonButton as="a" href="/#contact" variant="cyan">
              Start a Project
            </NeonButton>
            <NeonButton as="a" href="/" variant="purple">
              Return to Domain
            </NeonButton>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-slate-600">
            {SITE.robotName} // identity session archived · {new Date().getFullYear()}
          </p>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
