import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GlassEdgeReflect } from "@/components/ui/glass-edge-reflect/glass-edge-reflect";
import { Iphone } from "@/components/ui/iphone";
import ProjectFooter from "./components/footer";
import type { Project } from "./types";

interface MobileProjectCardProps {
  project: Project;
  registerItem?: (element: HTMLElement | null) => void;
}

export function MobileProjectCard({
  project,
  registerItem,
}: MobileProjectCardProps) {
  return (
    <GlassEdgeReflect asChild className="h-full">
      <Card className="glass-effect group relative h-full overflow-hidden border-white/10 p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <CardContent className="h-full p-0">
          <div className="grid h-full grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div
              className="relative flex items-center justify-center bg-linear-to-br from-primary/10 to-transparent p-8"
              ref={registerItem}
            >
              <div className="relative w-full max-w-50 transition-transform duration-500 ease-out group-hover:rotate-2 group-hover:scale-105">
                <Iphone alt={project.title} src={project.image} />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-2xl text-foreground tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-justify text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-white/10 border-t pt-4">
                <ProjectFooter fullWidth project={project} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </GlassEdgeReflect>
  );
}
