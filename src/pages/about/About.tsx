import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { InterestItem } from './components/interest'
import AboutMe from './components/about-me'
import Contact from './components/contact'
import SkillsItems from './components/skills'
import { useSequentialReveal } from '@/hooks/useSequentialReveal'
import { useTheme } from 'next-themes'

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
          <Avatar className="h-full w-full rounded-lg shadow-lg lg:h-full lg:w-80" ref={registerItem}>
            <AvatarImage
              src={theme === 'dark' ? 'images/me-dark.png' : 'images/me-light.jpg'}
              alt="Archie Albarico profile picture"
              className="object-cover transition-colors duration-300"
              loading="eager"
            />
            <AvatarFallback className="text-primary bg-transparent text-4xl font-bold">AA</AvatarFallback>
          </Avatar>
          <div className="glass absolute inset-0 rounded-xl bg-white/20 dark:bg-white/5"></div>
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
