import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from './types'
import { Iphone } from '@/components/ui/iphone'
import ProjectFooter from './components/footer'

interface MobileProjectCardProps {
  project: Project
  registerItem?: (element: HTMLElement | null) => void
}

export function MobileProjectCard({ project, registerItem }: MobileProjectCardProps) {
  return (
    <Card className="glass-effect group relative h-full overflow-hidden border-white/10 p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardContent className="h-full p-0">
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div
            ref={registerItem}
            className="from-accent/5 relative flex items-center justify-center bg-gradient-to-br to-transparent p-8"
          >
            <div className="relative w-full max-w-[200px] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[-2deg]">
              <Iphone src={project.image} />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="bg-white/10 transition-colors hover:bg-white/20"
                  >
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-foreground text-2xl font-bold tracking-tight">{project.title}</h3>
                <p className="text-muted-foreground text-justify text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
              <ProjectFooter project={project} fullWidth />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
