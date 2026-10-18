import { motion, useReducedMotion } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";
import StatusDot from "../ui/StatusDot";
import NeonButton from "../ui/NeonButton";
import { useAppStore } from "../../store/useAppStore";
import { EASE, DURATION } from "../../lib/motion";

export default function BotCard({ bot, live }) {
  const openBotDemo = useAppStore((s) => s.openBotDemo);
  const reduce = useReducedMotion();

  const displayMetrics = live
    ? {
        activeUsers: live.active_users?.toLocaleString() ?? bot.metrics.activeUsers,
        avgResponse: live.latency_ms ? `${live.latency_ms}ms` : bot.metrics.avgResponse,
        uptime: live.uptime_percent ? `${live.uptime_percent}%` : bot.metrics.uptime,
      }
    : bot.metrics;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION.base, ease: EASE.out }}
      className="h-full"
    >
      <GlassPanel glow={bot.avatarGlow} className="surface-interactive flex h-full flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-md border border-purple-neon/30 bg-purple-neon/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-purple-neon">
            {bot.badge}
          </span>
          <StatusDot liveStatus={live?.status} />
        </div>

        <h3 className="font-heading text-lg font-bold text-white">{bot.name}</h3>
        <p dir="auto" className="mt-2 text-sm leading-relaxed text-slate-400">
          {bot.description}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {Object.entries(displayMetrics).map(([key, value]) => (
            <div key={key} className="rounded-lg bg-void/40 py-2">
              <p className="font-heading text-sm font-bold text-cyan-neon">{value}</p>
              <p className="text-[9px] uppercase tracking-wide text-slate-500">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {bot.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-600 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {bot.features.map((feature) => (
            <span key={feature} className="rounded-full bg-cyan-neon/10 px-3 py-1 text-[11px] text-cyan-neon">
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-3 pt-5">
          <NeonButton
            as="a"
            href={`https://${bot.handle}`}
            target="_blank"
            rel="noreferrer"
            magnetic={false}
            className="flex-1 text-center !px-3"
          >
            Launch
          </NeonButton>
          <NeonButton
            variant="purple"
            magnetic={false}
            onClick={() => openBotDemo(bot.id)}
            className="flex-1 !px-3"
          >
            Interactive Demo
          </NeonButton>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
