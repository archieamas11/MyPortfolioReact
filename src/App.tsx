import { lazy, Suspense } from "react";
import { LiquidBlobBackground } from "@/components/liquid-blob-background";
import { ToastProvider } from "@/components/ui/toast/toast-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/pages/footer";
import { HeaderSection } from "@/pages/header";
import HeroSection from "@/pages/hero/hero-section";

const AboutSection = lazy(() =>
  import("@/pages/about/about-section").then((m) => ({
    default: m.AboutSection,
  }))
);

const ProjectsSection = lazy(() =>
  import("@/pages/projects/projects-section").then((m) => ({
    default: m.ProjectsSection,
  }))
);

const ContactSection = lazy(() =>
  import("@/pages/contact").then((m) => ({ default: m.ContactSection }))
);

function SectionFallback() {
  return <div aria-hidden className="min-h-32 w-full" />;
}

function App() {
  const isMobile = useIsMobile();
  return (
    <ToastProvider position={isMobile ? "top-center" : "bottom-right"}>
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
      </div>
    </ToastProvider>
  );
}

export default App;
