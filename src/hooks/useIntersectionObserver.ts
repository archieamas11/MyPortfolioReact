import { useEffect, useState } from 'react'

interface UseIntersectionObserverProps {
  target: Element | null
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export function useIntersectionObserver({ target, root = null, rootMargin = '0%', threshold = 0 }: UseIntersectionObserverProps): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        root,
        rootMargin,
        threshold,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [target, root, rootMargin, JSON.stringify(threshold)])

  return isIntersecting
}
