import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "../cards/ProjectCard";
import { webProjects } from "../../data/webProjects";

export default function WebProjectsShowcase() {
  return (
    <section id="projects" className="section-container pt-16 md:pt-20">
      <SectionHeading
        eyebrow="Portfolio"
        title="Selected Work"
        description="Interactive interfaces engineered for motion, clarity, and product-grade detail."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {webProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
