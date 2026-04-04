import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import { Contact, FileUser } from "lucide-react";
import { lazy, Suspense, useMemo } from "react";
import Coin3D from "@/components/3d-logo";
import { AccentColorSelector } from "@/components/accent-color-selector";
import { Button } from "@/components/ui/button";
import { Elasticity } from "@/components/ui/elasticity/elasticity";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { isHolidaySeason } from "@/utils/date-utils";
import "@/components/ui/style/glass-animation.css";
import { useTheme } from "next-themes";

const Snowfall = lazy(() => import("react-snowfall"));

export default function HeroSection() {
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const showSnowfall = useMemo(() => isHolidaySeason(), []);
  const shouldAnimate = !(isMobile || shouldReduceMotion);
  const shouldRenderSnowfall = showSnowfall && shouldAnimate;
  const logoSize = isMobile ? 100 : 350;
  const snowfallConfig = useMemo(
    () => ({
      snowflakeCount: 50,
      color: resolvedTheme === "light" ? "#4A90E2" : "#fff",
    }),
    [resolvedTheme]
  );

  return (
    <section
      className="section-wrapper flex items-center justify-center"
      id="hero"
    >
      <div className="flex min-h-150 w-full max-w-7xl">
        <LazyMotion features={domAnimation}>
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="relative top-10 flex w-full justify-center lg:top-50"
            initial={
              shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
            }
            transition={{ duration: shouldAnimate ? 0.5 : 0 }}
          >
            {/* Hero section logo background */}
            <div className="relative hidden h-65 w-full overflow-hidden rounded-t-3xl bg-effect bg-linear-to-t bg-primary/10 from-accent/15 to-transparent backdrop-blur-2xl [-webkit-mask-image:radial-gradient(150px_at_50%_0%,transparent_99%,black_100%)] [mask-image:radial-gradient(150px_at_50%_0%,transparent_99%,black_100%)] sm:block">
              {shouldRenderSnowfall && (
                <Suspense fallback={null}>
                  <Snowfall
                    color={snowfallConfig.color}
                    snowflakeCount={snowfallConfig.snowflakeCount}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      zIndex: 0,
                    }}
                  />
                </Suspense>
              )}
            </div>
            <Elasticity
              className="rounded-full"
              elasticity={0}
              enabled={shouldAnimate}
              withGlassEdgeReflect={true}
            >
              <div className="absolute top-45 sm:top-2 sm:right-2">
                <AccentColorSelector />
              </div>
            </Elasticity>

            {/* Logo  */}
            <div id="logo">
              <Coin3D
                enableIntro={shouldAnimate}
                isMobile={isMobile}
                logoSrc="/images/aaa-white.avif"
                size={logoSize}
              />
            </div>

            {/* Heading */}
            <div className="absolute top-60 flex flex-col items-center justify-center sm:top-56 md:top-54 lg:top-49 xl:top-43">
              <m.h1
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "relative ml-0 bg-linear-to-b from-50% from-primary to-50% to-accent bg-clip-text text-center font-bold font-oswald text-[60px] text-transparent leading-tight tracking-widest sm:text-[60px] md:text-[70px] lg:text-[105px] xl:ml-3 xl:text-[140px]"
                )}
                initial={
                  shouldAnimate
                    ? { opacity: 0, scale: 0.9 }
                    : { opacity: 1, scale: 1 }
                }
                transition={{
                  duration: shouldAnimate ? 0.7 : 0,
                  delay: shouldAnimate ? 0.2 : 0,
                }}
              >
                ARCHIE ALBARICO
                <span className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 to-accent/30 opacity-50 blur-xl" />
              </m.h1>
              <m.div
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6"
                initial={
                  shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
                }
                transition={{
                  duration: shouldAnimate ? 0.5 : 0,
                  delay: shouldAnimate ? 0.4 : 0,
                }}
              >
                <h2 className="font-normal text-2xl text-muted-foreground leading-none lg:text-[35px]">
                  Full-Stack Developer
                </h2>
                <div className="flex w-full max-w-80 flex-row gap-2 sm:w-auto">
                  <a
                    aria-label="Download Resume"
                    className="w-[70%] sm:w-auto"
                    href="Resume.pdf"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Button
                      className="w-full bg-accent/30 sm:w-auto"
                      variant="glass"
                    >
                      <FileUser />
                      Resume
                    </Button>
                  </a>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        aria-label="Contact Me"
                        className="flex-1 sm:w-auto"
                        href="#contact"
                      >
                        <Button
                          size={isMobile ? "default" : "icon"}
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
              </m.div>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
