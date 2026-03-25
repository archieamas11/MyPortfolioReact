import * as React from 'react'

const DEFAULT_GLASS_CLICK_ANIMATION_MS = 800

type GlassRipple = {
  id: number
  x: number
  y: number
}

type UseGlassClickAnimationOptions = {
enabled: boolean
  disabled?: boolean
  withRipples?: boolean
  durationMs?: number
}

/**
 * Reusable click animation state for glass-like controls.
 */
export function useGlassClickAnimation({
  enabled,
  disabled = false,
  withRipples = true,
  durationMs = DEFAULT_GLASS_CLICK_ANIMATION_MS,
}: UseGlassClickAnimationOptions) {
  const [glassAnimating, setGlassAnimating] = React.useState(false)
  const rippleIdRef = React.useRef(0)
  const [ripples, setRipples] = React.useState<GlassRipple[]>([])

  const startGlassClickAnimation = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enabled || disabled) return
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      if (withRipples) {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = ++rippleIdRef.current

        setRipples((prev) => [...prev, { id, x, y }])
        window.setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, durationMs)
      }

      setGlassAnimating(true)
      window.setTimeout(() => setGlassAnimating(false), durationMs)
    },
    [enabled, disabled, withRipples, durationMs],
  )

  return {
    glassAnimating,
    ripples,
    startGlassClickAnimation,
  }
}
