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

const hashToSectionId = (hash: string): SectionId => {
  const hashMap: Record<string, SectionId> = {
    '#hero': 'home-nav',
    '#about-me': 'about-nav',
    '#projects': 'projects-nav',
    '#contact': 'contact-nav',
  }
  return hashMap[hash] || 'home-nav'
}

export function HeaderSection() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const isMobile = useIsMobile()
  const navRef = useRef<HTMLElement>(null)
  const isMini = useScrollDirection(isMobile, isChatbotOpen)
  const [activeSection, setActiveSection] = useActiveSection(isChatbotOpen)
  const navListRef = useRef<HTMLDivElement>(null)
  const [navListWidth, setNavListWidth] = useState(0)
  const [projectsElement, setProjectsElement] = useState<Element | null>(null)

  useEffect(() => {
    setProjectsElement(document.getElementById('projects'))
  }, [])

  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash
      if (!hash) return

      const attemptScroll = (attempts = 0) => {
        const maxAttempts = 10
        const targetElement = document.querySelector(hash)

        if (targetElement) {
          // Element found, scroll to it
          scrollToElement(hash)
          // Update active section based on hash
          const sectionId = hashToSectionId(hash)
          setActiveSection(sectionId)
        } else if (attempts < maxAttempts) {
          // Element not found yet, retry after a short delay
          setTimeout(() => attemptScroll(attempts + 1), 100)
        }
      }

      setTimeout(() => attemptScroll(), 100)
    }

    handleInitialHash()
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

  const isProjectsVisible = useIntersectionObserver({
    target: projectsElement,
    threshold: 0,
    rootMargin: '0px 0px -90% 0px',
  })

  useEffect(() => {
    const updateWidth = () => {
      if (navListRef.current) {
        setNavListWidth(navListRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [isMobile, isMini, activeSection])

  const handleChatbotClose = useCallback(() => {
    setIsChatbotOpen(false)
    const newSection = calculateActiveSection(window.scrollY)
    setActiveSection(newSection)
  }, [setActiveSection])

  useClickOutside(navRef, isChatbotOpen, handleChatbotClose)

  const handleChatbotToggle = useCallback(() => {
    setIsChatbotOpen((prev) => {
      const willBeOpen = !prev

      if (willBeOpen) {
        setActiveSection('chatbot-nav')
      } else {
        const newSection = calculateActiveSection(window.scrollY)
        setActiveSection(newSection)
      }

      return willBeOpen
    })
  }, [setActiveSection])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemId: string) => {
      e.preventDefault()

      // Handle chatbot toggle
      if (itemId === 'chatbot-nav') {
        handleChatbotToggle()
        return
      }

      // Update active section
      setActiveSection(itemId as SectionId)

      // Update URL hash without triggering a scroll
      if (href && href !== window.location.hash) {
        window.history.pushState(null, '', href)
      }

      // Close chatbot if open
      const shouldCloseChatbot = isChatbotOpen
      if (shouldCloseChatbot) {
        setIsChatbotOpen(false)
      }

      // Scroll to section
      const performScroll = () => scrollToElement(href)

      if (shouldCloseChatbot) {
        setTimeout(performScroll, CHATBOT_CLOSE_DELAY)
      } else {
        performScroll()
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
      initial={
        isMobile
          ? { y: 0, x: 0, opacity: 1, filter: 'none' }
          : { y: -100, x: '-50%', opacity: 0, filter: 'blur(10px)' }
      }
      animate={{
        y: 0,
        x: isMobile ? 0 : '-50%',
        opacity: 1,
        filter: 'blur(0px)',
        transitionEnd: { filter: 'none' },
      }}
      transition={{ duration: isMobile ? 0 : 0.5, ease: 'easeOut' }}
    >
      <GlassEffectLayers isChatbotOpen={isChatbotOpen} isProjectsVisible={isProjectsVisible} />
      <div className="relative z-999 flex w-full flex-col overflow-hidden">
        <div ref={navListRef} className={cn('max-w-full overflow-x-auto', isMobile ? 'w-fit' : 'w-full')}>
          <NavigationList
            activeSection={activeSection}
            isMini={isMini}
            isMobile={isMobile}
            onNavClick={handleNavClick}
          />
        </div>
        <div
          className={cn('w-full', isMini && !isMobile && 'w-[400px]', isMobile && 'max-h-screen p-0')}
          style={isMobile && navListWidth ? { width: navListWidth } : undefined}
        >
          <ChatbotContainer isOpen={isChatbotOpen} isMini={isMini} isMobile={isMobile} />
        </div>
      </div>
    </motion.nav>
  )
}
