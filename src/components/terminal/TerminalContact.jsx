import { useRef, useState } from "react";
import { SITE, SOCIAL_LINKS } from "../../lib/constants";

const COMMANDS = {
  help: () => "Available commands: help, contact, skills, status, clear",
  contact: () =>
    `Reach ${SITE.name} directly:\n${SOCIAL_LINKS.map((l) => `  ${l.label}: ${l.href}`).join("\n")}`,
  skills: () =>
    "Frontend: React, Next.js, Tailwind, Three.js, Framer Motion\nBots: Python (Aiogram), Node.js (Telegraf)\nBackend: Supabase, PostgreSQL, Redis, Docker, FastAPI",
  status: () => "ALL SYSTEMS OPERATIONAL. 99.9% UPTIME.",
};

const WELCOME = [
  { type: "system", text: `SYSTEM READY. Type "help" or "contact" for quick commands.` },
];

export default function TerminalContact() {
  const [lines, setLines] = useState(WELCOME);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const command = draft.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setLines([]);
      setDraft("");
      return;
    }

    const handler = COMMANDS[command];
    const newLines = [...lines, { type: "user", text: `> ${draft}` }];
    if (handler) {
      newLines.push({ type: "system", text: handler() });
    } else {
      newLines.push({ type: "error", text: `command not recognized: "${command}" — type "help"` });
    }
    setLines(newLines);
    setDraft("");
  }

  const LINE_COLOR = {
    user: "text-cyan-neon",
    error: "text-magenta-neon",
    system: "text-emerald-neon",
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-cyan-neon/30 bg-void/90 font-mono text-xs shadow-neon-cyan"
    >
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/60 px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[11px] text-slate-500">bash — cyberdev@terminal:~</span>
      </div>

      <div className="h-40 space-y-1.5 overflow-y-auto whitespace-pre-line p-4">
        {lines.map((line, i) => (
          <p key={i} className={LINE_COLOR[line.type] ?? "text-slate-400"}>
            {line.text}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-800 bg-slate-950/60 px-4 py-3">
        <span className="font-bold text-cyan-neon">&gt;</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type 'help' or 'contact'..."
          className="flex-1 bg-transparent text-cyan-100 outline-none placeholder:text-slate-600"
          aria-label="Terminal command input"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
