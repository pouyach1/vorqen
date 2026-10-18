import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import TechIcon from "../cards/TechIcon";
import { techCategories, techStack } from "../../data/techStack";

export default function TechStackMatrix() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...techCategories];

  const visibleTech =
    activeCategory === "All"
      ? techStack
      : techStack.filter((tech) => tech.category === activeCategory);

  return (
    <section id="stack" className="section-container">
      <SectionHeading
        eyebrow="Holographic Matrix"
        title="Interactive Tech Stack"
        description="Hover any node for proficiency and years of experience."
      />

      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 font-heading text-xs uppercase tracking-widest transition-colors
              ${
                activeCategory === category
                  ? "border-cyan-neon bg-cyan-neon/10 text-cyan-neon"
                  : "border-slate-700 text-slate-400 hover:border-cyan-neon/50 hover:text-cyan-neon"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {visibleTech.map((tech) => (
          <TechIcon key={tech.name} tech={tech} />
        ))}
      </div>
    </section>
  );
}
