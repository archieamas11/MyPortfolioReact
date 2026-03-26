import * as React from 'react'
import { useElasticity, type UseElasticityOptions } from '@/hooks/useElasticity'

type ElasticityProps = {
  children: React.ReactElement<any>
  enabled?: boolean
  elasticity?: number
  activationZonePx?: number
  transitionMs?: number
  preserveCenteredTranslate?: boolean
} & Omit<UseElasticityOptions, 'enabled' | 'elasticity' | 'activationZonePx' | 'transitionMs'> & {
  className?: string
  style?: React.CSSProperties
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ; (ref as React.MutableRefObject<T | null>).current = value
      }
    }
  }
}

export function Elasticity({
  children,
  enabled = true,
  elasticity = 0.15,
  activationZonePx = 200,
  transitionMs,
  preserveCenteredTranslate = false,
  mode = 'individual',
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
        translate: `calc(-50% + ${elasticityOffset.x}px) calc(-50% + ${elasticityOffset.y}px)`,
        scale: `${elasticityScale.x} ${elasticityScale.y}`,
        transition: `translate ${effectiveTransitionMs}ms ease-out, scale ${effectiveTransitionMs}ms ease-out`,
        willChange: 'translate, scale',
      }
    }

    return elasticityStyle
  }, [
    enabled,
    elasticityOffset,
    elasticityScale,
    elasticityStyle,
    preserveCenteredTranslate,
  ])

  const childProps = children.props as { className?: string; style?: React.CSSProperties }
  const childStyle = childProps.style
  const mergedStyle = { ...(childStyle ?? {}), ...(style ?? {}), ...(animatedStyle ?? {}) }

  const existingChildRef = (children as any).ref as React.Ref<HTMLElement> | undefined
  const mergedRef = React.useMemo(() => mergeRefs<HTMLElement>(existingChildRef, targetRef), [existingChildRef])

  return React.cloneElement(children, {
    className: className ? [childProps.className, className].filter(Boolean).join(' ') : childProps.className,
    style: mergedStyle,
    ref: mergedRef,
  })
}

