import HeroSection from '@/pages/hero/HeroSection'
import { AboutSection } from '@/pages/about'
import { ProjectsSection } from '@/pages/projects/ProjectsSection'
import { ContactSection } from '@/pages/contact'
import { Footer } from '@/pages/Footer'
import { HeaderSection } from '@/pages/header'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import Snowfall from 'react-snowfall'
import { useMemo } from 'react'
import { useTheme } from 'next-themes'

const isHolidaySeason = () => {
  const now = new Date()
  const month = now.getMonth()
  const day = now.getDate()

  // November (after Halloween - Nov 1st onwards)
  if (month === 10) return true

  // December (all month)
  if (month === 11) return true

  // Early January (1st through 15th)
  if (month === 0 && day <= 15) return true

  return false
}

function App() {
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()
  const showSnowfall = useMemo(() => isHolidaySeason(), [])

  const snowfallConfig = useMemo(
    () => ({
      snowflakeCount: isMobile ? 15 : 50,
      color: resolvedTheme === 'light' ? '#87CEEB' : '#fff',
    }),
    [isMobile, resolvedTheme],
  )

  return (
    <div className="relative min-h-screen w-full">
      <HeaderSection />
      <HeroSection />
      <div className="mx-auto max-w-7xl">
        {showSnowfall && (
          <Snowfall
            snowflakeCount={snowfallConfig.snowflakeCount}
            color={snowfallConfig.color}
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              zIndex: 0,
            }}
          />
        )}
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      <Footer />
      <Toaster richColors position={isMobile ? 'top-center' : 'bottom-right'} />
    </div>
  )
}

export default App
