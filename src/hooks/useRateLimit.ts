import { useState, useEffect } from 'react'

export function useRateLimit() {
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null)

  const isRateLimited = rateLimitedUntil ? Date.now() < rateLimitedUntil : false

  useEffect(() => {
    if (!rateLimitedUntil) return

    const remaining = rateLimitedUntil - Date.now()
    const timeoutId = setTimeout(() => setRateLimitedUntil(null), Math.max(0, remaining))

    return () => clearTimeout(timeoutId)
  }, [rateLimitedUntil])

  return {
    isRateLimited,
    setRateLimitedUntil,
  }
}
