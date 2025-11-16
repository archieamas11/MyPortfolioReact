import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

type SequentialRevealOptions = {
  delay?: number // gap between each item reveal in ms
  threshold?: number // how much of the container must be visible
  rootMargin?: string
  replay?: boolean // if false, animation runs only once
  onComplete?: () => void // callback when all items are revealed
}

type RegisterFn = (node: HTMLElement | null) => void

export const useSequentialReveal = (options: SequentialRevealOptions = {}) => {
  const { delay = 150, threshold = 0.25, rootMargin = '0px', replay = true, onComplete } = options

  const isMobile = useIsMobile()
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null)
  const itemsRef = useRef<Set<HTMLElement>>(new Set())
  const timersRef = useRef<Set<number>>(new Set())
  const animatingRef = useRef(false)
  const hasAnimatedRef = useRef(false)

  // Register item - immediately reveal on mobile
  const registerItem = useCallback<RegisterFn>(
    (node) => {
      if (!node) return

      // Remove from set if already exists (cleanup on re-render)
      if (itemsRef.current.has(node)) {
        itemsRef.current.delete(node)
      }

      if (isMobile) {
        // On mobile, skip animation and show immediately
        node.classList.remove('reveal-item')
        node.classList.add('reveal-item-visible')
      } else {
        // On desktop, prepare for animation
        node.classList.remove('reveal-item-visible')
        node.classList.add('reveal-item')
      }

      itemsRef.current.add(node)
    },
    [isMobile],
  )

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    timersRef.current.clear()
  }, [])

  const resetItems = useCallback(() => {
    clearTimers()
    itemsRef.current.forEach((node) => {
      node.classList.remove('reveal-item-visible')
    })
    animatingRef.current = false
  }, [clearTimers])

  const revealItems = useCallback(() => {
    if (animatingRef.current) return

    animatingRef.current = true
    const items = Array.from(itemsRef.current)

    // Sort items by DOM order for consistent animation
    items.sort((a, b) => {
      const position = a.compareDocumentPosition(b)
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })

    items.forEach((node, index) => {
      const timerId = window.setTimeout(() => {
        // Check if node is still in the DOM
        if (node.isConnected) {
          node.classList.add('reveal-item-visible')
        }

        // Clean up this timer
        timersRef.current.delete(timerId)

        // Call onComplete when last item is revealed
        if (index === items.length - 1) {
          animatingRef.current = false
          hasAnimatedRef.current = true
          onComplete?.()
        }
      }, delay * index)

      timersRef.current.add(timerId)
    })
  }, [delay, onComplete])

  useEffect(() => {
    // Skip intersection observer setup on mobile
    if (!containerEl || typeof window === 'undefined' || isMobile) {
      // On mobile, immediately reveal all items
      if (isMobile && containerEl) {
        itemsRef.current.forEach((node) => {
          node.classList.add('reveal-item-visible')
        })
        onComplete?.()
      }
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting || entry.intersectionRatio >= threshold

          if (inView) {
            // Only animate if replay is true OR if it hasn't animated yet
            if (replay || !hasAnimatedRef.current) {
              revealItems()
            }
          } else if (!inView && replay) {
            resetItems()
            hasAnimatedRef.current = false
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(containerEl)

    return () => {
      observer.disconnect()
      clearTimers()
    }
  }, [containerEl, threshold, rootMargin, replay, revealItems, resetItems, clearTimers, isMobile, onComplete])

  const containerRef = useCallback((node: HTMLElement | null) => {
    setContainerEl(node)
  }, [])

  // Expose manual control methods (no-op on mobile)
  const reveal = useCallback(() => {
    if (!isMobile) {
      revealItems()
    }
  }, [isMobile, revealItems])

  const reset = useCallback(() => {
    if (!isMobile) {
      resetItems()
      hasAnimatedRef.current = false
    }
  }, [isMobile, resetItems])

  return {
    containerRef,
    registerItem,
    reveal, // Manual trigger (no-op on mobile)
    reset, // Manual reset (no-op on mobile)
  }
}
