import TerminalContact from "../terminal/TerminalContact";
import { SITE, SOCIAL_LINKS } from "../../lib/constants";

export default function Footer() {
  return (
    <footer id="terminal" className="border-t border-cyan-neon/10 py-16">
      <div className="section-container flex flex-col items-center gap-8 !py-0 text-center">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-cyan-neon">
            // Direct CLI Interface
          </p>
          <p className="font-display text-2xl font-bold text-white">CYBER TERMINAL</p>
          <p className="mt-2 text-xs text-slate-500">
            try: <span className="text-emerald-neon">help</span>,{" "}
            <span className="text-emerald-neon">contact</span>,{" "}
            <span className="text-emerald-neon">skills</span>,{" "}
            <span className="text-emerald-neon">status</span>,{" "}
            <span className="text-emerald-neon">clear</span>
          </p>
        </div>

        <TerminalContact />

        <div className="flex flex-wrap justify-center gap-5 pt-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-slate-400 transition-all hover:text-cyan-neon hover:drop-shadow-[0_0_6px_#00f3ff]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="font-heading text-xs uppercase tracking-widest text-slate-600">
          {SITE.name} · {SITE.robotName} Cyber Domain © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
