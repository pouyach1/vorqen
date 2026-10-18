import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

function AIResponsePanel({ chapter, phase, reducedMotion }) {
  const showBody = phase === "response" || phase === "ready";
  const processing = phase === "processing";

  return (
    <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl border border-purple-neon/25 bg-[#080612]/90">
      <div className="flex items-center justify-between border-b border-purple-neon/15 px-4 py-2.5">
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-purple-neon">
          {chapter.responseTitle}
        </p>
        <span
          className={`font-mono text-[10px] uppercase tracking-widest ${
            chapter.meta?.status === "DEMO_FLAGGED" ? "text-amber-400/90" : "text-emerald-neon/80"
          }`}
        >
          {chapter.meta?.status ?? "OK"}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Query: {chapter.meta?.query}
        </p>

        <AnimatePresence mode="wait">
          {processing && (
            <motion.p
              key="processing"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-sm text-cyan-neon"
            >
              Processing
              {!reducedMotion && <span className="animate-pulse">…</span>}
            </motion.p>
          )}

          {showBody && (
            <motion.div
              key={chapter.id}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-3"
            >
              {chapter.response.map((line, i) => (
                <p
                  key={`${chapter.id}-r${i}`}
                  className={
                    line === ""
                      ? "h-2"
                      : line.startsWith("[") || line.startsWith("•") || line.startsWith("LIVE") || line.startsWith("SHOWCASE") || line.startsWith("CURRENT") || line.startsWith("NEXT")
                        ? "font-mono text-xs leading-relaxed text-slate-400"
                        : "font-heading text-sm leading-relaxed text-slate-200 md:text-base"
                  }
                >
                  {line}
                </p>
              ))}

              {chapter.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-cyan-neon/20 bg-cyan-neon/5 px-2 py-1 font-mono text-[10px] text-cyan-neon"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(AIResponsePanel);
