import { motion } from 'framer-motion'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import Elasticity from '@/components/ui/elasticity/elasticity'
import { interests } from '../data/interests'

export function InterestItem() {
  return (
    <motion.div
      className="col-span-1 w-full space-y-6 lg:space-y-9 lg:text-center"
      initial="hidden"
      viewport={{ once: true }}
      whileInView="show"
    >
      <motion.h2
        className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        INTEREST
      </motion.h2>

      <motion.div
        className="grid grid-cols-3 gap-3"
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
      >
        {interests.map((interest) => (
          <motion.div key={interest.id}>
            <Elasticity
              className="rounded-lg"
              enabled={false}
              glassEdgeReflectProps={{ clipContent: false }}
              withGlassEdgeReflect={true}
            >
              <div className="rounded-lg">
                <AnimatedTooltip
                  className="glass-effect cursor-auto overflow-hidden rounded-lg p-2 text-center shadow-sm transition-all duration-200 hover:bg-white/10 hover:shadow-md sm:p-3"
                  label={interest.label}
                >
                  <div className="flex flex-col items-center gap-2 py-2 sm:gap-3 lg:py-0">
                    <div className="text-primary flex h-8 w-8 items-center justify-center rounded-md transition-colors sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                      <interest.icon className="sm:h-6 sm:w-6" size={20} />
                    </div>
                    <span className="text-muted-foreground not-sr-only text-xs font-medium lg:sr-only">
                      {interest.label}
                    </span>
                  </div>
                </AnimatedTooltip>
              </div>
            </Elasticity>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
