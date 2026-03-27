import { useState, useEffect, useRef } from 'react'
import type { SectionId } from '@/pages/header/types'
import { SCROLL_OFFSET } from '@/pages/header/constants'

const calculateActiveSection = (
  scrollY: number,
  elements?: Record<string, HTMLElement | null>,
): SectionId => {
  const targetElements = elements || {
    hero: document.getElementById('hero'),
    about: document.getElementById('about-me'),
    projects: document.getElementById('projects'),
    contact: document.getElementById('contact'),
  }
  const { hero, about, projects, contact } = targetElements

  if (!hero) {
    return 'home-nav'
  }

  if (about && scrollY < about.offsetTop - SCROLL_OFFSET) {
    return 'home-nav'
  }
  if (projects && scrollY < projects.offsetTop - SCROLL_OFFSET) {
    return 'about-nav'
  }
  if (contact && scrollY < contact.offsetTop - SCROLL_OFFSET) {
    return 'projects-nav'
  }

  // Fallback for the last section
  if (contact) return 'contact-nav'
  if (projects) return 'projects-nav'
  if (about) return 'about-nav'

  return 'home-nav'
}

export const useActiveSection = (isChatbotOpen: boolean) => {
  const [activeSection, setActiveSection] = useState<SectionId>('home-nav')
  const elementsRef = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const getElements = () => ({
      hero: document.getElementById('hero'),
      about: document.getElementById('about-me'),
      projects: document.getElementById('projects'),
      contact: document.getElementById('contact'),
    })

    const handleScroll = () => {
      if (isChatbotOpen) return

      // Refresh refs if they are empty (lazy load)
      if (
        !elementsRef.current.hero ||
        !elementsRef.current.about ||
        !elementsRef.current.projects ||
        !elementsRef.current.contact
      ) {
        elementsRef.current = getElements()
      }

      const newSection = calculateActiveSection(window.scrollY, elementsRef.current)
      setActiveSection((prev) => (prev !== newSection ? newSection : prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isChatbotOpen])

  return [activeSection, setActiveSection] as const
}

export { calculateActiveSection }
