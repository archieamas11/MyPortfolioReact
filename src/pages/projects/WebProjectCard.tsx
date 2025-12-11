import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from './types'
import ProjectFooter from './components/footer'

interface WebProjectCardProps {
  project: Project
  registerItem?: (element: HTMLElement | null) => void
}

export function WebProjectCard({ project, registerItem }: WebProjectCardProps) {
  return (
    <Card className="glass-effect from-accent/4 flex h-full flex-col bg-gradient-to-t to-transparent transition-all hover:scale-[1.02]">
      <CardHeader>
        <CardTitle className="flex flex-col-reverse justify-between gap-4 xl:flex-row">
          <span className="text-foreground text-2xl font-bold tracking-tight lg:text-xl">
            {project.title}
          </span>
          <div className="flex gap-2">
            {project.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="secondary" className="bg-white/10 transition-colors hover:bg-white/20">
                {t}
              </Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-4">
        <CardDescription className="text-justify leading-relaxed">{project.description}</CardDescription>
        <div className="mt-auto overflow-hidden rounded-md border">
          <img
            ref={registerItem}
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-48 w-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-2">
        <ProjectFooter project={project} />
      </CardFooter>
    </Card>
  )
}
