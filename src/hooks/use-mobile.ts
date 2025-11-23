import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Initialize correctly during SSR
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Use mql.matches directly for consistency
    const handleChange = () => setIsMobile(mql.matches)

    // Set initial state and add listener
    handleChange()
    mql.addEventListener('change', handleChange)

    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
