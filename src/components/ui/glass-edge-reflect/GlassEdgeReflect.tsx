'use client'

import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export type GlassEdgeReflectProps = {
  children: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties

  // Thinner edges: this controls the mask's inner "cut-out" size.
  edgeThicknessPx?: number

  // Overall intensity multiplier (affects alpha values inside the gradient).
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
    edgeThicknessPx = 2,
    intensity = 10,
    layer1HoverOpacity = 0.3,
    layer2HoverOpacity = 0.38,
  },
  forwardedRef,
) {
  const rafRef = useRef<number | null>(null)
  const leaveResetTimeoutRef = useRef<number | null>(null)
  const [edgeFx, setEdgeFx] = useState({ x: 0, y: 0 })
  const pendingRef = useRef(edgeFx)
  const [isHovered, setIsHovered] = useState(false)

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
      setEdgeFx(pendingRef.current)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
      if (leaveResetTimeoutRef.current !== null) window.clearTimeout(leaveResetTimeoutRef.current)
    }
  }, [])

  const computeBorderGradient = useMemo(() => {
    const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

    const mouseOffsetX = edgeFx.x * 60
    const mouseOffsetY = edgeFx.y * 60

    const alphaA1 = clamp01((0.12 + Math.abs(mouseOffsetX) * 0.008) * intensity)
    const alphaB1 = clamp01((0.4 + Math.abs(mouseOffsetX) * 0.012) * intensity)
    const alphaA2 = clamp01((0.32 + Math.abs(mouseOffsetX) * 0.008) * intensity)
    const alphaB2 = clamp01((0.6 + Math.abs(mouseOffsetX) * 0.012) * intensity)

    const stopA = Math.max(10, 33 + mouseOffsetY * 0.3)
    const stopB = Math.min(90, 66 + mouseOffsetY * 0.4)

    const angle = 135 + mouseOffsetX * 1.2

    const layer1 = `linear-gradient(
      ${angle}deg,
      rgba(255, 255, 255, 0.0) 0%,
      rgba(255, 255, 255, ${alphaA1}) ${stopA}%,
      rgba(255, 255, 255, ${alphaB1}) ${stopB}%,
      rgba(255, 255, 255, 0.0) 100%
    )`

    const layer2 = `linear-gradient(
      ${angle}deg,
      rgba(255, 255, 255, 0.0) 0%,
      rgba(255, 255, 255, ${alphaA2}) ${stopA}%,
      rgba(255, 255, 255, ${alphaB2}) ${stopB}%,
      rgba(255, 255, 255, 0.0) 100%
    )`

    return { layer1, layer2 }
  }, [edgeFx.x, edgeFx.y, intensity])
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
          background: computeBorderGradient.layer1,
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
          background: computeBorderGradient.layer2,
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
      setEdgeFx({ x: 0, y: 0 })
      leaveResetTimeoutRef.current = null
    }, 310)
  }

  if (asChild) {
    const onlyChild = React.Children.only(children)

    if (!React.isValidElement(onlyChild)) {
      throw new Error('GlassEdgeReflect(asChild) expects exactly one React element child.')
    }

    const childProps = onlyChild.props as { className?: string; style?: React.CSSProperties }
    const existingChildRef = (onlyChild as any).ref as React.Ref<HTMLElement> | undefined
    const mergedRef = mergeRefs<HTMLElement>(existingChildRef, forwardedRef)
    const mergedStyle = { ...(childProps.style ?? {}), ...(style ?? {}) }

    return React.cloneElement(onlyChild, {
      className: cn('group relative overflow-hidden', childProps.className, className),
      style: mergedStyle,
      ref: mergedRef,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        // Call existing handler first for predictable behavior.
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
      className={cn('group relative overflow-hidden', className)}
      style={style}
      ref={forwardedRef as React.Ref<HTMLDivElement>}
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

