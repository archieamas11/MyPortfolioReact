import { cn } from '@/lib/utils'
import React, { useRef, useState, useContext, createContext, useCallback, useMemo, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useIsMobile } from '@/hooks/use-mobile'

interface SpotlightProps {
  children: React.ReactNode
  className?: string
  ProximitySpotlight?: boolean
  HoverFocusSpotlight?: boolean
  CursorFlowGradient?: boolean
  disabled?: boolean
}

interface SpotlightItemProps {
  children: React.ReactNode
  className?: string
}

interface SpotLightContextType {
  ProximitySpotlight: boolean
  HoverFocusSpotlight: boolean
  CursorFlowGradient: boolean
  isMobile: boolean
  disabled: boolean
}

const SpotLightContext = createContext<SpotLightContextType | undefined>(undefined)

export const useSpotlight = () => {
  const context = useContext(SpotLightContext)
  if (!context) {
    throw new Error('useSpotlight must be used within a SpotlightProvider')
  }
  return context
}

export const Spotlight = ({
  children,
  className,
  ProximitySpotlight = true,
  HoverFocusSpotlight = false,
  CursorFlowGradient = true,
  disabled = false,
}: SpotlightProps) => {
  const isMobile = useIsMobile()

  return (
    <SpotLightContext.Provider
      value={{
        ProximitySpotlight,
        HoverFocusSpotlight,
        CursorFlowGradient,
        isMobile,
        disabled,
      }}
    >
      <div className={cn('group relative z-10', className)}>{children}</div>
    </SpotLightContext.Provider>
  )
}

export function SpotLightItem({ children, className }: SpotlightItemProps) {
  const { HoverFocusSpotlight, ProximitySpotlight, CursorFlowGradient, isMobile, disabled } = useSpotlight()
  const { resolvedTheme } = useTheme()
  const boxWrapper = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || disabled) return

      if (!boxWrapper.current) return

      const rect = boxWrapper.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePosition({ x, y })
    },
    [isMobile, disabled],
  )

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && !disabled && CursorFlowGradient) {
      setIsHovered(true)
    }
  }, [isMobile, disabled, CursorFlowGradient])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile && !disabled) {
      setIsHovered(false)
      setMousePosition(null)
    }
  }, [isMobile, disabled])

  useEffect(() => {
    if (isMobile || disabled) {
      setIsHovered(false)
      setMousePosition(null)
    }
  }, [isMobile, disabled])

  // Default to light mode if theme not resolved yet
  const isDark = resolvedTheme === 'dark'

  // Memoize theme-aware colors
  const colors = useMemo(
    () => ({
      cursorGradient: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)',
      hoverFocus: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.32)',
      proximity: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.28)',
      bgColor: isDark ? 'bg-[#ffffff15]' : 'bg-[#00000015]',
    }),
    [isDark],
  )

  // If mobile, render without effects
  if (isMobile || disabled) {
    return (
      <div ref={boxWrapper} className={cn('relative overflow-hidden rounded-lg p-[2px]', colors.bgColor, className)}>
        {children}
      </div>
    )
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={boxWrapper}
      className={cn('relative overflow-hidden rounded-lg p-[2px]', colors.bgColor, className)}
    >
      {/* Cursor Flow Gradient */}
      {CursorFlowGradient && isHovered && mousePosition && (
        <div
          className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `
              radial-gradient(
                300px circle at ${mousePosition.x}px ${mousePosition.y}px,
                ${colors.cursorGradient},
                transparent 70%
              )
            `,
          }}
        />
      )}

      {/* Hover Focus Spotlight */}
      {HoverFocusSpotlight && mousePosition && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-lg bg-fixed opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, ${colors.hoverFocus} 0%, transparent 40%, transparent) fixed`,
          }}
        />
      )}

      {/* Proximity Spotlight */}
      {ProximitySpotlight && mousePosition && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-lg bg-fixed transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, ${colors.proximity} 0%, transparent 50%, transparent) fixed`,
          }}
        />
      )}

      {children}
    </div>
  )
}

type SpotlightCardProps = {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const isMobile = useIsMobile()

  // Disable spotlight effects on mobile
  if (isMobile) {
    return <div className={cn('relative h-full overflow-hidden rounded-3xl bg-slate-800 p-px', className)}>{children}</div>
  }

  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-3xl bg-slate-800 p-px',
        'before:pointer-events-none before:absolute before:-top-40 before:-left-40 before:z-10 before:h-80 before:w-80',
        'before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)]',
        'before:rounded-full before:bg-slate-400 before:opacity-0 before:blur-[100px]',
        'before:transition-opacity before:duration-500 group-hover:before:opacity-100',
        'after:pointer-events-none after:absolute after:-top-48 after:-left-48 after:z-30 after:h-96 after:w-96',
        'after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)]',
        'after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-[100px]',
        'after:transition-opacity after:duration-500 hover:after:opacity-10',
        className,
      )}
    >
      {children}
    </div>
  )
}

// Demo component
export default function SpotlightDemo() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="mb-12 text-center text-4xl font-bold text-white">Improved Spotlight Effects</h1>

        <Spotlight className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SpotLightItem>
            <div className="relative h-48 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Cursor Flow</h3>
              <p className="text-sm text-slate-400">Smooth gradient follows your cursor with improved performance</p>
            </div>
          </SpotLightItem>

          <SpotLightItem>
            <div className="relative h-48 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Proximity Effect</h3>
              <p className="text-sm text-slate-400">Creates an engaging hover experience</p>
            </div>
          </SpotLightItem>

          <SpotLightItem>
            <div className="relative h-48 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Mobile Optimized</h3>
              <p className="text-sm text-slate-400">Effects disabled on mobile for better performance</p>
            </div>
          </SpotLightItem>
        </Spotlight>

        <Spotlight HoverFocusSpotlight={true} ProximitySpotlight={true} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SpotLightItem>
            <div className="relative h-64 rounded-lg bg-gradient-to-br from-purple-900/50 to-slate-900 p-6">
              <h3 className="mb-3 text-2xl font-bold text-white">All Effects Combined</h3>
              <p className="text-slate-300">Hover to see the full experience with all spotlight effects enabled</p>
            </div>
          </SpotLightItem>

          <SpotLightItem>
            <div className="relative h-64 rounded-lg bg-gradient-to-br from-blue-900/50 to-slate-900 p-6">
              <h3 className="mb-3 text-2xl font-bold text-white">Smooth Animations</h3>
              <p className="text-slate-300">Using RAF for buttery smooth 60fps performance</p>
            </div>
          </SpotLightItem>
        </Spotlight>

        <div className="mt-8 text-center text-sm text-slate-400">
          Resize your browser to mobile width (&lt;768px) to see effects disable automatically
        </div>
      </div>
    </div>
  )
}
