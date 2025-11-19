import type { Project } from './types'
import { WebProjectCard } from './WebProjectCard'
import { MobileProjectCard } from './MobileProjectCard'
import { cn } from '@/lib/utils'

interface ProjectGridProps {
  projects: Project[]
  registerItem?: (element: HTMLElement | null) => void
  className?: string
  variant: 'web' | 'mobile'
}

export function ProjectGrid({ projects, registerItem, className, variant }: ProjectGridProps) {
  if (projects.length === 0) return null

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
