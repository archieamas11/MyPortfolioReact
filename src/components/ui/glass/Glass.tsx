import './glass.css'
import React, { forwardRef, type ComponentPropsWithoutRef, type ElementType, useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type GlassProps<T extends ElementType = 'div'> = {
  as?: T
  children?: React.ReactNode
  rootClassName?: string
  rootStyle?: React.CSSProperties
  enableLiquidAnimation?: boolean
  triggerAnimation?: boolean
} & ComponentPropsWithoutRef<T>

const Glass = forwardRef(function GlassInner<T extends ElementType = 'div'>(
  { as, children, className, rootClassName, rootStyle, enableLiquidAnimation = false, triggerAnimation = false, onClick, ...props }: GlassProps<T>,
  ref: React.ForwardedRef<any>,
) {
  const Component = (as || 'div') as ElementType
  const [isAnimating, setIsAnimating] = useState(false)
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (event: React.MouseEvent<any>) => {
      if (enableLiquidAnimation && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100

        setRipplePosition({ x, y })
        setIsAnimating(true)
        window.setTimeout(() => setIsAnimating(false), 800)
      }

      onClick?.(event)
    },
    [enableLiquidAnimation, onClick],
  )

  React.useEffect(() => {
    if (!triggerAnimation) return

    // Center the ripple for programmatic triggers
    setRipplePosition({ x: 50, y: 50 })
    setIsAnimating(true)
    const timer = window.setTimeout(() => setIsAnimating(false), 800)
    return () => clearTimeout(timer)
  }, [triggerAnimation])

  return (
    <>
      <div
        ref={containerRef}
        className={cn('glassContainer', rootClassName, isAnimating && 'glassAnimating')}
        style={rootStyle}
      >

        {isAnimating && (
          <div
            className="glassRipple"
            style={{
              left: `${ripplePosition.x}%`,
              top: `${ripplePosition.y}%`,
            }}
          />
        )}

        <Component {...props} ref={ref} onClick={handleClick} className={cn('glassContent', className)}>
          {children}
        </Component>
      </div>
    </>
  )
}) as <T extends ElementType = 'div'>(props: GlassProps<T> & { ref?: React.ForwardedRef<any> }) => React.ReactElement

(Glass as any).displayName = 'Glass'

export default Glass

