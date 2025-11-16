import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { InterestItem } from './components/interest'
import AboutMe from './components/about-me'
import Contact from './components/contact'
import SkillsItems from './components/skills'
import { useSequentialReveal } from '@/hooks/useSequentialReveal'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Spotlight, SpotLightItem } from '@/components/spotlight'

export function AboutSection() {
  const { theme } = useTheme()
  const { containerRef, registerItem } = useSequentialReveal({
    delay: 0,
    threshold: 0.25,
    replay: true,
  })

  return (
    <section id="about-me" className="section-wrapper" ref={containerRef}>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="relative mx-auto p-2 lg:mx-0">
          <Spotlight
            ProximitySpotlight={true}
            CursorFlowGradient={true}
            HoverFocusSpotlight={true}
            className="z-101 !m-0 inline-block h-40 w-40 sm:h-48 sm:w-48 lg:h-full lg:w-80"
          >
            <SpotLightItem className="!m-0 block h-full w-full rounded-lg !p-0">
              <Avatar className="h-full w-full rounded-lg shadow-lg" ref={registerItem}>
                <AvatarImage
                  src="/images/profile-picture.avif"
                  alt="Archie Albarico profile picture"
                  className={cn('object-cover transition-colors duration-300', theme === 'dark' ? 'grayscale-30' : '')}
                  loading="eager"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">AA</AvatarFallback>
              </Avatar>
            </SpotLightItem>
          </Spotlight>
          <div className="glass absolute inset-0 z-100 rounded-xl bg-white/10"></div>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <AboutMe />
          <InterestItem />
          <Contact />
        </div>
      </div>

      <Separator className="my-10 sm:my-12" />
      <SkillsItems />
    </section>
  )
}
