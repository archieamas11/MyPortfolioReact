import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect } from 'react'
import { Contact, FileUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { AccentColorSelector } from '@/components/AccentColorSelector'

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center text-center">
        {/* TODO: this is also part of the problem that causes overflow alongside with the header  */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5 }}
          className="relative mt-45 flex w-full max-w-7xl justify-center"
        >
          {/* Hero section logo background */}
          <div className="bg-primary/15 bg-effect hidden h-65 w-full rounded-t-3xl lg:block" />

          {/* Logo  */}
          <a href="#hero" aria-label="Go to homepage">
            <img
              id="logo"
              src={'images/aaa-white.png'}
              className={cn(
                `home-logo glass-effect bg-secondary rounded-full object-contain ${isScrolled ? 'scrolled' : 'border-b-2'}`,
                isMobile ? '' : 'border-background dark:bg-accent bg-accent rounded-full border-15',
              )}
            />
          </a>
        </motion.div>

        {/* Heading */}
        <div className="relative ml-[18px] flex flex-col items-center justify-center space-y-2 px-4 sm:-mt-16 sm:space-y-6 lg:-mt-[87px] lg:space-y-2">
          <div className="absolute right-5 bottom-84">
            <AccentColorSelector />
          </div>
          <motion.div
            initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: isMobile ? 0 : 0.7, delay: isMobile ? 0 : 0.2 }}
            className="from-primary font-oswald to-accent relative mt-20 bg-gradient-to-b from-50% to-50% bg-clip-text text-5xl leading-tight font-bold tracking-widest text-transparent lg:mt-0 lg:text-7xl xl:text-[140px]"
          >
            ARCHIE ALBARICO
            <span className="from-primary/10 to-accent/30 absolute inset-0 -z-10 bg-gradient-to-b opacity-50 blur-xl" />
          </motion.div>

          <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.4 }}
            className="flex w-full flex-col items-center justify-between gap-4 sm:gap-6 lg:flex-row"
          >
            <h2 className="text-muted-foreground font-base text-sm leading-none lg:text-[35px]">
              Full-Stack Developer
            </h2>
            <div className="flex w-full flex-row gap-2 sm:w-auto">
              <a href="#projects" aria-label="View Projects" className="w-[70%] sm:w-auto">
                <Button className="w-full sm:w-auto" variant={'glass'}>
                  Resume
                  <FileUser />
                </Button>
              </a>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#contact" aria-label="Contact Me" className="flex-1 sm:w-auto">
                    <Button size="icon" className="w-full rounded-full sm:w-10" variant="glass">
                      <Contact />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent>Contact Me</TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
