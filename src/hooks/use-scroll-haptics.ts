import { useEffect, useRef } from 'react'
import { WebHaptics } from 'web-haptics'

export function useScrollHaptics() {
  const isTopRef = useRef(true)
  const isBottomRef = useRef(false)

  useEffect(() => {
    const haptics = new WebHaptics()

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Handle top haptic
      if (scrollY <= 0) {
        if (!isTopRef.current) {
          isTopRef.current = true
          haptics.trigger('light')
        }
      } else {
        isTopRef.current = false
      }

      // Handle bottom haptic
      if (scrollY + windowHeight >= documentHeight - 2) {
        if (!isBottomRef.current) {
          isBottomRef.current = true
          haptics.trigger('light')
        }
      } else {
        isBottomRef.current = false
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      haptics.destroy()
    }
  }, [])
}
