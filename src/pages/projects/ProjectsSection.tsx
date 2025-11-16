import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Github, Globe } from 'lucide-react'
import { useSequentialReveal } from '@/hooks/useSequentialReveal'
import { projects } from './constants'

export function ProjectsSection() {
  const { containerRef, registerItem } = useSequentialReveal({
    delay: 0,
    threshold: 0.25,
    replay: true,
  })

  return (
    <section id="projects" className="section-wrapper">
      <motion.div
        className="mb-10"
        initial={{ x: -800, opacity: 0, filter: 'blur(8px)' }}
        whileInView={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h1 className="font-oswald text-right text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">FEATURED WORK</h1>
        <p className="text-muted-foreground mt-2 text-right">Some things I’ve built lately.</p>
      </motion.div>

      <div ref={containerRef} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.title} className="glass-effect flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {p.title}
                <div className="flex gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col space-y-4">
              <CardDescription className="text-justify">{p.description}</CardDescription>
              <div className="mt-auto cursor-pointer">
                <img ref={registerItem} src={p.image} alt={p.title} loading="lazy" className="h-48 w-full rounded-md object-cover" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {p.website && (
                <Button asChild variant="glass">
                  <a href={p.website} target="_blank" rel="noopener">
                    <Globe />
                    Website
                  </a>
                </Button>
              )}
              {p.link && (
                <Button asChild variant="glass">
                  <a href={p.link} target="_blank" rel="noopener">
                    <Github />
                    Source code
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
