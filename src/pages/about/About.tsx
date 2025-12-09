import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { InterestItem } from './components/interest'
import AboutMe from './components/about-me'
import Contact from './components/contact'
import SkillsItems from './components/skills'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import ExperiencePage from './experience'
import EducationPage from './education'

export function AboutSection() {
  const { theme } = useTheme()
  return (
    <section id="about-me" className="section-wrapper">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="relative mx-auto p-2 lg:mx-0">
          <Avatar className="h-full w-full rounded-lg shadow-lg lg:h-full lg:w-80">
            <div className="relative h-full w-full">
              <img
                src="images/me-light.jpg"
                alt="Archie Albarico profile picture"
                className={cn(
                  'absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity duration-300',
                  theme === 'dark' ? 'opacity-0' : 'opacity-100',
                )}
                loading="eager"
              />
              <img
                src="images/me-dark.png"
                alt="Archie Albarico profile picture"
                className={cn(
                  'absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity duration-300',
                  theme === 'dark' ? 'opacity-100' : 'opacity-0',
                )}
                loading="eager"
              />
            </div>
          </Avatar>
          <div className="glass absolute inset-0 rounded-xl bg-white/20 dark:bg-white/5"></div>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <AboutMe />
          <InterestItem />
          <Contact />
        </div>
      </div>
      <div className="mt-20 flex w-full flex-col gap-6">
        <Tabs defaultValue="experience">
          <div className="border-b">
            <TabsList variant="underline" className="w-full *:data-[slot=tabs-trigger]:h-12">
              <TabsTab value="experience">Experience</TabsTab>
              <TabsTab value="education">Education</TabsTab>
            </TabsList>
          </div>
          <TabsPanel value="experience" className="p-2">
            <ExperiencePage />
          </TabsPanel>
          <TabsPanel value="education" className="p-2">
            <EducationPage />
          </TabsPanel>
        </Tabs>
      </div>

      <Separator className="my-10 sm:my-12" />
      <SkillsItems />
    </section>
  )
}
