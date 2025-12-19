import HeroSection from '@/pages/hero/HeroSection'
import { AboutSection } from '@/pages/about'
import { ProjectsSection } from '@/pages/projects/ProjectsSection'
import { ContactSection } from '@/pages/contact'
import { Footer } from '@/pages/Footer'
import { HeaderSection } from '@/pages/header'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'

function App() {
  const isMobile = useIsMobile()

  return (
    <div className="relative min-h-screen w-full">
      <HeaderSection />
      <HeroSection />
      <div className="mx-auto max-w-7xl">
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
