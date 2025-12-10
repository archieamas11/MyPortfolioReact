import { cn } from '@/lib/utils'
import { skillsArr } from '../constants'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

function SkillsItems() {
  const isMobile = useIsMobile()

  return (
    <div className="space-y-8">
      <motion.div
        className="space-y-2"
        initial={{ x: isMobile ? 0 : -50, opacity: 0, filter: 'blur(8px)' }}
        whileInView={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">
          SKILLS
        </h1>
        <p className="text-muted-foreground">My technical skills and proficiency levels</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4 py-2 lg:grid-cols-7 lg:gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {skillsArr.map((skill) => {
          const Icon = skill.icon
          const levelVariants = {
            advanced: {
              border: 'border-green-500/30 hover:border-green-500/60',
              shadow: 'hover:shadow-lg hover:shadow-green-500/20 hover:ring-1 hover:ring-green-500/30',
              gradient: 'hover:from-green-500/10 hover:to-green-500/5',
              badge: 'bg-green-500/80 text-white',
              progress: 'bg-green-500',
            },
            intermediate: {
              border: 'border-yellow-500/30 hover:border-yellow-500/60',
              shadow: 'hover:shadow-lg hover:shadow-yellow-500/20 hover:ring-1 hover:ring-yellow-500/30',
              gradient: 'hover:from-yellow-500/10 hover:to-yellow-500/5',
              badge: 'bg-yellow-500/80 text-gray-900',
              progress: 'bg-yellow-500',
            },
            beginner: {
              border: 'border-red-500/30 hover:border-red-500/60',
              shadow: 'hover:shadow-lg hover:shadow-red-500/20 hover:ring-1 hover:ring-red-500/30',
              gradient: 'hover:from-red-500/10 hover:to-red-500/5',
              badge: 'bg-red-500/80 text-white',
              progress: 'bg-red-500',
            },
          }[skill.level]

          return (
            <motion.div
              key={skill.label}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                'group glass-effect relative flex min-h-[180px] cursor-pointer flex-col items-center overflow-hidden rounded-lg border p-6 transition-all duration-300',
                'hover:bg-gradient-to-b',
                levelVariants.border,
                levelVariants.shadow,
                levelVariants.gradient,
              )}
            >
              <div className="via-primary/10 absolute inset-0 -left-full -z-10 bg-gradient-to-r from-transparent to-transparent transition-[left] duration-500 group-hover:left-full" />

              <div
                className={cn(
                  'absolute top-2 right-2 z-10 rounded-sm px-2 py-1 text-[0.6rem] font-bold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                  {
                    'bg-green-500/80 text-white': skill.level === 'advanced',
                    'bg-yellow-500/80 text-gray-900': skill.level === 'intermediate',
                    'bg-red-500/80 text-white': skill.level === 'beginner',
                  },
                )}
              >
                {skill.level}
              </div>

              <div className="mb-3 transition-transform duration-100 group-hover:scale-110">
                <Icon size="40" />
              </div>

              <div className="flex w-full flex-col items-center gap-1 text-center">
                <h6 className="group-hover:text-primary mb-2.5 text-base leading-tight font-semibold transition-colors duration-300">
                  {skill.label}
                </h6>
                {skill.experience && (
                  <span className="bg-primary/10 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap">
                    {skill.experience}+ {skill.experience < 2 ? 'Year' : 'Years'}
                  </span>
                )}
              </div>

              <div className="bg-primary/10 mt-4 h-1 w-full overflow-hidden rounded-full">
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
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
export default SkillsItems
