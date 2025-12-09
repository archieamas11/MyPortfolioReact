import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { SectionId } from './types'
import { SCROLL_OFFSET, MINI_MODE_THRESHOLD, CHATBOT_CLOSE_DELAY, SCROLL_TOP_OFFSET } from './constants'
import ChatbotContainer from './ChatbotContainer'
import NavigationList from './NavigationList'
import GlassEffectLayers from './components/glass-effect'

// Helper Functions
const getSectionElements = () => ({
  hero: document.getElementById('hero'),
  about: document.getElementById('about-me'),
  projects: document.getElementById('projects'),
  contact: document.getElementById('contact'),
})

const calculateActiveSection = (scrollY: number): SectionId => {
  const sections = getSectionElements()

  if (!sections.hero || !sections.about || !sections.projects || !sections.contact) {
    return 'home-nav'
  }

  if (scrollY < sections.about.offsetTop - SCROLL_OFFSET) {
    return 'home-nav'
  }
  if (scrollY < sections.projects.offsetTop - SCROLL_OFFSET) {
    return 'about-nav'
  }
  if (scrollY < sections.contact.offsetTop - SCROLL_OFFSET) {
    return 'projects-nav'
  }
  return 'contact-nav'
}

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

// Custom Hooks
const useScrollDirection = (isMobile: boolean, isChatbotOpen: boolean) => {
  const [isMini, setIsMini] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)

  useEffect(() => {
    if (isMobile) {
      setIsMini(false)
    }
  }, [isMobile])

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop

      if (!isMobile && !isChatbotOpen) {
        if (currentScroll > lastScrollTop && currentScroll > MINI_MODE_THRESHOLD) {
          setIsMini(true)
        } else if (currentScroll < lastScrollTop) {
          setIsMini(false)
        }
      }

      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollTop, isMobile, isChatbotOpen])

  return isMini
}

const useActiveSection = (isChatbotOpen: boolean) => {
  const [activeSection, setActiveSection] = useState<SectionId>('home-nav')

  useEffect(() => {
    const handleScroll = () => {
      if (isChatbotOpen) return

      try {
        const newSection = calculateActiveSection(window.scrollY)
        setActiveSection(newSection)
      } catch (error) {
        console.error('Error updating active section:', error)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isChatbotOpen])

  return [activeSection, setActiveSection] as const
}

const useClickOutside = (ref: React.RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, ref, onClose])
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
      {/* Glass effect layers */}
      <GlassEffectLayers isChatbotOpen={isChatbotOpen} isProjectsVisible={isProjectsVisible} />

      {/* Content layer */}
      <div className="relative z-999 flex w-full flex-col overflow-hidden">
        {/* Navigation - ensure it wraps on small screens */}
        <div ref={navListRef} className={cn('max-w-full overflow-x-auto', isMobile ? 'w-fit' : 'w-full')}>
          <NavigationList
            activeSection={activeSection}
            isMini={isMini}
            isMobile={isMobile}
            onNavClick={handleNavClick}
          />
        </div>

        {/* Chatbot Container */}
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
