import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useAutoScroll(scrollAreaRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        })
      }
    }
  }, [scrollAreaRef])
}
