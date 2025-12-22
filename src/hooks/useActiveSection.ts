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

  if (!hero || !about || !projects || !contact) {
    return 'home-nav'
  }

  if (scrollY < about.offsetTop - SCROLL_OFFSET) {
    return 'home-nav'
  }
  if (scrollY < projects.offsetTop - SCROLL_OFFSET) {
    return 'about-nav'
  }
  if (scrollY < contact.offsetTop - SCROLL_OFFSET) {
    return 'projects-nav'
  }
  return 'contact-nav'
}

export const useActiveSection = (isChatbotOpen: boolean) => {
  const [activeSection, setActiveSection] = useState<SectionId>('home-nav')
  const elementsRef = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    elementsRef.current = {
      hero: document.getElementById('hero'),
      about: document.getElementById('about-me'),
      projects: document.getElementById('projects'),
      contact: document.getElementById('contact'),
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isChatbotOpen) return

      const newSection = calculateActiveSection(window.scrollY, elementsRef.current)
      setActiveSection((prev) => (prev !== newSection ? newSection : prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isChatbotOpen])

  return [activeSection, setActiveSection] as const
}

export { calculateActiveSection }
