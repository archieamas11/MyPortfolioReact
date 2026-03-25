import { lazy, Suspense } from 'react'
import HeroSection from '@/pages/hero/HeroSection'
import { HeaderSection } from '@/pages/header'
import { Footer } from '@/pages/Footer'
import { Toaster } from '@/components/ui/sonner'
import { LiquidBlobBackground } from '@/components/LiquidBlobBackground'
import { useIsMobile } from '@/hooks/use-mobile'

const AboutSection = lazy(() =>
  import('@/pages/about').then((m) => ({ default: m.AboutSection })),
)
const ProjectsSection = lazy(() =>
  import('@/pages/projects/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
)
const ContactSection = lazy(() =>
  import('@/pages/contact').then((m) => ({ default: m.ContactSection })),
)

function SectionFallback() {
  return <div className="min-h-32 w-full" aria-hidden />
}

function App() {
  const isMobile = useIsMobile()
  return (
    <div className="relative min-h-screen w-full">
      <LiquidBlobBackground />
      <HeaderSection />
      <HeroSection />
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </div>
      <Footer />
      <Toaster richColors position={isMobile ? 'top-center' : 'bottom-right'} />
    </div>
  )
}

export default App
