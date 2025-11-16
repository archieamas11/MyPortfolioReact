import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import type { SectionId } from './types'
import { SCROLL_OFFSET, MINI_MODE_THRESHOLD, CHATBOT_CLOSE_DELAY, SCROLL_TOP_OFFSET } from './constants'
import ChatbotContainer from './ChatbotContainer'
import NavigationList from './NavigationList'
import GlassEffectLayers from './components/glass-effect'
import { SpotLightItem, Spotlight } from '@/components/spotlight'

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
    <nav ref={navRef} className={cn('fixed top-4 left-1/2 z-800 -translate-x-1/2', 'max-md:top-auto max-md:bottom-4 max-md:flex max-md:flex-row')}>
      <Spotlight ProximitySpotlight={true} CursorFlowGradient={true} HoverFocusSpotlight={true}>
        <SpotLightItem>
          {/* Glass effect layers */}
          <GlassEffectLayers isChatbotOpen={isChatbotOpen} />

          {/* Content layer */}
          <div className="relative z-999 flex flex-col">
            <NavigationList activeSection={activeSection} isMini={isMini} isMobile={isMobile} onNavClick={handleNavClick} />

            {/* Chatbot Container */}
            <div className={cn(isMini ? 'w-[400px]' : 'w-full', isMobile ? 'w-full p-0' : '')}>
              <ChatbotContainer isOpen={isChatbotOpen} isMini={isMini} isMobile={isMobile} />
            </div>
          </div>
        </SpotLightItem>
      </Spotlight>
    </nav>
  )
}
