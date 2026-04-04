import { Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "../types";

interface ProjectFooterProps {
  fullWidth?: boolean;
  project: Project;
}

export default function ProjectFooter({
  project,
  fullWidth = false,
}: ProjectFooterProps) {
  return (
    <div className={cn("flex gap-2", fullWidth ? "w-full" : "")}>
      {project.website && (
        <Button
          asChild
          className={cn(fullWidth ? "flex-1" : "")}
          size="sm"
          variant="glass"
        >
          <a
            aria-label={`Open ${project.title} website in a new tab`}
            href={project.website}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Globe className="mr-1 h-4 w-4" />
            Website
          </a>
        </Button>
      )}
      {project.link && (
        <Button
          asChild
          className={cn(fullWidth ? "flex-1" : "")}
          size="sm"
          variant="glass"
        >
          <a
            aria-label={`View ${project.title} source code on GitHub`}
            href={project.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github className="mr-1 h-4 w-4" />
            Source
          </a>
        </Button>
      )}
    </div>
  );
}
