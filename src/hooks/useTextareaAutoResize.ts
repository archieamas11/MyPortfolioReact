import { useRef, useCallback } from 'react'
import type { RefObject } from 'react'

const MAX_HEIGHT = 200

export function useTextareaAutoResize() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target
    target.style.height = 'auto'
    const scrollHeight = target.scrollHeight
    const newHeight = Math.min(scrollHeight, MAX_HEIGHT)
    target.style.height = `${newHeight}px`
    target.style.overflow = scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden'
  }, [])

  const resetHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [])

  return {
    textareaRef: textareaRef as RefObject<HTMLTextAreaElement>,
    handleChange,
    resetHeight,
  }
}
