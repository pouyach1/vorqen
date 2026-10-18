import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import GlassPanel from "../ui/GlassPanel";
import NeonButton from "../ui/NeonButton";

const INITIAL_MESSAGES = [
  { from: "bot", text: `Hey! I'm Kuro. Drop a message and I'll relay it straight to my creator.` },
];

export default function ContactTerminal() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: "Message received. I'll get back to you within 24 hours ⚡" },
    ]);
    setDraft("");
  }

  return (
    <section id="contact" className="section-container">
      <SectionHeading
        eyebrow="Say Hello"
        title="Contact & Live Bot Simulator"
        description="Test-drive a Telegram-style conversation right on this page."
      />

      <GlassPanel glow="purple" className="mx-auto max-w-xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-purple-neon/20 px-5 py-4">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-neon" />
          <p className="font-heading text-sm uppercase tracking-widest text-slate-300">
            Kuro // live chat
          </p>
        </div>

        <div className="flex h-72 flex-col gap-3 overflow-y-auto p-5">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                message.from === "bot"
                  ? "self-start bg-cyan-neon/10 text-cyan-100"
                  : "self-end bg-purple-neon/20 text-purple-100"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-3 border-t border-purple-neon/20 p-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-slate-700 bg-void/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-neon focus:outline-none"
          />
          <NeonButton type="submit" variant="cyan" magnetic={false}>
            Send
          </NeonButton>
        </form>
      </GlassPanel>
    </section>
  );
}
