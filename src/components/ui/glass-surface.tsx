import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type ElasticityMode = 'transform' | 'individual'

interface SharedGlassProps {
  className?: string
  style?: React.CSSProperties
}

export interface GlassSurfaceOverlayProps
  extends SharedGlassProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  isChatbotOpen?: boolean
  isProjectsVisible?: boolean
  variant: 'overlay'
}

interface ChildInteractiveProps {
  children?: React.ReactNode
  className?: string
  onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void
  onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void
  onPointerMove?: (event: React.PointerEvent<HTMLElement>) => void
  style?: React.CSSProperties
}

export interface GlassSurfaceInteractiveProps extends SharedGlassProps {
  activationZonePx?: number
  asChild?: boolean
  children: React.ReactNode
  clipContent?: boolean
  edgeReflect?: boolean
  edgeThicknessPx?: number
  elasticity?: number
  elasticityEnabled?: boolean
  enabled?: boolean
  intensity?: number
  layer1HoverOpacity?: number
  layer2HoverOpacity?: number
  mode?: ElasticityMode
  preserveCenteredTranslate?: boolean
  transitionMs?: number
  variant?: 'interactive'
}

export type GlassSurfaceProps = GlassSurfaceOverlayProps | GlassSurfaceInteractiveProps

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue
      }
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    }
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function callAll<EventType>(...handlers: Array<((event: EventType) => void) | undefined>) {
  return (event: EventType) => {
    for (const handler of handlers) {
      handler?.(event)
    }
  }
}

function getReducedMotionPreference() {
  if (typeof window === 'undefined') {
    return true
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useReducedMotionPreference() {
  const [isReducedMotion, setIsReducedMotion] = useState(getReducedMotionPreference)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      setIsReducedMotion(mediaQuery.matches)
    }

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  }, [])

  return isReducedMotion
}

function buildEdgeGradients(intensity: number) {
  const intensitySafe = Number.isFinite(intensity) ? Math.max(0, intensity) : 10
  const clamp01 = (n: number) => clamp(n, 0, 1)
  const maxOffset = 60
  const alphaA1 = clamp01((0.12 + maxOffset * 0.008) * intensitySafe)
  const alphaB1 = clamp01((0.4 + maxOffset * 0.012) * intensitySafe)
  const alphaA2 = clamp01((0.32 + maxOffset * 0.008) * intensitySafe)
  const alphaB2 = clamp01((0.6 + maxOffset * 0.012) * intensitySafe)

  const layer1 = `linear-gradient(
    calc(135deg + (var(--ger-mouse-x, 0) * 72deg)),
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, ${alphaA1}) max(10%, calc(33% + (var(--ger-mouse-y, 0) * 18%))),
    rgba(255, 255, 255, ${alphaB1}) min(90%, calc(66% + (var(--ger-mouse-y, 0) * 24%))),
    rgba(255, 255, 255, 0.0) 100%
  )`

  const layer2 = `linear-gradient(
    calc(135deg + (var(--ger-mouse-x, 0) * 72deg)),
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, ${alphaA2}) max(10%, calc(33% + (var(--ger-mouse-y, 0) * 18%))),
    rgba(255, 255, 255, ${alphaB2}) min(90%, calc(66% + (var(--ger-mouse-y, 0) * 24%))),
    rgba(255, 255, 255, 0.0) 100%
  )`

  return { layer1, layer2 }
}

const interactiveRootClassName =
  'group relative isolate [--glass-content-z:1] [&>*:not(.glass-surface-edge-overlay)]:relative [&>*:not(.glass-surface-edge-overlay)]:z-[var(--glass-content-z)]'

const GlassSurfaceOverlay = React.forwardRef<HTMLDivElement, GlassSurfaceOverlayProps>(
  function GlassSurfaceOverlay(
    { className, style, isChatbotOpen = false, isProjectsVisible = false, ...rest },
    forwardedRef,
  ) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'glass-effect absolute inset-0 z-10 overflow-hidden rounded-2xl backdrop-blur-lg transition-all duration-500',
          isChatbotOpen && 'bg-secondary/50 backdrop-blur-3xl',
          isProjectsVisible && !isChatbotOpen && 'bg-secondary/80',
          className,
        )}
        ref={forwardedRef}
        style={style}
        {...rest}
      />
    )
  },
)

