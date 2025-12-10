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
    <section id="hero" className="section-wrapper flex items-center justify-center">
      <div className="flex min-h-150 w-full max-w-7xl">
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5 }}
          className="relative top-40 flex w-full justify-center"
        >
          {/* Hero section logo background */}
          <div className="bg-primary/15 bg-effect hidden h-65 w-full rounded-t-3xl sm:block" />
          <div className="absolute top-45 sm:top-2 sm:right-2">
            <AccentColorSelector />
          </div>
          {/* Logo  */}
          <a href="#hero" aria-label="Go to homepage">
            <img
              id="logo"
              src={'images/aaa-white.png'}
              className={cn(
                `home-logo glass-effect bg-accent border-background rounded-full border-15 object-contain ${isScrolled ? 'scrolled' : ''}`,
                isMobile ? 'border-0' : '',
              )}
            />
          </a>

          {/* Heading */}
          <div className="absolute top-60 flex flex-col items-center justify-center sm:top-56 md:top-54 lg:top-49 xl:top-43">
            <motion.div
              initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isMobile ? 0 : 0.7, delay: isMobile ? 0 : 0.2 }}
              className="from-primary font-oswald to-accent relative bg-gradient-to-b from-50% to-50% bg-clip-text text-center text-[60px] leading-tight font-bold tracking-widest text-transparent sm:text-[60px] md:text-[70px] lg:text-[100px] xl:text-[140px]"
            >
              ARCHIE ALBARICO
              <span className="from-primary/10 to-accent/30 absolute inset-0 -z-10 bg-gradient-to-b opacity-50 blur-xl" />
            </motion.div>

            <motion.div
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.4 }}
              className="flex w-full flex-col items-center justify-between gap-4 space-y-2 sm:flex-row sm:gap-6"
            >
              <h2 className="text-muted-foreground font-base text-2xl leading-none lg:text-[35px]">
                Full-Stack Developer
              </h2>
              <div className="flex w-full flex-row gap-2 sm:w-auto">
                <a
                  href="http://localhost:5173/#projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Resume"
                  className="w-[70%] sm:w-auto"
                >
                  <Button className="w-full sm:w-auto" variant={'glass'}>
                    <FileUser />
                    Resume
                  </Button>
                </a>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="#contact" aria-label="Contact Me" className="flex-1 sm:w-auto">
                      <Button
                        size={isMobile ? 'default' : 'icon'}
                        className={cn('rounded-full', isMobile ? 'bg-accent/30' : '')}
                        variant="glass"
                      >
                        <Contact />
                        <span className="block sm:hidden">Contact</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Contact Me</TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
