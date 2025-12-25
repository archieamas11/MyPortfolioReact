import { useState } from 'react'
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface AnimatedTooltipProps {
  label: string
  value?: string
  children: React.ReactNode
  className?: string
}

export function AnimatedTooltip({ label, value, children, className }: AnimatedTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useIsMobile()
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth)
  }

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="popLayout">
        {isHovered && !isMobile && (
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
            <div className="text-background relative z-30 text-base font-bold">{label}</div>
            {value && <div className="text-background relative z-30 text-sm">{value}</div>}
            <div className="border-t-foreground absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 translate-y-full transform border-t-4 border-r-4 border-l-4 border-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div onMouseMove={handleMouseMove} className={cn(isHovered && 'z-30', className)}>
        {children}
      </div>
    </div>
  )
}
