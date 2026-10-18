import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import GlassPanel from "../ui/GlassPanel";
import StarRating from "../ui/StarRating";
import { testimonials } from "../../data/testimonials";

const AUTOPLAY_MS = 6000;

export default function TestimonialsShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next) => {
      setDirection(next > index || (index === testimonials.length - 1 && next === 0) ? 1 : -1);
      setIndex(next);
    },
    [index]
  );

  const goNext = useCallback(() => goTo((index + 1) % testimonials.length), [goTo, index]);
  const goPrev = useCallback(() => goTo((index - 1 + testimonials.length) % testimonials.length), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [goNext, paused]);

  const current = testimonials[index];

  return (
    <section id="testimonials" className="section-container">
      <SectionHeading
        eyebrow="Client Feedback"
        title="What Clients Say"
        description="Real feedback from the teams behind the bots and web apps above."
      />

      <div
        className="relative mx-auto max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <GlassPanel glow={current.glow} className="p-8 md:p-10">
                <Quote className="mb-4 text-cyan-neon/40" size={32} />
                <p className="text-lg leading-relaxed text-slate-200 md:text-xl">"{current.quote}"</p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading font-bold text-white">{current.name}</p>
                    <p className="text-sm text-slate-500">
                      {current.role} · {current.company}
                    </p>
                  </div>
                  <StarRating rating={current.rating} />
                </div>
              </GlassPanel>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="rounded-full border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-neon hover:text-cyan-neon"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-cyan-neon shadow-neon-cyan" : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="rounded-full border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-neon hover:text-cyan-neon"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
