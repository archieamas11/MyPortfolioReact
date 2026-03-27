import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export type GlassEdgeReflectProps = {
  children: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties
  /**
   * Controls whether child content is clipped to the component bounds.
   * Keep this `true` for strict card clipping, set to `false` for floating UI
   * like tooltips/popovers that need to escape the container.
   */
  clipContent?: boolean
  // Thinner edges glass redlect edges.
  edgeThicknessPx?: number
  // Overall intensity multiplier.
  intensity?: number
  // Hover fade-in strengths for the two edge layers.
  layer1HoverOpacity?: number
  layer2HoverOpacity?: number
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') ref(value)
      else (ref as React.MutableRefObject<T | null>).current = value
    }
  }
}

export const GlassEdgeReflect = React.forwardRef<HTMLElement, GlassEdgeReflectProps>(function GlassEdgeReflect(
  {
    children,
    asChild = false,
    className,
    style,
    clipContent = true,
    edgeThicknessPx = 1,
    intensity = 10,
    layer1HoverOpacity = 0.3,
    layer2HoverOpacity = 0.38,
  },
  forwardedRef,
) {
  const rafRef = useRef<number | null>(null)
  const leaveResetTimeoutRef = useRef<number | null>(null)
  const pendingRef = useRef({ x: 0, y: 0 })
  const rootElRef = useRef<HTMLElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const asChildExistingRef = useMemo<React.Ref<HTMLElement> | undefined>(() => {
    if (!asChild) return undefined
    let extractedRef: React.Ref<HTMLElement> | undefined
    React.Children.forEach(children, (child, index) => {
      if (index === 0 && React.isValidElement(child)) {
        extractedRef = (child as any).ref
      }
    })
    return extractedRef
  }, [asChild, children])

  const stableMergedRef = useMemo(() => {
    return mergeRefs<HTMLElement>(
      (value) => {
        rootElRef.current = value
      },
      asChildExistingRef,
      forwardedRef,
    )
  }, [asChildExistingRef, forwardedRef])

  const applyEdgeVars = useCallback((x: number, y: number) => {
    const root = rootElRef.current
    if (!root) return
    root.style.setProperty('--ger-mouse-x', String(x))
    root.style.setProperty('--ger-mouse-y', String(y))
  }, [])

  const updateEdgeFxFromEvent = useCallback((el: HTMLElement, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const nx = (clientX - centerX) / (rect.width / 2)
    const ny = (clientY - centerY) / (rect.height / 2)

    pendingRef.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) }

    if (rafRef.current !== null) return
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      applyEdgeVars(pendingRef.current.x, pendingRef.current.y)
    })
  }, [applyEdgeVars])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
      if (leaveResetTimeoutRef.current !== null) window.clearTimeout(leaveResetTimeoutRef.current)
    }
  }, [])

  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
  const maxOffset = 60
  const alphaA1 = clamp01((0.12 + maxOffset * 0.008) * intensity)
  const alphaB1 = clamp01((0.4 + maxOffset * 0.012) * intensity)
  const alphaA2 = clamp01((0.32 + maxOffset * 0.008) * intensity)
  const alphaB2 = clamp01((0.6 + maxOffset * 0.012) * intensity)

  const layer1Gradient = `linear-gradient(
    calc(135deg + (var(--ger-mouse-x, 0) * 72deg)),
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, ${alphaA1}) max(10%, calc(33% + (var(--ger-mouse-y, 0) * 18%))),
    rgba(255, 255, 255, ${alphaB1}) min(90%, calc(66% + (var(--ger-mouse-y, 0) * 24%))),
    rgba(255, 255, 255, 0.0) 100%
  )`
  const layer2Gradient = `linear-gradient(
    calc(135deg + (var(--ger-mouse-x, 0) * 72deg)),
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, ${alphaA2}) max(10%, calc(33% + (var(--ger-mouse-y, 0) * 18%))),
    rgba(255, 255, 255, ${alphaB2}) min(90%, calc(66% + (var(--ger-mouse-y, 0) * 24%))),
    rgba(255, 255, 255, 0.0) 100%
  )`

  const edgeOverlay = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
        style={{
          borderRadius: 'inherit',
          padding: edgeThicknessPx,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          mixBlendMode: 'screen',
          background: layer1Gradient,
          opacity: isHovered ? layer1HoverOpacity : 0,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
        style={{
          borderRadius: 'inherit',
          padding: edgeThicknessPx,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          mixBlendMode: 'overlay',
          background: layer2Gradient,
          opacity: isHovered ? layer2HoverOpacity : 0,
        }}
      />
    </>
  )

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (leaveResetTimeoutRef.current !== null) {
      window.clearTimeout(leaveResetTimeoutRef.current)
      leaveResetTimeoutRef.current = null
    }

    setIsHovered(true)
    updateEdgeFxFromEvent(e.currentTarget, e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    updateEdgeFxFromEvent(e.currentTarget, e.clientX, e.clientY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (leaveResetTimeoutRef.current !== null) window.clearTimeout(leaveResetTimeoutRef.current)
    leaveResetTimeoutRef.current = window.setTimeout(() => {
      pendingRef.current = { x: 0, y: 0 }
      applyEdgeVars(0, 0)
      leaveResetTimeoutRef.current = null
    }, 310)
  }

  if (asChild) {
    const onlyChild = React.Children.only(children)

    if (!React.isValidElement(onlyChild)) {
      throw new Error('GlassEdgeReflect(asChild) expects exactly one React element child.')
    }

    const childProps = onlyChild.props as { className?: string; style?: React.CSSProperties }
    const mergedStyle = { ...(childProps.style ?? {}), ...(style ?? {}) }

    return React.cloneElement(onlyChild, {
      className: cn(
        'group relative',
        clipContent ? 'overflow-hidden' : 'overflow-visible',
        childProps.className,
        className,
      ),
      style: mergedStyle,
      ref: stableMergedRef,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        ; (onlyChild.props as { onMouseEnter?: (ev: React.MouseEvent<HTMLElement>) => void }).onMouseEnter?.(e)
        handleMouseEnter(e)
      },
      onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
        ; (onlyChild.props as { onMouseMove?: (ev: React.MouseEvent<HTMLElement>) => void }).onMouseMove?.(e)
        handleMouseMove(e)
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        ; (onlyChild.props as { onMouseLeave?: (ev: React.MouseEvent<HTMLElement>) => void }).onMouseLeave?.(e)
        handleMouseLeave()
      },
    } as any, (
      <>
        {edgeOverlay}
        {(onlyChild.props as { children?: React.ReactNode }).children}
      </>
    ))
  }

  return (
    <div
      className={cn('group relative', clipContent ? 'overflow-hidden' : 'overflow-visible', className)}
      style={style}
      ref={stableMergedRef as React.Ref<HTMLDivElement>}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {edgeOverlay}
      {children}
    </div>
  )
})

GlassEdgeReflect.displayName = 'GlassEdgeReflect'
