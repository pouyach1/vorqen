import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import GlassPanel from "../ui/GlassPanel";
import NeonButton from "../ui/NeonButton";
import { useAppStore } from "../../store/useAppStore";
import { projectTypes, featureOptions, timelineOptions } from "../../data/configurator";
import { calculateEstimate, buildTelegramProposalUrl } from "../../lib/pricing";

const STEP_LABELS = ["Project Type", "Features", "Timeline", "Estimate"];

export default function CostEstimator() {
  const configurator = useAppStore((s) => s.configurator);
  const setConfiguratorType = useAppStore((s) => s.setConfiguratorType);
  const toggleConfiguratorFeature = useAppStore((s) => s.toggleConfiguratorFeature);
  const setConfiguratorTimeline = useAppStore((s) => s.setConfiguratorTimeline);
  const setConfiguratorStep = useAppStore((s) => s.setConfiguratorStep);
  const resetConfigurator = useAppStore((s) => s.resetConfigurator);

  const { step, projectType, features, timeline } = configurator;
  const estimate = projectType && timeline ? calculateEstimate({ projectType, features, timeline }) : null;

  return (
    <section id="estimator" className="section-container">
      <SectionHeading
        eyebrow="Configurator"
        title="Project Cost Estimator"
        description="Answer three quick questions for a live price and timeline estimate."
      />

      <GlassPanel glow="purple" className="mx-auto max-w-3xl p-6 md:p-8">
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-xs
                  ${step > i ? "bg-cyan-neon text-void" : "border border-slate-600 text-slate-500"}`}
              >
                {i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px flex-1 ${step > i + 1 ? "bg-cyan-neon" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="mb-4 font-heading text-sm uppercase tracking-widest text-purple-neon">
                1. Select Project Type
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfiguratorType(type.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      projectType === type.id
                        ? "border-cyan-neon bg-cyan-neon/10"
                        : "border-slate-700 hover:border-cyan-neon/50"
                    }`}
                  >
                    <p className="font-heading font-bold text-white">{type.label}</p>
                    <p className="mt-1 text-xs text-slate-400">from ${type.basePrice}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="mb-4 font-heading text-sm uppercase tracking-widest text-purple-neon">
                2. Select Features
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {featureOptions.map((feature) => {
                  const selected = features.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleConfiguratorFeature(feature.id)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                        selected ? "border-cyan-neon bg-cyan-neon/10" : "border-slate-700 hover:border-cyan-neon/50"
                      }`}
                    >
                      <span className="font-heading text-sm text-white">{feature.label}</span>
                      <span className="text-xs text-slate-400">+${feature.price}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setConfiguratorStep(1)} className="font-heading text-xs uppercase tracking-widest text-slate-400 hover:text-white">
                  Back
                </button>
                <NeonButton magnetic={false} onClick={() => setConfiguratorStep(3)}>
                  Next
                </NeonButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="mb-4 font-heading text-sm uppercase tracking-widest text-purple-neon">
                3. Select Timeline & Delivery Speed
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {timelineOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setConfiguratorTimeline(option.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      timeline === option.id ? "border-cyan-neon bg-cyan-neon/10" : "border-slate-700 hover:border-cyan-neon/50"
                    }`}
                  >
                    <p className="font-heading font-bold text-white">{option.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{option.note}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <button onClick={() => setConfiguratorStep(2)} className="font-heading text-xs uppercase tracking-widest text-slate-400 hover:text-white">
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && estimate && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="mb-4 font-heading text-sm uppercase tracking-widest text-purple-neon">
                Live Estimate
              </h3>
              <div className="rounded-xl border border-cyan-neon/30 bg-cyan-neon/5 p-6 text-center">
                <p className="font-display text-3xl font-black text-cyan-neon md:text-4xl">
                  ${estimate.priceLow.toLocaleString()} – ${estimate.priceHigh.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-400">Estimated delivery: ~{estimate.days} days</p>
              </div>

              <div className="mt-4 text-sm text-slate-400">
                <p><span className="text-slate-300">Type:</span> {estimate.typeLabel}</p>
                {estimate.featureLabels.length > 0 && (
                  <p className="mt-1"><span className="text-slate-300">Features:</span> {estimate.featureLabels.join(", ")}</p>
                )}
                <p className="mt-1"><span className="text-slate-300">Speed:</span> {estimate.timelineLabel}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <NeonButton
                  as="a"
                  href={buildTelegramProposalUrl({ estimate })}
                  target="_blank"
                  rel="noreferrer"
                  variant="cyan"
                >
                  Generate Proposal & Send to Telegram
                </NeonButton>
                <button
                  onClick={resetConfigurator}
                  className="font-heading text-xs uppercase tracking-widest text-slate-400 hover:text-white"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </section>
  );
}
