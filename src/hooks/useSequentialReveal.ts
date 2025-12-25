import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

type SequentialRevealOptions = {
  delay?: number
  threshold?: number
  rootMargin?: string
  replay?: boolean
  onComplete?: () => void
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

  const registerItem = useCallback<RegisterFn>(
    (node) => {
      if (!node) {
        itemsRef.current.forEach((item) => {
          if (!item.isConnected) {
            itemsRef.current.delete(item)
          }
        })
        return
      }

      if (itemsRef.current.has(node)) {
        itemsRef.current.delete(node)
      }

      if (isMobile) {
        node.classList.remove('reveal-item')
        node.classList.add('reveal-item-visible')
      } else {
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
      if (node.isConnected) {
        node.classList.remove('reveal-item-visible')
      }
    })
    animatingRef.current = false
    hasAnimatedRef.current = false
  }, [clearTimers])

  const revealItems = useCallback(() => {
    if (animatingRef.current) return

    clearTimers()

    const items = Array.from(itemsRef.current).filter((node) => node.isConnected)

    if (items.length === 0) {
      animatingRef.current = false
      hasAnimatedRef.current = true
      onComplete?.()
      return
    }

    animatingRef.current = true

    items.sort((a, b) => {
      const position = a.compareDocumentPosition(b)
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })

    items.forEach((node, index) => {
      const timerId = window.setTimeout(() => {
        if (node.isConnected) {
          node.classList.add('reveal-item-visible')
        }

        timersRef.current.delete(timerId)

        if (index === items.length - 1) {
          animatingRef.current = false
          hasAnimatedRef.current = true
          onComplete?.()
        }
      }, delay * index)

      timersRef.current.add(timerId)
    })
  }, [delay, onComplete, clearTimers])

  useEffect(() => {
    if (!containerEl || typeof window === 'undefined' || isMobile) {
      if (isMobile && containerEl) {
        itemsRef.current.forEach((node) => {
          if (node.isConnected) {
            node.classList.add('reveal-item-visible')
          }
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
            if (replay || !hasAnimatedRef.current) {
              revealItems()
            }
          } else if (!inView && replay) {
            resetItems()
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

  const reveal = useCallback(() => {
    if (!isMobile) {
      revealItems()
    }
  }, [isMobile, revealItems])

  const reset = useCallback(() => {
    if (!isMobile) {
      resetItems()
    }
  }, [isMobile, resetItems])

  return {
    containerRef,
    registerItem,
    reveal,
    reset,
  }
}