GlassSurfaceOverlay.displayName = 'GlassSurfaceOverlay'

const GlassSurfaceInteractive = React.forwardRef<HTMLElement, GlassSurfaceInteractiveProps>(
  function GlassSurfaceInteractive(
    {
      asChild = false,
      children,
      className,
      style,
      clipContent = true,
      edgeReflect = true,
      edgeThicknessPx = 1,
      intensity = 10,
      layer1HoverOpacity = 0.3,
      layer2HoverOpacity = 0.38,
      enabled = true,
      elasticityEnabled = false,
      elasticity = 0.15,
      activationZonePx = 200,
      transitionMs = 200,
      mode = 'transform',
      preserveCenteredTranslate = false,
    },
    forwardedRef,
  ) {
    const rootElRef = useRef<HTMLElement | null>(null)
    const edgeFrameRef = useRef<number | null>(null)
    const elasticityFrameRef = useRef<number | null>(null)
    const leaveResetTimeoutRef = useRef<number | null>(null)
    const edgePendingRef = useRef({ x: 0, y: 0 })
    const pointerRef = useRef<{ x: number; y: number } | null>(null)
    const initialStyleRef = useRef<{
      transform: string
      transition: string
      willChange: string
    } | null>(null)

    const [isHovered, setIsHovered] = useState(false)
    const isReducedMotion = useReducedMotionPreference()

    const rootRef = useMemo(() => {
      return mergeRefs<HTMLElement>((value) => {
        rootElRef.current = value
      }, forwardedRef)
    }, [forwardedRef])

    const updateEdgeVars = useCallback((x: number, y: number) => {
      const root = rootElRef.current
      if (!root) {
        return
      }
      root.style.setProperty('--ger-mouse-x', String(x))
      root.style.setProperty('--ger-mouse-y', String(y))
    }, [])

    const captureInitialStyle = useCallback((element: HTMLElement) => {
      if (initialStyleRef.current) {
        return
      }
      initialStyleRef.current = {
        transform: element.style.transform,
        transition: element.style.transition,
        willChange: element.style.willChange,
      }
    }, [])

    const resetElasticity = useCallback(() => {
      const element = rootElRef.current
      const initialStyle = initialStyleRef.current
      if (!(element && initialStyle)) {
        return
      }

      element.style.transform = initialStyle.transform
      element.style.transition = initialStyle.transition
      element.style.willChange = initialStyle.willChange
      initialStyleRef.current = null
    }, [])

    const applyElasticity = useCallback(() => {
      elasticityFrameRef.current = null

      const element = rootElRef.current
      const pointer = pointerRef.current
      const canAnimate =
        enabled &&
        elasticityEnabled &&
        !isReducedMotion &&
        mode === 'transform' &&
        Number.isFinite(elasticity) &&
        elasticity >= 0 &&
        Number.isFinite(activationZonePx) &&
        activationZonePx > 0

      if (!(element && pointer && canAnimate)) {
        resetElasticity()
        return
      }

      const rect = element.getBoundingClientRect()
      if (!(rect.width > 0 && rect.height > 0)) {
        resetElasticity()
        return
      }

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = pointer.x - centerX
      const deltaY = pointer.y - centerY

      const edgeDistanceX = Math.max(0, Math.abs(deltaX) - rect.width / 2)
      const edgeDistanceY = Math.max(0, Math.abs(deltaY) - rect.height / 2)
      const edgeDistance = Math.hypot(edgeDistanceX, edgeDistanceY)

      if (edgeDistance > activationZonePx) {
        resetElasticity()
        return
      }

      const centerDistance = Math.hypot(deltaX, deltaY)
      if (centerDistance === 0) {
        resetElasticity()
        return
      }

      const fadeInFactor = 1 - edgeDistance / activationZonePx
      const normalizedX = deltaX / centerDistance
      const normalizedY = deltaY / centerDistance
      const stretchIntensity = Math.min(centerDistance / 300, 1) * elasticity * fadeInFactor

      const scaleX = Math.max(
        0.8,
        1 + Math.abs(normalizedX) * stretchIntensity * 0.3 - Math.abs(normalizedY) * stretchIntensity * 0.15,
      )
      const scaleY = Math.max(
        0.8,
        1 + Math.abs(normalizedY) * stretchIntensity * 0.3 - Math.abs(normalizedX) * stretchIntensity * 0.15,
      )

      const translateX = deltaX * elasticity * 0.1 * fadeInFactor
      const translateY = deltaY * elasticity * 0.1 * fadeInFactor

      captureInitialStyle(element)
      element.style.transition = `transform ${Math.max(0, transitionMs)}ms ease-out`
      element.style.willChange = 'transform'
      element.style.transform = preserveCenteredTranslate
        ? `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px), 0) scale(${scaleX}, ${scaleY})`
        : `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`
    }, [
      activationZonePx,
      captureInitialStyle,
      elasticity,
      elasticityEnabled,
      enabled,
      isReducedMotion,
      mode,
      preserveCenteredTranslate,
      resetElasticity,
      transitionMs,
    ])

    const updateEdgeFromPointer = useCallback(
      (element: HTMLElement, clientX: number, clientY: number) => {
        if (!edgeReflect) {
          return
        }

        const rect = element.getBoundingClientRect()
        if (!(rect.width && rect.height)) {
          return
        }

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const normalizedX = (clientX - centerX) / (rect.width / 2)
        const normalizedY = (clientY - centerY) / (rect.height / 2)

        edgePendingRef.current = {
          x: clamp(normalizedX, -1, 1),
          y: clamp(normalizedY, -1, 1),
        }

        if (edgeFrameRef.current !== null) {
          return
        }

        edgeFrameRef.current = window.requestAnimationFrame(() => {
          edgeFrameRef.current = null
          updateEdgeVars(edgePendingRef.current.x, edgePendingRef.current.y)
        })
      },
      [edgeReflect, updateEdgeVars],
    )

    useEffect(() => {
      if (!(enabled && elasticityEnabled) || isReducedMotion) {
        resetElasticity()
        return
      }

      if (typeof window === 'undefined') {
        return
      }

      const onPointerMove = (event: PointerEvent) => {
        pointerRef.current = { x: event.clientX, y: event.clientY }
        if (elasticityFrameRef.current !== null) {
          return
        }
        elasticityFrameRef.current = window.requestAnimationFrame(applyElasticity)
      }

      const onPointerExitViewport = () => {
        pointerRef.current = null
        if (elasticityFrameRef.current !== null) {
          window.cancelAnimationFrame(elasticityFrameRef.current)
          elasticityFrameRef.current = null
        }
        resetElasticity()
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('blur', onPointerExitViewport)
      document.addEventListener('mouseleave', onPointerExitViewport)

      return () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('blur', onPointerExitViewport)
        document.removeEventListener('mouseleave', onPointerExitViewport)
        if (elasticityFrameRef.current !== null) {
          window.cancelAnimationFrame(elasticityFrameRef.current)
          elasticityFrameRef.current = null
        }
        resetElasticity()
      }
    }, [applyElasticity, elasticityEnabled, enabled, isReducedMotion, resetElasticity])

    useEffect(() => {
      return () => {
        if (edgeFrameRef.current !== null) {
          window.cancelAnimationFrame(edgeFrameRef.current)
        }
        if (leaveResetTimeoutRef.current !== null) {
          window.clearTimeout(leaveResetTimeoutRef.current)
        }
        if (elasticityFrameRef.current !== null) {
          window.cancelAnimationFrame(elasticityFrameRef.current)
        }
        resetElasticity()
      }
    }, [resetElasticity])

    const handlePointerEnter = useCallback(
      (event: React.PointerEvent<HTMLElement>) => {
        if (!edgeReflect) {
          return
        }

        if (leaveResetTimeoutRef.current !== null) {
          window.clearTimeout(leaveResetTimeoutRef.current)
          leaveResetTimeoutRef.current = null
        }

        setIsHovered(true)
        updateEdgeFromPointer(event.currentTarget, event.clientX, event.clientY)
      },
      [edgeReflect, updateEdgeFromPointer],
    )

    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLElement>) => {
        updateEdgeFromPointer(event.currentTarget, event.clientX, event.clientY)
      },
      [updateEdgeFromPointer],
    )

    const handlePointerLeave = useCallback(() => {
      if (!edgeReflect) {
        return
      }

      setIsHovered(false)
      if (leaveResetTimeoutRef.current !== null) {
        window.clearTimeout(leaveResetTimeoutRef.current)
      }

      leaveResetTimeoutRef.current = window.setTimeout(() => {
        edgePendingRef.current = { x: 0, y: 0 }
        updateEdgeVars(0, 0)
        leaveResetTimeoutRef.current = null
      }, 310)
    }, [edgeReflect, updateEdgeVars])

    const gradients = useMemo(() => buildEdgeGradients(intensity), [intensity])

    const edgeOverlay = edgeReflect ? (
      <>
        <span
          aria-hidden="true"
          className="glass-surface-edge-overlay pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
          style={{
            borderRadius: 'inherit',
            padding: edgeThicknessPx,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            mixBlendMode: 'screen',
            background: gradients.layer1,
            opacity: isHovered ? layer1HoverOpacity : 0,
          }}
        />
        <span
          aria-hidden="true"
          className="glass-surface-edge-overlay pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
          style={{
            borderRadius: 'inherit',
            padding: edgeThicknessPx,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            mixBlendMode: 'overlay',
            background: gradients.layer2,
            opacity: isHovered ? layer2HoverOpacity : 0,
          }}
        />
      </>
    ) : null

    if (asChild) {
      const onlyChild = React.Children.count(children) === 1 ? children : null
      if (!(onlyChild && React.isValidElement<ChildInteractiveProps>(onlyChild))) {
        return (
          <div
            className={cn(
              interactiveRootClassName,
              clipContent ? 'overflow-hidden' : 'overflow-visible',
              className,
            )}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            ref={rootRef as React.Ref<HTMLDivElement>}
            style={style}
          >
            {edgeOverlay}
            {children}
          </div>
        )
      }

      const typedChild = onlyChild as React.ReactElement<
        ChildInteractiveProps & { ref?: React.Ref<HTMLElement> }
      >
      const childProps = typedChild.props
      const isReact19 = Number.parseInt(React.version.split('.')[0], 10) >= 19
      const existingRef = isReact19 ? childProps.ref : (typedChild as any).ref
      const mergedChildRef = useMemo(
        () => mergeRefs<HTMLElement>(existingRef, rootRef),
        [existingRef, rootRef],
      )
      const mergedStyle = {
        ...(childProps.style ?? {}),
        ...(style ?? {}),
      }

      return React.cloneElement(typedChild, {
        className: cn(
          interactiveRootClassName,
          clipContent ? 'overflow-hidden' : 'overflow-visible',
          childProps.className,
          className,
        ),
        style: mergedStyle,
        ref: mergedChildRef,
        onPointerEnter: callAll(childProps.onPointerEnter, handlePointerEnter),
        onPointerMove: callAll(childProps.onPointerMove, handlePointerMove),
        onPointerLeave: callAll(childProps.onPointerLeave, handlePointerLeave),
        children: (
          <>
            {edgeOverlay}
            {childProps.children}
          </>
        ),
      })
    }

    return (
      <div
        className={cn(
          interactiveRootClassName,
          clipContent ? 'overflow-hidden' : 'overflow-visible',
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={rootRef as React.Ref<HTMLDivElement>}
        style={style}
      >
        {edgeOverlay}
        {children}
      </div>
    )
  },
)

GlassSurfaceInteractive.displayName = 'GlassSurfaceInteractive'

export const GlassSurface = React.forwardRef<HTMLElement, GlassSurfaceProps>(
  function GlassSurface(props, forwardedRef) {
    if (props.variant === 'overlay') {
      return <GlassSurfaceOverlay {...props} ref={forwardedRef as React.Ref<HTMLDivElement>} />
    }

    return <GlassSurfaceInteractive {...props} ref={forwardedRef} />
  },
)

GlassSurface.displayName = 'GlassSurface'
