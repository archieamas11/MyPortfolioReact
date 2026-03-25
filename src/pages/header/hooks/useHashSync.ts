import { useEffect } from 'react'
import { hashToSectionId, sectionIdToHash } from '../utils/hash-mapping'
import { scrollToElement } from '../utils/scroll-utils'
import type { SectionId } from '../types'

interface UseHashSyncOptions {
  activeSection: SectionId
  isChatbotOpen: boolean
  setActiveSection: (section: SectionId) => void
}

export const useHashSync = ({ activeSection, isChatbotOpen, setActiveSection }: UseHashSyncOptions): void => {
  // Handle initial hash on mount
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

  useEffect(() => {
    if (isChatbotOpen || activeSection === 'chatbot-nav') return

    const expectedHash = sectionIdToHash(activeSection)
    const currentHash = window.location.hash

    if (currentHash !== expectedHash) {
      window.history.replaceState(null, '', expectedHash)
    }
  }, [activeSection, isChatbotOpen])
}
