import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function CodeEditor({ chapter, isTyping, typedLength }) {
  const reducedMotion = usePrefersReducedMotion();
  const code = chapter.code;
  const visible = useMemo(() => {
    if (reducedMotion || !isTyping) return code;
    return code.slice(0, typedLength);
  }, [code, isTyping, typedLength, reducedMotion]);

  const lines = visible.split("\n");

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-cyan-neon/20 bg-[#050b14]/90">
      <div className="flex items-center gap-2 border-b border-cyan-neon/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-magenta-neon/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-purple-neon/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-neon/70" />
        <span className="ml-3 truncate font-mono text-[10px] text-slate-500">
          {ABOUT_CREATOR.filePath}
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-cyan-neon/60">
          {chapter.title}
        </span>
      </div>

      <div className="border-b border-cyan-neon/10 px-4 py-2">
        <p className="font-mono text-xs text-emerald-neon">{chapter.prompt}</p>
      </div>

      <div className="relative flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-300 md:text-xs">
        <pre className="whitespace-pre-wrap">
          {lines.map((line, i) => (
            <div key={`${chapter.id}-L${i}`} className="flex gap-3">
              <span className="w-6 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
              <span>
                {highlightLine(line)}
                {i === lines.length - 1 && isTyping && !reducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan-neon align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                  />
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function highlightLine(line) {
  if (!line) return "\u00A0";
  // Lightweight token tint — keeps DOM small, no heavy highlighter.
  if (line.trimStart().startsWith("//")) {
    return <span className="text-slate-500">{line}</span>;
  }
  if (line.includes("const ") || line.includes("function ") || line.includes("export ") || line.includes("await ")) {
    return line.split(/(\bconst\b|\bfunction\b|\bexport\b|\bawait\b|\bdefault\b|\breturn\b)/g).map((part, i) =>
      /^(const|function|export|await|default|return)$/.test(part) ? (
        <span key={i} className="text-purple-neon">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }
  if (line.includes('"')) {
    return line.split(/("[^"]*")/g).map((part, i) =>
      part.startsWith('"') ? (
        <span key={i} className="text-emerald-neon">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }
  return line;
}

export default memo(CodeEditor);
export { usePrefersReducedMotion };
