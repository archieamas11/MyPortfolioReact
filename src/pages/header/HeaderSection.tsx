import { useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useActiveSection, calculateActiveSection } from '@/hooks/useActiveSection'
import { useClickOutside } from '@/hooks/useClickOutside'
import type { SectionId } from './types'
import { CHATBOT_CLOSE_DELAY } from './constants'
import { scrollToElement } from './utils/scroll-utils'
import { useHashSync } from './hooks/useHashSync'
import { useProjectsElement } from './hooks/useProjectsElement'
import { useChatbotState } from './hooks/useChatbotState'
import ChatbotContainer from './ChatbotContainer'
import NavigationList from './NavigationList'
import GlassEffectLayers from './components/glass-effect'

export function HeaderSection() {
  const isMobile = useIsMobile()
  const navRef = useRef<HTMLElement>(null)
  const projectsElement = useProjectsElement()
  const {
    isChatbotOpen,
    handleChatbotToggle: toggleChatbot,
    handleChatbotClose: closeChatbot,
  } = useChatbotState()
  const [activeSection, setActiveSection] = useActiveSection(isChatbotOpen)
  const isMini = useScrollDirection(isMobile, isChatbotOpen)

  const handleChatbotToggle = useCallback(() => {
    toggleChatbot()
    if (!isChatbotOpen) {
      setActiveSection('chatbot-nav')
    } else {
      setActiveSection(calculateActiveSection(window.scrollY))
    }
  }, [isChatbotOpen, toggleChatbot, setActiveSection])

  const handleChatbotClose = useCallback(() => {
    closeChatbot()
    setActiveSection(calculateActiveSection(window.scrollY))
  }, [closeChatbot, setActiveSection])

  // Sync URL hash with active section
  useHashSync({
    activeSection,
    isChatbotOpen,
    setActiveSection,
  })

  const isProjectsVisible = useIntersectionObserver({
    target: projectsElement,
    threshold: 0,
    rootMargin: '0px 0px -90% 0px',
  })

  useClickOutside(navRef, isChatbotOpen, handleChatbotClose)

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemId: string) => {
      e.preventDefault()

      if (itemId === 'theme-toggle-nav') {
        return
      }

      if (itemId === 'chatbot-nav') {
        handleChatbotToggle()
        return
      }

      setActiveSection(itemId as SectionId)

      // Update URL hash without triggering a scroll
      if (href && href !== window.location.hash) {
        window.history.pushState(null, '', href)
      }

      if (isChatbotOpen) {
        handleChatbotClose()
        setTimeout(() => scrollToElement(href), CHATBOT_CLOSE_DELAY)
      } else {
        scrollToElement(href)
      }
    },
    [isChatbotOpen, handleChatbotToggle, handleChatbotClose, setActiveSection],
  )

  return (
    <motion.nav
      ref={navRef}
      className={cn(
        'fixed z-800',
        isMobile
          ? 'max-full right-0 bottom-4 left-0 mx-auto flex w-fit justify-center overflow-hidden'
          : 'top-4 left-1/2',
      )}
      initial={isMobile ? { y: 0, x: 0, opacity: 1 } : { y: -100, x: '-50%', opacity: 0 }}
      animate={{
        y: 0,
        x: isMobile ? 0 : '-50%',
        opacity: 1,
      }}
      transition={{ duration: isMobile ? 0 : 0.5, ease: 'easeOut' }}
    >
      <GlassEffectLayers isChatbotOpen={isChatbotOpen} isProjectsVisible={isProjectsVisible} />
      <div className="relative z-999 flex w-full flex-col overflow-hidden">
          <NavigationList
            activeSection={activeSection}
            isMini={isMini}
            isMobile={isMobile}
            onNavClick={handleNavClick}
          />
        <div className={cn('w-full', isMini && !isMobile && 'w-[400px]', isMobile && 'max-h-screen p-0')}>
          <ChatbotContainer isOpen={isChatbotOpen} isMini={isMini} />
        </div>
      </div>
    </motion.nav>
  )
}
