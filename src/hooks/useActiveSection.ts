import { useState, useEffect } from 'react'
import type { SectionId } from '@/pages/header/types'
import { SCROLL_OFFSET } from '@/pages/header/constants'

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

export const useActiveSection = (isChatbotOpen: boolean) => {
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

export { calculateActiveSection }

