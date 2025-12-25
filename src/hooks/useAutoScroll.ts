import { useEffect } from 'react'
import type { RefObject } from 'react'
import type { Message } from '@/types/types'

export function useAutoScroll(scrollAreaRef: RefObject<HTMLDivElement | null>, messages: Message[]) {
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        })
      }
    }
  }, [messages, scrollAreaRef])
}
