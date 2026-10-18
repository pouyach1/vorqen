import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "../../../components/ui/GlassPanel";
import { SITE } from "../../../lib/constants";
import { bootLines, identityDescriptors } from "../../../data/aboutPage";

const LINE_DELAY = 420;

export default function IdentityHero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (visibleLines >= bootLines.length) {
      const timer = setTimeout(() => setBootComplete(true), 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisibleLines((n) => n + 1), LINE_DELAY);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <section className="section-container grid items-center gap-12 pt-40 md:grid-cols-2 md:pt-48">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 font-heading text-sm uppercase tracking-[0.3em] text-purple-neon"
        >
          Identity Interface // Profile Load
        </motion.p>

        <GlassPanel glow="purple" className="mb-8 p-5 font-mono text-xs leading-relaxed">
          <p className="mb-3 text-slate-500">// system boot</p>
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={i === visibleLines - 1 && !bootComplete ? "text-emerald-neon" : "text-slate-400"}
            >
              {line}
              {i === visibleLines - 1 && !bootComplete && (
                <span className="animate-pulse-slow text-cyan-neon">_</span>
              )}
            </motion.p>
          ))}
        </GlassPanel>

        <AnimatePresence>
          {bootComplete && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
                <span className="text-slate-500">SUBJECT:</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-neon via-purple-neon to-magenta-neon bg-clip-text text-transparent neon-text-glow">
                  {SITE.name}
                </span>
              </h1>

              <p className="mt-4 font-heading text-lg uppercase tracking-widest text-cyan-neon">
                {SITE.role}
              </p>

              <p className="mt-6 max-w-lg text-slate-400">
                A digital dossier — not a résumé. This interface maps how I think, build, and
                evolve as a creator operating at the intersection of{" "}
                <span className="text-white">technology</span>,{" "}
                <span className="text-white">design</span>, and{" "}
                <span className="text-white">automation</span>.
              </p>

              <p className="mt-3 font-mono text-xs text-slate-500">
                // demo identity — replace in constants & aboutPage data
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-neon/10 via-transparent to-purple-neon/10 blur-2xl" />

        <AnimatePresence>
          {bootComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <GlassPanel className="relative overflow-hidden p-6 md:p-8">
                <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-cyan-neon/20 to-transparent" />
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Live System Snapshot
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {identityDescriptors.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="rounded-xl border border-cyan-neon/15 bg-void/40 p-4"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-widest text-purple-neon">
                        {item.key}
                      </p>
                      <p className="mt-1 font-heading text-sm font-bold uppercase tracking-wide text-white">
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-cyan-neon/10 pt-5">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-neon opacity-40" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-neon shadow-neon-emerald" />
                  </span>
                  <p className="font-mono text-xs text-emerald-neon">
                    NEURAL LINK ACTIVE — {SITE.robotName} monitoring profile
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {!bootComplete && (
          <GlassPanel className="flex h-64 items-center justify-center p-8 md:h-80">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-cyan-neon/30 border-t-cyan-neon"
              />
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Awaiting identity decryption...
              </p>
            </div>
          </GlassPanel>
        )}
      </div>
    </section>
  );
}
