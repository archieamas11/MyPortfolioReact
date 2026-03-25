import { Button } from '@/components/ui/button'
import { Github, Globe } from 'lucide-react'
import type { Project } from '../types'
import { cn } from '@/lib/utils'

interface ProjectFooterProps {
  project: Project
  fullWidth?: boolean
}

export default function ProjectFooter({ project, fullWidth = false }: ProjectFooterProps) {
  return (
    <div className={cn('flex gap-2', fullWidth ? 'w-full' : '')}>
      {project.website && (
        <Button asChild variant="glass" size="sm" className={cn(fullWidth ? 'flex-1' : '')}>
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} website in a new tab`}
          >
            <Globe className="mr-1 h-4 w-4" />
            Website
          </a>
        </Button>
      )}
      {project.link && (
        <Button asChild variant="glass" size="sm" className={cn(fullWidth ? 'flex-1' : '')}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} source code on GitHub`}
          >
            <Github className="mr-1 h-4 w-4" />
            Source
          </a>
        </Button>
      )}
    </div>
  )
}
