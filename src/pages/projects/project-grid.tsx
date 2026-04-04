import { cn } from '@/lib/utils'
import { MobileProjectCard } from './mobile-project-card'
import type { Project } from './types'
import { WebProjectCard } from './web-project-card'

interface ProjectGridProps {
  className?: string
  projects: Project[]
  registerItem?: (element: HTMLElement | null) => void
  variant: 'web' | 'mobile'
}

export function ProjectGrid({ projects, registerItem, className, variant }: ProjectGridProps) {
  if (projects.length === 0) {
    return null
  }

  const CardComponent = variant === 'web' ? WebProjectCard : MobileProjectCard

  return (
    <div className="space-y-6">
      <div className={cn('grid grid-cols-1 gap-6', className)}>
        {projects.map((p) => (
          <CardComponent key={p.title} project={p} registerItem={registerItem} />
        ))}
      </div>
    </div>
  )
}
