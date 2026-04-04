import { useMemo } from "react";
import { useSequentialReveal } from "@/hooks/use-sequential-reveal";
import { projects } from "./constants";
import { ProjectGrid } from "./project-grid";

export function ProjectsSection() {
  const { containerRef, registerItem } = useSequentialReveal({
    delay: 0,
    threshold: 0.25,
    replay: true,
  });

  const webProjects = useMemo(
    () => projects.filter((p) => p.platform === "web"),
    []
  );
  const mobileProjects = useMemo(
    () => projects.filter((p) => p.platform === "mobile"),
    []
  );

  return (
    <section className="section-wrapper" id="projects">
      <div className="mb-10">
        <h2 className="text-right font-bold font-oswald text-3xl tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">
          FEATURED WORK
        </h2>
        <p className="mt-2 text-right text-muted-foreground">
          Some things I’ve built lately.
        </p>
      </div>

      <div className="space-y-6" ref={containerRef}>
        <ProjectGrid
          className="lg:grid-cols-3"
          projects={webProjects}
          registerItem={registerItem}
          variant="web"
        />

        <ProjectGrid
          className="lg:grid-cols-2"
          projects={mobileProjects}
          registerItem={registerItem}
          variant="mobile"
        />
      </div>
    </section>
  );
}
