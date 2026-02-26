import { useSequentialReveal } from '@/hooks/useSequentialReveal'
import { projects } from './constants'
import { ProjectGrid } from './ProjectGrid'
import { useMemo } from 'react'

export function ProjectsSection() {
  const { containerRef, registerItem } = useSequentialReveal({
    delay: 0,
    threshold: 0.25,
    replay: true,
  })

  const webProjects = useMemo(() => projects.filter((p) => p.platform === 'web'), [])
  const mobileProjects = useMemo(() => projects.filter((p) => p.platform === 'mobile'), [])

  return (
    <section id="projects" className="section-wrapper">
      <div className="mb-10">
        <h2 className="font-oswald text-right text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">
          FEATURED WORK
        </h2>
        <p className="text-muted-foreground mt-2 text-right">Some things I’ve built lately.</p>
      </div>

      <div ref={containerRef} className="space-y-6">
        <ProjectGrid
          projects={webProjects}
          registerItem={registerItem}
          className="lg:grid-cols-3"
          variant="web"
        />

        <ProjectGrid
          projects={mobileProjects}
          registerItem={registerItem}
          className="lg:grid-cols-2"
          variant="mobile"
        />
      </div>
    </section>
  )
}