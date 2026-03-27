import * as React from 'react'
import { useElasticity, type UseElasticityOptions } from '@/hooks/useElasticity'
import {
  GlassEdgeReflect,
  type GlassEdgeReflectProps,
} from '@/components/ui/glass-edge-reflect/GlassEdgeReflect'

type ElasticityProps = {
  children: React.ReactElement<any>
  enabled?: boolean
  elasticity?: number
  activationZonePx?: number
  transitionMs?: number
  /**
   * When true the element is assumed to be centred via
   * `top:50%; left:50%; transform:translate(-50%,-50%)`.
   * The elastic translate is composited on top of that centering offset so the
   * element doesn't jump away from its intended position. This is just workaround hehe
   */
  preserveCenteredTranslate?: boolean
  /** Default is true. If false it will disable the flass reflect effect */
  withGlassEdgeReflect?: boolean
  glassEdgeReflectProps?: Omit<GlassEdgeReflectProps, 'children' | 'asChild' | 'className' | 'style'>
} & Omit<UseElasticityOptions, 'enabled' | 'elasticity' | 'activationZonePx' | 'transitionMs'> & {
  className?: string
  style?: React.CSSProperties
}

export function Elasticity({
  children,
  enabled = true,
  elasticity = 0.15,
  activationZonePx = 200,
  transitionMs,
  preserveCenteredTranslate = false,
  mode = 'transform',
  withGlassEdgeReflect = true,
  glassEdgeReflectProps,
  className,
  style,
}: ElasticityProps) {
  const targetRef = React.useRef<HTMLElement | null>(null)

  const effectiveTransitionMs = transitionMs ?? 200

  const { elasticityOffset, elasticityScale, elasticityStyle } = useElasticity(targetRef, {
    enabled,
    elasticity,
    activationZonePx,
    transitionMs,
    mode,
  })

  const animatedStyle: React.CSSProperties | undefined = React.useMemo(() => {
    if (!enabled) return undefined

    if (preserveCenteredTranslate) {
      if (!elasticityOffset || !elasticityScale) return undefined

      return {
        transform: `translate3d(calc(-50% + ${elasticityOffset.x}px), calc(-50% + ${elasticityOffset.y}px), 0) scale(${elasticityScale.x}, ${elasticityScale.y})`,
        transition: `transform ${effectiveTransitionMs}ms ease-out`,
        willChange: 'transform',
      }
    }

    return elasticityStyle
  }, [
    enabled,
    effectiveTransitionMs,
    elasticityOffset,
    elasticityScale,
    elasticityStyle,
    preserveCenteredTranslate,
  ])

  const childProps = children.props as { className?: string; style?: React.CSSProperties }
  const mergedClassName = React.useMemo(() => {
    return className ? [childProps.className, className].filter(Boolean).join(' ') : childProps.className
  }, [childProps.className, className])

  const mergedStyle = React.useMemo(() => {
    return { ...(childProps.style ?? {}), ...(style ?? {}), ...(animatedStyle ?? {}) }
  }, [animatedStyle, childProps.style, style])

  const existingChildRef = (children as any).ref as React.Ref<HTMLElement> | undefined
  const mergedRef = React.useMemo(() => {
    return (value: HTMLElement | null) => {
      if (typeof existingChildRef === 'function') {
        existingChildRef(value)
      } else if (existingChildRef) {
        ; (existingChildRef as React.MutableRefObject<HTMLElement | null>).current = value
      }
      targetRef.current = value
    }
  }, [existingChildRef])

  const animatedChild = React.useMemo(() => {
    return React.cloneElement(children, {
      className: mergedClassName,
      style: mergedStyle,
      ref: mergedRef,
    })
  }, [children, mergedClassName, mergedStyle, mergedRef])

  if (!withGlassEdgeReflect) return animatedChild

  return (
    <GlassEdgeReflect asChild {...glassEdgeReflectProps}>
      {animatedChild}
    </GlassEdgeReflect>
  )
}
