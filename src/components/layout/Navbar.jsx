import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";
import NeonButton from "../ui/NeonButton";
import { NAV_LINKS, SITE } from "../../lib/constants";
import { EASE, DURATION } from "../../lib/motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE.cinematic }}
      className="fixed inset-x-0 top-4 z-50 mx-auto w-[92%] max-w-7xl"
    >
      <GlassPanel
        className={`flex items-center justify-between px-5 py-3 transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled ? "border-cyan-neon/35 bg-void/80 shadow-neon-cyan backdrop-blur-xl" : ""
        }`}
      >
        <a
          href="#home"
          className="group flex items-center gap-3 font-display text-lg font-bold tracking-widest"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-neon to-purple-neon font-display text-lg font-black text-void shadow-neon-cyan transition-transform duration-300 group-hover:scale-105">
            {SITE.robotName.charAt(0)}
          </span>
          <span className="bg-gradient-to-r from-cyan-neon to-purple-neon bg-clip-text text-transparent">
            {SITE.robotName}
          </span>
          <span className="text-slate-500">.dev</span>
        </a>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </nav>

        <NeonButton as="a" href="#bots" className="hidden xl:inline-flex">
          Hire Me
        </NeonButton>

        <button
          className="text-2xl text-cyan-neon transition-transform duration-300 hover:scale-110 xl:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
      </GlassPanel>

      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE.out }}
        >
          <GlassPanel className="mt-2 flex flex-col gap-4 p-5 xl:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-heading text-sm uppercase tracking-wider text-slate-300 transition-colors hover:text-cyan-neon"
              >
                {link.label}
              </a>
            ))}
            <NeonButton as="a" href="#bots" onClick={() => setOpen(false)}>
              Hire Me
            </NeonButton>
          </GlassPanel>
        </motion.div>
      )}
    </motion.header>
  );
}
