import { useTheme } from 'next-themes'
import React from 'react'
import { SunIcon, MoonIcon } from 'lucide-react'

import { type AnimationStart, type AnimationVariant, createAnimation } from '@/components/provider/theme-animations'
import { Button } from '@/components/ui/button'

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant
  start?: AnimationStart
  showLabel?: boolean
  url?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ThemeToggleButton({
  variant = 'circle-blur',
  start = 'top-left',
  showLabel = false,
  url = '',
  className = '',
  size = 'md',
}: ThemeToggleAnimationProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const styleId = 'theme-transition-styles'

  const updateStyles = React.useCallback((css: string, _name: string) => {
    if (typeof window === 'undefined') return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(variant, start, url)

    updateStyles(animation.css, animation.name)

    if (typeof window === 'undefined') return

    const switchTheme = () => {
      const next = (resolvedTheme ?? 'light') === 'light' ? 'dark' : 'light'
      setTheme(next)
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [resolvedTheme, setTheme, variant, start, url, updateStyles])

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      name="Theme Toggle Button"
      aria-label="Toggle theme"
      aria-pressed={resolvedTheme === 'dark'}
      className={`group ${className}`}
    >
      <span className="sr-only">Theme Toggle </span>
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Avoid hydration mismatch: hide icons until mounted */}
        {mounted ? (
          <>
            <SunIcon
              className={`transition-transform duration-300 ease-in-out ${resolvedTheme === 'dark' ? 'scale-0 -rotate-90' : 'scale-120 rotate-0'}`}
              size={iconSize}
            />
            <MoonIcon
              className={`absolute transition-transform duration-300 ease-in-out ${
                resolvedTheme === 'dark' ? 'scale-120 rotate-0' : 'scale-0 -rotate-90'
              }`}
              size={iconSize}
            />
          </>
        ) : (
          // Placeholder ensures consistent sizing pre-mount
          <div style={{ width: iconSize, height: iconSize }} />
        )}
      </div>
      {showLabel && (
        <>
          <span className="absolute -top-10 hidden rounded-full border px-2 group-hover:block">variant = {variant}</span>
          <span className="absolute -bottom-10 hidden rounded-full border px-2 group-hover:block">start = {start}</span>
        </>
      )}
    </Button>
  )
}

export default ThemeToggleButton
