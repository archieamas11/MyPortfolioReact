import { useState, useEffect, useRef } from 'react'
import { MINI_MODE_THRESHOLD } from '@/pages/header/constants'

export const useScrollDirection = (isMobile: boolean, isChatbotOpen: boolean) => {
  const [isMini, setIsMini] = useState(false)
  const lastScrollTop = useRef(0)

  useEffect(() => {
    if (isMobile) {
      setIsMini(false)
    }
  }, [isMobile])

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop

      if (!isMobile && !isChatbotOpen) {
        if (currentScroll > lastScrollTop.current && currentScroll > MINI_MODE_THRESHOLD) {
          setIsMini(true)
        } else if (currentScroll < lastScrollTop.current) {
          setIsMini(false)
        }
      }

      lastScrollTop.current = currentScroll <= 0 ? 0 : currentScroll
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, isChatbotOpen])

  return isMini
}
