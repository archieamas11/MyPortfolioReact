import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useActiveSection, calculateActiveSection } from '@/hooks/useActiveSection'
import { useClickOutside } from '@/hooks/useClickOutside'
import type { SectionId } from './types'
import { CHATBOT_CLOSE_DELAY, SCROLL_TOP_OFFSET } from './constants'
import ChatbotContainer from './ChatbotContainer'
import NavigationList from './NavigationList'
import GlassEffectLayers from './components/glass-effect'

const scrollToElement = (href: string) => {
  if (href === '#hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const targetElement = document.querySelector(href)
  if (targetElement) {
    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - SCROLL_TOP_OFFSET
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }
}

const HASH_TO_SECTION: Record<string, SectionId> = {
  '#hero': 'home-nav',
  '#about-me': 'about-nav',
  '#projects': 'projects-nav',
  '#contact': 'contact-nav',
}

const SECTION_TO_HASH: Record<SectionId, string> = {
  'home-nav': '#hero',
  'about-nav': '#about-me',
  'projects-nav': '#projects',
  'contact-nav': '#contact',
  'chatbot-nav': '#chatbot',
}

const hashToSectionId = (hash: string): SectionId => HASH_TO_SECTION[hash] || 'home-nav'
const sectionIdToHash = (sectionId: SectionId): string => SECTION_TO_HASH[sectionId] || '#hero'

export function HeaderSection() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const isMobile = useIsMobile()
  const navRef = useRef<HTMLElement>(null)
  const isMini = useScrollDirection(isMobile, isChatbotOpen)
  const [activeSection, setActiveSection] = useActiveSection(isChatbotOpen)
  const [projectsElement, setProjectsElement] = useState<Element | null>(null)

  useEffect(() => {
    setProjectsElement(document.getElementById('projects'))
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    let attempts = 0
    const maxAttempts = 10

    const attemptScroll = () => {
      const targetElement = document.querySelector(hash)
      if (targetElement) {
        scrollToElement(hash)
        setActiveSection(hashToSectionId(hash))
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(attemptScroll, 100)
      }
    }

    setTimeout(attemptScroll, 100)
  }, [setActiveSection])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash
      if (hash) {
        scrollToElement(hash)
        const sectionId = hashToSectionId(hash)
        setActiveSection(sectionId)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setActiveSection('home-nav')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setActiveSection])

  // Update URL hash when active section changes (from scrolling)
  useEffect(() => {
    // Skip if chatbot is open or if it's the chatbot section
    if (isChatbotOpen || activeSection === 'chatbot-nav') return

    const expectedHash = sectionIdToHash(activeSection)
    const currentHash = window.location.hash

    // Only update if hash doesn't match (to avoid unnecessary updates)
    if (currentHash !== expectedHash) {
      window.history.replaceState(null, '', expectedHash)
    }
  }, [activeSection, isChatbotOpen])

  const isProjectsVisible = useIntersectionObserver({
    target: projectsElement,
    threshold: 0,
    rootMargin: '0px 0px -90% 0px',
  })

  const handleChatbotClose = useCallback(() => {
    setIsChatbotOpen(false)
    setActiveSection(calculateActiveSection(window.scrollY))
  }, [setActiveSection])

  useClickOutside(navRef, isChatbotOpen, handleChatbotClose)

  const handleChatbotToggle = useCallback(() => {
    setIsChatbotOpen((prev) => {
      const willBeOpen = !prev

      if (willBeOpen) {
        setActiveSection('chatbot-nav')
      } else {
        setActiveSection(calculateActiveSection(window.scrollY))
      }

      return willBeOpen
    })
  }, [setActiveSection])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemId: string) => {
      e.preventDefault()

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
        setIsChatbotOpen(false)
        setTimeout(() => scrollToElement(href), CHATBOT_CLOSE_DELAY)
      } else {
        scrollToElement(href)
      }
    },
    [isChatbotOpen, handleChatbotToggle, setActiveSection],
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
        <div className={cn('max-w-full overflow-x-auto', isMobile ? 'w-fit' : 'w-full')}>
          <NavigationList
            activeSection={activeSection}
            isMini={isMini}
            isMobile={isMobile}
            onNavClick={handleNavClick}
          />
        </div>
        <div className={cn('w-full', isMini && !isMobile && 'w-[400px]', isMobile && 'max-h-screen p-0')}>
          <ChatbotContainer isOpen={isChatbotOpen} isMini={isMini} />
        </div>
      </div>
    </motion.nav>
  )
}
