import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { InterestItem } from './components/interest'
import AboutMe from './components/about-me'
import Contact from './components/contact'
import SkillsItems from './components/skills'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import ExperiencePage from './experience'
import EducationPage from './education'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export function AboutSection() {
  const { theme } = useTheme()
  return (
    <section id="about-me" className="section-wrapper">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <motion.div
          className="relative mx-auto p-2 lg:mx-0"
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        >
          <Avatar className="h-80 w-60 rounded-lg shadow-lg lg:h-full lg:w-80">
            <div className="relative h-full w-full">
              <img
                src="images/me-light.avif"
                alt="Archie Albarico profile picture"
                className={cn(
                  'absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity duration-300',
                  theme === 'dark' ? 'opacity-0' : 'opacity-100',
                )}
                loading="eager"
                aria-hidden={theme === 'dark'}
              />
              <img
                src="images/me-dark.avif"
                alt="Archie Albarico profile picture"
                className={cn(
                  'absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity duration-300',
                  theme === 'dark' ? 'opacity-100' : 'opacity-0',
                )}
                loading="eager"
                aria-hidden={theme !== 'dark'}
              />
            </div>
          </Avatar>
          <div className="glass absolute inset-0 rounded-xl bg-white/20 dark:bg-white/5"></div>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <AboutMe />
          <InterestItem />
          <Contact />
        </div>
      </div>
      <motion.div
        className="mt-20 flex w-full flex-col gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
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
      </motion.div>

      <Separator className="my-10 sm:my-12" />
      <SkillsItems />
    </section>
  )
}
