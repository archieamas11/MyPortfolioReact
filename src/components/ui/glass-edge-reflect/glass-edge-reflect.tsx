import React from 'react'

import { GlassSurface } from '@/components/ui/glass-surface'

export interface GlassEdgeReflectProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
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
  style?: React.CSSProperties
}

export const GlassEdgeReflect = React.forwardRef<HTMLElement, GlassEdgeReflectProps>(
  function GlassEdgeReflect(
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
    return (
      <GlassSurface
        asChild={asChild}
        className={className}
        clipContent={clipContent}
        edgeReflect={true}
        edgeThicknessPx={edgeThicknessPx}
        intensity={intensity}
        layer1HoverOpacity={layer1HoverOpacity}
        layer2HoverOpacity={layer2HoverOpacity}
        ref={forwardedRef}
        style={style}
        variant="interactive"
      >
        {children}
      </GlassSurface>
    )
  },
)

GlassEdgeReflect.displayName = 'GlassEdgeReflect'
