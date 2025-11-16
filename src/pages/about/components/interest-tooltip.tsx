import { useState } from 'react'
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface InterestTooltipProps {
  label: string
  icon: LucideIcon
  children?: React.ReactNode
}

export function InterestTooltip({ label, icon: Icon, children }: InterestTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth)
  }

  return (
    <div className="group relative cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence mode="popLayout">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: 'nowrap',
            }}
            className="bg-foreground absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md px-4 py-2 text-xs shadow-xl"
          >
            <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
            <div className="text-background relative z-30 text-base font-bold">{label}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onMouseMove={handleMouseMove}
        className={cn(
          'bg-card hover:border-primary/20 overflow-hidden rounded-lg border p-2 text-center shadow-sm transition-all duration-200 hover:bg-white/10 hover:shadow-md sm:p-3',
          isHovered && 'z-30 scale-105',
        )}
      >
        {children || (
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-primary flex h-8 w-8 items-center justify-center rounded-md transition-colors sm:h-10 sm:w-10 lg:h-12 lg:w-12">
              <Icon size={20} className="sm:h-6 sm:w-6" />
            </div>
            <span className="sr-only text-xs font-medium">{label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
