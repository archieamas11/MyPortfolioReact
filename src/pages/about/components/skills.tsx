import { cn } from '@/lib/utils'
import { skillsArr } from '../constants'
import { motion } from 'framer-motion'
import { useSequentialReveal } from '@/hooks/useSequentialReveal'
// import { Badge } from '@/components/ui/badge'

function SkillsItems() {
  const { containerRef, registerItem } = useSequentialReveal({
    delay: 0,
    threshold: 0.25,
    replay: true,
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">
          SKILLS
        </h2>
        <p className="text-muted-foreground">Tools and technologies I work with</p>
      </div>

      <motion.div className="grid grid-cols-2 gap-4 py-2 lg:grid-cols-7 lg:gap-6" ref={containerRef}>
        {skillsArr.map((skill) => {
          const Icon = skill.icon
          // const levelVariants = {
          //   advanced: {
          //     border: 'border-green-500/30 hover:border-green-500/60',
          //     shadow: 'hover:shadow-lg hover:shadow-green-500/20 hover:ring-1 hover:ring-green-500/30',
          //     gradient: 'hover:from-green-500/10 hover:to-green-500/5',
          //     badge: 'bg-green-600 text-white',
          //     progress: 'bg-green-600',
          //   },
          //   intermediate: {
          //     border: 'border-yellow-500/30 hover:border-yellow-500/60',
          //     shadow: 'hover:shadow-lg hover:shadow-yellow-500/20 hover:ring-1 hover:ring-yellow-500/30',
          //     gradient: 'hover:from-yellow-500/10 hover:to-yellow-500/5',
          //     badge: 'bg-yellow-500 text-gray-950',
          //     progress: 'bg-yellow-500',
          //   },
          //   beginner: {
          //     border: 'border-red-500/30 hover:border-red-500/60',
          //     shadow: 'hover:shadow-lg hover:shadow-red-500/20 hover:ring-1 hover:ring-red-500/30',
          //     gradient: 'hover:from-red-500/10 hover:to-red-500/5',
          //     badge: 'bg-red-600 text-white',
          //     progress: 'bg-red-600',
          //   },
          // }[skill.level]

          return (
            <div
              key={skill.label}
              ref={registerItem}
              className={cn(
                'group glass-effect relative flex flex-col items-center overflow-hidden rounded-lg border py-8 transition-all duration-300',
                'hover:bg-linear-to-b',
                // levelVariants.border,
                // levelVariants.shadow,
                // levelVariants.gradient,
              )}
            >
              {/* <div className="via-primary/10 absolute inset-0 -left-full -z-10 bg-gradient-to-r from-transparent to-transparent transition-[left] duration-500 group-hover:left-full" /> */}

              {/* <div
                className={cn(
                  'absolute top-2 right-2 z-10 rounded-sm px-2 py-1 text-[0.6rem] font-bold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                  {
                    'bg-green-600 text-white': skill.level === 'advanced',
                    'bg-yellow-500 text-gray-950': skill.level === 'intermediate',
                    'bg-red-600 text-white': skill.level === 'beginner',
                  },
                )}
              >
                {skill.level}
              </div> */}

              <div className="mb-3">
                <Icon size="50" />
              </div>

              <div className="flex w-full flex-col items-center gap-1 text-center">
                <p className="group-hover:text-primary text-base leading-tight font-semibold transition-colors duration-300">
                  {skill.label}
                </p>
                {/* {skill.experience && (
                  <Badge
                    className={cn('text-primary', {
                      'border-green-600 bg-green-500/20': skill.level === 'advanced',
                      'border-yellow-500 bg-yellow-500/20': skill.level === 'intermediate',
                      'border-red-600 bg-red-500/20': skill.level === 'beginner',
                    })}
                  >
                    {skill.experience}+ {skill.experience < 2 ? 'Year' : 'Years'}
                  </Badge>
                )} */}
              </div>

              {/* <div className="bg-primary/10 mt-4 h-1 w-full overflow-hidden rounded-full">
                <div
                  style={{ width: skill.progressWidth }}
                  className={cn(
                    'relative h-full overflow-hidden rounded-full transition-[width] duration-1000',
                    levelVariants.progress,
                    // Shimmer always visible, animation ONLY on hover
                    'after:absolute after:inset-0 after:w-full after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:opacity-100',
                    'group-hover:after:animate-shimmer',
                  )}
                />
              </div> */}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
export default SkillsItems
