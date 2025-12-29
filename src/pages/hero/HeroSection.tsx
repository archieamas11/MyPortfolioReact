import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect, useMemo } from 'react'
import { Contact, FileUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { AccentColorSelector } from '@/components/AccentColorSelector'
import Snowfall from 'react-snowfall'
import { isHolidaySeason } from '@/utils/date-utils'
import { useTheme } from 'next-themes'

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()
  const showSnowfall = useMemo(() => isHolidaySeason(), [])

  const snowfallConfig = useMemo(
    () => ({
      snowflakeCount: 50,
      color: resolvedTheme === 'light' ? '#4A90E2' : '#fff',
    }),
    [resolvedTheme],
  )

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
          className="relative top-10 flex w-full justify-center lg:top-40"
        >
          {/* Hero section logo background */}
          <div className="bg-primary/15 bg-effect from-accent/15 relative hidden h-65 w-full overflow-hidden rounded-t-3xl bg-gradient-to-t to-transparent sm:block">
            {showSnowfall && !isMobile && (
              <Snowfall
                snowflakeCount={snowfallConfig.snowflakeCount}
                color={snowfallConfig.color}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              />
            )}
          </div>
          <div className="absolute top-45 sm:top-2 sm:right-2">
            <AccentColorSelector />
          </div>
          {/* Logo  */}
          <a href="#hero" aria-label="Go to homepage">
            <img
              id="logo"
              src={'images/aaa-white.avif'}
              alt="Archie Albarico Logo"
              className={cn(
                `home-logo glass-effect bg-accent border-background rounded-full border-15 object-contain ${isScrolled ? 'scrolled' : ''}`,
                isMobile ? 'border-0' : '',
              )}
            />
          </a>

          {/* Heading */}
          <div className="absolute top-60 flex flex-col items-center justify-center sm:top-56 md:top-54 lg:top-49 xl:top-43">
            <motion.h1
              initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isMobile ? 0 : 0.7, delay: isMobile ? 0 : 0.2 }}
              className={cn(
                'from-primary font-oswald to-accent relative ml-0 bg-gradient-to-b from-50% to-50% bg-clip-text text-center text-[60px] leading-tight font-bold tracking-widest text-transparent sm:text-[60px] md:text-[70px] lg:text-[105px] xl:ml-3 xl:text-[140px]',
                // showSnowfall && 'snow-caps-effect',
              )}
            >
              ARCHIE ALBARICO
              <span className="from-primary/10 to-accent/30 absolute inset-0 -z-10 bg-gradient-to-b opacity-50 blur-xl" />
            </motion.h1>

            <motion.div
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.4 }}
              className="flex w-full flex-col items-center justify-between gap-4 space-y-2 sm:flex-row sm:gap-6"
            >
              <h2 className="text-muted-foreground font-base text-2xl leading-none lg:text-[35px]">
                Full-Stack Developer
              </h2>
              <div className="flex w-full max-w-80 flex-row gap-2 sm:w-auto">
                <a
                  href="Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Resume"
                  className="w-[70%] sm:w-auto"
                >
                  <Button className="bg-accent/30 w-full sm:w-auto" variant={'glass'}>
                    <FileUser />
                    Resume
                  </Button>
                </a>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="#contact" aria-label="Contact Me" className="flex-1 sm:w-auto">
                      <Button size={isMobile ? 'default' : 'icon'} variant="glass">
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
