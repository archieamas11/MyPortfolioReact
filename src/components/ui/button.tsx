import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import './style/glass-animation.scss'
import { cn } from '@/lib/utils'

const GLASS_CLICK_ANIMATION_MS = 800

const buttonVariants = cva(
  "cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs',
        outline:
          'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'glass isolate',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-14 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  onClick,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const [glassAnimating, setGlassAnimating] = React.useState(false)
  const rippleIdRef = React.useRef(0)
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([])

  const isGlass = variant === 'glass'

  const startGlassClickAnimation = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isGlass || disabled) return
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = ++rippleIdRef.current

      if (!asChild) {
        setRipples((prev) => [...prev, { id, x, y }])
        window.setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, GLASS_CLICK_ANIMATION_MS)
      }

      setGlassAnimating(true)
      window.setTimeout(() => setGlassAnimating(false), GLASS_CLICK_ANIMATION_MS)
    },
    [isGlass, disabled, asChild],
  )

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    startGlassClickAnimation(e)
    onClick?.(e as React.MouseEvent<HTMLButtonElement>)
  }

  const glassLayerClass = cn(
    isGlass && 'glassContainer',
    isGlass && glassAnimating && (asChild ? 'glassAnimatingHost' : 'glassAnimating'),
  )

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), glassLayerClass)}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {isGlass && !asChild ? (
        <>
          <span className="glassOverlay" aria-hidden />
          <span className="glassSpecular" aria-hidden />
          {ripples.map((r) => (
            <span
              key={r.id}
              className="glassRipple"
              style={{ left: r.x, top: r.y }}
              aria-hidden
            />
          ))}
          <span className="glassContent">{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
