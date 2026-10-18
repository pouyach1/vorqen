import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalShell from "./ModalShell";
import { useAppStore } from "../../store/useAppStore";
import { telegramBots } from "../../data/telegramBots";

export default function BotSimulatorModal() {
  const activeBotId = useAppStore((s) => s.activeBotId);
  const closeBotDemo = useAppStore((s) => s.closeBotDemo);
  const bot = telegramBots.find((b) => b.id === activeBotId);

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!bot) return <ModalShell open={false} onClose={closeBotDemo} />;

  function runCommand(command) {
    setMessages((prev) => [...prev, { from: "user", text: command.cmd }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: command.reply }]);
    }, 700);
  }

  function handleClose() {
    closeBotDemo();
    setTimeout(() => {
      setMessages([]);
      setShowCode(false);
    }, 300);
  }

  return (
    <ModalShell open={!!activeBotId} onClose={handleClose} glow={bot.avatarGlow} wide>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between pr-10">
          <div>
            <p className="font-heading text-xs uppercase tracking-widest text-slate-400">
              Interactive Demo
            </p>
            <h3 className="font-display text-xl font-bold text-white">{bot.name}</h3>
          </div>
          <button
            onClick={() => setShowCode((v) => !v)}
            className="rounded-full border border-slate-600 px-4 py-2 font-heading text-xs uppercase tracking-widest text-slate-300 hover:border-cyan-neon hover:text-cyan-neon"
          >
            {showCode ? "Hide Code" : "View Live Code Snippet"}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Telegram-style chat frame */}
          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0e1621]">
            <div className="flex items-center gap-2 border-b border-slate-700 bg-[#17212b] px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-emerald-neon" />
              <p className="font-heading text-sm text-slate-200">{bot.name}</p>
            </div>

            <div className="flex h-72 flex-col gap-2 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="m-auto text-center text-xs text-slate-500">
                  Tap a command below to start the conversation
                </p>
              )}
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    message.from === "bot"
                      ? "self-start bg-[#182533] text-slate-100"
                      : "self-end bg-[#2b5278] text-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="self-start rounded-2xl bg-[#182533] px-3 py-2 text-sm text-slate-400"
                  >
                    typing…
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-700 p-3">
              {bot.commands.map((command) => (
                <button
                  key={command.cmd}
                  onClick={() => runCommand(command)}
                  className="rounded-full border border-cyan-neon/30 px-3 py-1.5 font-mono text-xs text-cyan-neon hover:bg-cyan-neon/10"
                >
                  {command.cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Code snippet / metrics panel */}
          <div>
            {showCode ? (
              <pre className="h-72 overflow-auto rounded-2xl border border-slate-700 bg-[#0b0f19] p-4 text-xs text-emerald-neon">
                <code>{bot.codeSnippet}</code>
              </pre>
            ) : (
              <div className="grid h-72 grid-cols-1 gap-4 rounded-2xl border border-slate-700 p-4 sm:grid-cols-3">
                {Object.entries(bot.metrics).map(([key, value]) => (
                  <div key={key} className="flex flex-col justify-center rounded-xl bg-void/40 p-4 text-center">
                    <p className="font-display text-2xl font-black text-cyan-neon">{value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                  </div>
                ))}
                <div className="col-span-full text-sm text-slate-400">{bot.description}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
