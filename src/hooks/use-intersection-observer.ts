import { useEffect, useState } from 'react'

interface UseIntersectionObserverProps {
  root?: Element | null
  rootMargin?: string
  target: Element | null
  threshold?: number | number[]
}

export function useIntersectionObserver({
  target,
  root = null,
  rootMargin = '0%',
  threshold = 0,
}: UseIntersectionObserverProps): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!target) {
      return
    }

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
  }, [target, root, rootMargin, threshold])

  return isIntersecting
}
