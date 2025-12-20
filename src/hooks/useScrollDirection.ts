import { useState, useEffect } from 'react'
import { MINI_MODE_THRESHOLD } from '@/pages/header/constants'

export const useScrollDirection = (isMobile: boolean, isChatbotOpen: boolean) => {
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
