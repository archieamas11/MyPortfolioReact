import { cn } from '@/lib/utils'
import React, { useRef, useState, useContext, createContext } from 'react'
import { useTheme } from 'next-themes'

interface SpotlightProps {
  children: React.ReactNode
  className?: string
  ProximitySpotlight?: boolean
  HoverFocusSpotlight?: boolean
  CursorFlowGradient?: boolean
}
interface SpotlightItemProps {
  children: React.ReactNode
  className?: string
}

interface SpotLightContextType {
  ProximitySpotlight: boolean
  HoverFocusSpotlight: boolean
  CursorFlowGradient: boolean
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
}: SpotlightProps) => {
  return (
    <SpotLightContext.Provider
      value={{
        ProximitySpotlight,
        HoverFocusSpotlight,
        CursorFlowGradient,
      }}
    >
      <div className={cn('group relative z-10', className)}>{children}</div>
    </SpotLightContext.Provider>
  )
}
export function SpotLightItem({ children, className }: SpotlightItemProps) {
  const { HoverFocusSpotlight, ProximitySpotlight, CursorFlowGradient } = useSpotlight()
  const { resolvedTheme } = useTheme()
  const boxWrapper = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = React.useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })
  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  const [overlayColor, setOverlayColor] = useState({ x: 0, y: 0 })
  const handleMouemove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()

    const x = clientX - left
    const y = clientY - top

    setOverlayColor({ x, y })
  }

  // Default to light mode if theme not resolved yet
  const isDark = resolvedTheme === 'dark'

  // Theme-aware colors
  const cursorGradientColor = isDark ? 'rgba(255, 255, 255, 0.137)' : 'rgba(0, 0, 0, 0.15)'

  const hoverFocusColor = isDark ? '#ffffff76' : '#00000076'

  const proximityColor = isDark ? '#ffffff6e' : '#0000006e'

  const bgColor = isDark ? 'bg-[#ffffff15]' : 'bg-[#00000015]'

  return (
    <div
      onMouseMove={handleMouemove}
      onMouseEnter={() => CursorFlowGradient && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={boxWrapper}
      className={cn('relative overflow-hidden rounded-lg p-[2px]', bgColor, className)}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute z-50 h-full w-full rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: `
            radial-gradient(
              250px circle at ${overlayColor.x}px ${overlayColor.y}px,
              ${cursorGradientColor},
              transparent 80%
            )
          `,
          }}
        />
      )}
      {HoverFocusSpotlight && mousePosition.x !== null && mousePosition.y !== null && (
        <div
          className="absolute inset-0 z-10 rounded-lg bg-fixed opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${hoverFocusColor} 0%,transparent 20%,transparent) fixed `,
          }}
        ></div>
      )}
      {ProximitySpotlight && mousePosition.x !== null && mousePosition.y !== null && (
        <div
          className="absolute inset-0 z-0 rounded-lg bg-fixed"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${proximityColor} 0%,transparent 20%,transparent) fixed`,
          }}
        ></div>
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
  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl bg-slate-800 p-px before:pointer-events-none before:absolute before:-top-40 before:-left-40 before:z-10 before:h-80 before:w-80 before:translate-x-(--mouse-x) before:translate-y-(--mouse-y) before:rounded-full before:bg-slate-400 before:opacity-0 before:blur-[100px] before:transition-opacity before:duration-500 group-hover:before:opacity-100 after:pointer-events-none after:absolute after:-top-48 after:-left-48 after:z-30 after:h-96 after:w-96 after:translate-x-(--mouse-x) after:translate-y-(--mouse-y) after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-[100px] after:transition-opacity after:duration-500 hover:after:opacity-10 ${className}`}
    >
      {children}
    </div>
  )
}
