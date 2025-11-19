import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme } = useTheme()
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="hero" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-45 flex w-full max-w-7xl justify-center"
        >
          {/* Hero section logo background */}
          <div className="bg-primary/15 bg-effect hidden h-65 w-full rounded-t-3xl sm:block" />

          {/* Logo  */}
          <a href="#hero" aria-label="Go to homepage">
            <img
              id="logo"
              src={theme === 'dark' ? 'images/aaa-white.png' : 'images/aaa-black.png'}
              className={cn(
                `home-logo rounded-full object-contain ${isScrolled ? 'scrolled' : 'border-b-2'}`,
                isMobile ? '' : 'glass-effect border-background rounded-full border-15 bg-[#d1d1d1] transition-all duration-500 dark:bg-[#4e67b0]',
              )}
            />
          </a>
        </motion.div>

        {/* Heading */}
        <div className="relative ml-[18px] flex flex-col items-center justify-center px-4 sm:-mt-16 sm:space-y-6 lg:-mt-[87px] lg:space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="from-primary font-oswald relative bg-gradient-to-b from-50% to-[#4e67b0] to-50% bg-clip-text text-3xl leading-tight font-bold tracking-widest text-transparent sm:text-5xl lg:text-7xl xl:text-[140px]"
          >
            ARCHIE ALBARICO
            <span className="from-primary/10 absolute inset-0 -z-10 bg-gradient-to-b to-[#4e67b0]/30 opacity-50 blur-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex w-full items-center justify-between gap-4 sm:gap-6"
          >
            <h2 className="text-muted-foreground font-base text-lg leading-none sm:text-2xl lg:text-4xl">Full-Stack Developer</h2>
            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <a href="#projects" aria-label="View Projects" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  View Projects
                </Button>
              </a>
              <a href="#contact" aria-label="Contact Me" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" variant="glass">
                  Contact Me
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        {/* scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="hidden lg:block">
          <a
            href="#about-me"
            className="group text-muted-foreground hover:text-foreground absolute bottom-20 inline-flex flex-col items-center gap-1 transition-colors"
            aria-label="Scroll to projects"
          >
            <span className="text-xs">Scroll</span>
            <ChevronDown className="size-5 animate-bounce" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
