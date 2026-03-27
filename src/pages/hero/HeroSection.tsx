import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import { Contact, FileUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { isHolidaySeason } from '@/utils/date-utils'
import { useTheme } from 'next-themes'
import '@/components/ui/style/glass-animation.css'
import { Elasticity } from '@/components/ui/elasticity/Elasticity'
import { AccentColorSelector } from '@/components/AccentColorSelector'

const Snowfall = lazy(() => import('react-snowfall'))
const LOGO_SIZE = 250
const SCROLLED_THRESHOLD = 1

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const isScrolledRef = useRef(isScrolled)

  const showSnowfall = useMemo(() => isHolidaySeason(), [])
  const shouldAnimate = !isMobile && !shouldReduceMotion
  const shouldRenderSnowfall = showSnowfall && shouldAnimate

  const snowfallConfig = useMemo(
    () => ({
      snowflakeCount: 50,
      color: resolvedTheme === 'light' ? '#4A90E2' : '#fff',
    }),
    [resolvedTheme],
  )

  useEffect(() => {
    let frameId = 0

    const updateScrollState = () => {
      frameId = 0

      const nextIsScrolled = window.scrollY > SCROLLED_THRESHOLD
      if (isScrolledRef.current === nextIsScrolled) return

      isScrolledRef.current = nextIsScrolled
      setIsScrolled(nextIsScrolled)
    }

    const handleScroll = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <section id="hero" className="section-wrapper flex items-center justify-center">
      <div className="flex min-h-150 w-full max-w-7xl">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldAnimate ? 0.5 : 0 }}
            className="relative top-10 flex w-full justify-center lg:top-40"
          >
            {/* Hero section logo background */}
            <div className="bg-primary/15 bg-effect from-accent/15 relative hidden h-65 w-full overflow-hidden rounded-t-3xl bg-linear-to-t to-transparent sm:block">
              {shouldRenderSnowfall && (
                <Suspense fallback={null}>
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
                </Suspense>
              )}
            </div>
            <Elasticity withGlassEdgeReflect={true} className="rounded-full" enabled={shouldAnimate}>
              <div className="absolute top-45 sm:top-2 sm:right-2">
                <AccentColorSelector />
              </div>
            </Elasticity>

            {/* Logo  */}
            <div className="focus-visible:ring-ring focus-visible:ring-offset-background rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
              <img
                id="logo"
                src="images/aaa-white.avif"
                alt="Archie Albarico Logo"
                width={LOGO_SIZE}
                height={LOGO_SIZE}
                fetchPriority="high"
                decoding="async"
                loading="eager"
                className={cn(
                  `home-logo glass-effect bg-accent border-background rounded-full border-15 object-contain ${isScrolled ? 'scrolled' : ''}`,
                  isMobile ? 'border-0' : '',
                )}
              />
            </div>

            {/* Heading */}
            <div className="absolute top-60 flex flex-col items-center justify-center sm:top-56 md:top-54 lg:top-49 xl:top-43">
              <m.h1
                initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: shouldAnimate ? 0.7 : 0, delay: shouldAnimate ? 0.2 : 0 }}
                className={cn(
                  'from-primary font-oswald to-accent relative ml-0 bg-linear-to-b from-50% to-50% bg-clip-text text-center text-[60px] leading-tight font-bold tracking-widest text-transparent sm:text-[60px] md:text-[70px] lg:text-[105px] xl:ml-3 xl:text-[140px]',
                )}
              >
                ARCHIE ALBARICO
                <span className="from-primary/10 to-accent/30 absolute inset-0 -z-10 bg-linear-to-b opacity-50 blur-xl" />
              </m.h1>

              <m.div
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldAnimate ? 0.5 : 0, delay: shouldAnimate ? 0.4 : 0 }}
                className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6"
              >
                <h2 className="text-muted-foreground text-2xl leading-none font-normal lg:text-[35px]">
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
                    <Button className="bg-accent/30 w-full sm:w-auto" variant="glass">
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
              </m.div>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  )
}
