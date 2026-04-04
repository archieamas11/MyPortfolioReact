import { domAnimation, LazyMotion, m } from "framer-motion";
import { useCallback, useMemo, useRef } from "react";
import { WebHaptics } from "web-haptics";
import {
  calculateActiveSection,
  useActiveSection,
} from "@/hooks/use-active-section";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import ChatbotContainer from "./chatbot-container";
import GlassEffectLayers from "./components/glass-effect";
import { CHATBOT_CLOSE_DELAY } from "./constants";
import { useChatbotState } from "./hooks/use-chatbot-state";
import { useHashSync } from "./hooks/use-hash-sync";
import { useProjectsElement } from "./hooks/use-projects-element";
import NavigationList from "./navigation-list";
import type { SectionId } from "./types";
import { scrollToElement } from "./utils/scroll-utils";

export function HeaderSection() {
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLElement>(null);
  const haptics = useMemo(() => new WebHaptics(), []);
  const projectsElement = useProjectsElement();
  const {
    isChatbotOpen,
    handleChatbotToggle: toggleChatbot,
    handleChatbotClose: closeChatbot,
  } = useChatbotState();
  const [activeSection, setActiveSection] = useActiveSection(isChatbotOpen);
  const isMini = useScrollDirection(isMobile, isChatbotOpen);

  const handleChatbotToggle = useCallback(() => {
    toggleChatbot();
    if (isChatbotOpen) {
      setActiveSection(calculateActiveSection(window.scrollY));
    } else {
      setActiveSection("chatbot-nav");
    }
  }, [isChatbotOpen, toggleChatbot, setActiveSection]);

  const handleChatbotClose = useCallback(() => {
    closeChatbot();
    setActiveSection(calculateActiveSection(window.scrollY));
  }, [closeChatbot, setActiveSection]);

  // Sync URL hash with active section
  useHashSync({
    activeSection,
    isChatbotOpen,
    setActiveSection,
  });

  const isProjectsVisible = useIntersectionObserver({
    target: projectsElement,
    threshold: 0,
    rootMargin: "0px 0px -90% 0px",
  });

  useClickOutside(navRef, isChatbotOpen, handleChatbotClose);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemId: string) => {
      e.preventDefault();

      if (itemId === "theme-toggle-nav") {
        return;
      }

      if (itemId === "chatbot-nav") {
        handleChatbotToggle();
        return;
      }

      setActiveSection(itemId as SectionId);

      // Update URL hash without triggering a scroll
      if (href && href !== window.location.hash) {
        window.history.pushState(null, "", href);
      }

      if (isChatbotOpen) {
        handleChatbotClose();
        setTimeout(() => scrollToElement(href), CHATBOT_CLOSE_DELAY);
      } else {
        scrollToElement(href);
      }
    },
    [isChatbotOpen, handleChatbotToggle, handleChatbotClose, setActiveSection]
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.nav
        animate={{
          y: 0,
          x: isMobile ? 0 : "-50%",
          opacity: 1,
        }}
        className={cn(
          "fixed z-800",
          isMobile
            ? "max-full right-0 bottom-4 left-0 mx-auto flex w-fit justify-center overflow-hidden"
            : "top-4 left-1/2"
        )}
        initial={
          isMobile
            ? { y: 0, x: 0, opacity: 1 }
            : { y: -100, x: "-50%", opacity: 0 }
        }
        ref={navRef}
        transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
      >
        <GlassEffectLayers
          isChatbotOpen={isChatbotOpen}
          isProjectsVisible={isProjectsVisible}
        />
        <div className="relative z-999 flex w-full flex-col overflow-hidden">
          <NavigationList
            activeSection={activeSection}
            haptics={haptics}
            isMini={isMini}
            isMobile={isMobile}
            onNavClick={handleNavClick}
          />
          <div
            className={cn(
              "w-full",
              isMini && !isMobile && "w-100",
              isMobile && "max-h-screen p-0"
            )}
          >
            <ChatbotContainer isMini={isMini} isOpen={isChatbotOpen} />
          </div>
        </div>
      </m.nav>
    </LazyMotion>
  );
}
