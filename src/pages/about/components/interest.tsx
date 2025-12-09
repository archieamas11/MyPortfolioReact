import { interests } from '@/pages/about/constants'
import { useSequentialReveal } from '@/hooks/useSequentialReveal'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'

export function InterestItem() {
  const { containerRef, registerItem } = useSequentialReveal({
    delay: 10,
    threshold: 0.25,
    replay: true,
  })

  return (
    <div className="col-span-1 w-full space-y-6 lg:space-y-9 lg:text-center" ref={containerRef}>
      <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">INTEREST</h1>
      <div className="grid grid-cols-3 gap-3">
        {interests.map((interest) => (
          <div key={interest.id} ref={registerItem}>
            <AnimatedTooltip
              label={interest.label}
              className="bg-card hover:border-primary/20 glass-effect overflow-hidden rounded-lg p-2 text-center shadow-sm transition-all duration-200 hover:bg-white/10 hover:shadow-md sm:p-3"
            >
              <div className="flex flex-col items-center gap-2 py-2 sm:gap-3 lg:py-0">
                <div className="text-primary flex h-8 w-8 items-center justify-center rounded-md transition-colors sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <interest.icon size={20} className="sm:h-6 sm:w-6" />
                </div>
                <span className="text-muted-foreground not-sr-only text-xs font-medium lg:sr-only">{interest.label}</span>
              </div>
            </AnimatedTooltip>
          </div>
        ))}
      </div>
    </div>
  )
}
