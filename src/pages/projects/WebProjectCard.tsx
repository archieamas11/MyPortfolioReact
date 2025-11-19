import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, Globe } from 'lucide-react'
import type { Project } from './types'

interface WebProjectCardProps {
  project: Project
  registerItem?: (element: HTMLElement | null) => void
}

export function WebProjectCard({ project, registerItem }: WebProjectCardProps) {
  return (
    <Card className="glass-effect flex h-full flex-col transition-all hover:scale-[1.02]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold">{project.title}</span>
          <div className="flex gap-2">
            {project.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-4">
        <CardDescription className="text-justify leading-relaxed">{project.description}</CardDescription>
        <div className="mt-auto overflow-hidden rounded-md">
          <img ref={registerItem} src={project.image} alt={project.title} loading="lazy" className="h-48 w-full object-cover" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {project.website && (
          <Button asChild variant="glass" size="sm">
            <a href={project.website} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              Website
            </a>
          </Button>
        )}
        {project.link && (
          <Button asChild variant="glass" size="sm">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Source
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
