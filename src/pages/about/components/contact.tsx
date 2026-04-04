import { motion } from 'framer-motion'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Elasticity } from '@/components/ui/elasticity/elasticity'
import { personalDetails } from '../data/personal-details'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Contact() {
  return (
    <motion.div
      className="col-span-1 w-full lg:col-span-2"
      initial="hidden"
      variants={container}
      viewport={{ once: true }}
      whileInView="show"
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:flex lg:grid-cols-1 lg:gap-6 [@media(max-width:360px)]:grid-cols-1">
        {personalDetails.map((detail) => {
          const Icon = detail.icon
          return (
            <motion.div key={detail.label} variants={item}>
              <Elasticity
                className="rounded-full"
                enabled={false}
                glassEdgeReflectProps={{ clipContent: false }}
                withGlassEdgeReflect={true}
              >
                <AnimatedTooltip label={detail.label} value={detail.value}>
                  {detail.href ? (
                    <a
                      className="flex w-full gap-4 py-2 lg:py-0"
                      href={detail.href}
                      rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      target={detail.href.startsWith('http') ? '_blank' : undefined}
                    >
                      <div className="glass-effect text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-center transition-colors hover:bg-white/10 hover:shadow-md">
                        <Icon size={12} />
                      </div>
                      <div className="not-sr-only text-left lg:sr-only">
                        <div className="text-foreground text-sm font-medium">{detail.label}</div>
                        <div className="text-muted-foreground text-xs sm:text-sm">{detail.value}</div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-md py-3 transition-colors lg:gap-4 lg:py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                          <Icon size={12} />
                        </div>
                        <div>
                          <div className="text-foreground sr-only text-sm font-medium">{detail.label}</div>
                          <div className="text-muted-foreground text-xs sm:text-sm">{detail.value}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatedTooltip>
              </Elasticity>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
