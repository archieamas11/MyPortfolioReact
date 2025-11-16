import { interests } from '@/pages/about/constants'
import { InterestTooltip } from './interest-tooltip'
import { useSequentialReveal } from '@/hooks/useSequentialReveal'

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
            <InterestTooltip label={interest.label} icon={interest.icon} />
          </div>
        ))}
      </div>
    </div>
  )
}
