import HeroSection from '@/pages/hero/HeroSection'
import { AboutSection } from '@/pages/about'
import { ProjectsSection } from '@/pages/projects/ProjectsSection'
import { ContactSection } from '@/pages/contact'
import { Footer } from '@/components/Footer'
import { HeaderSection } from '@/pages/header'

function App() {
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
    </div>
  )
}

export default App
