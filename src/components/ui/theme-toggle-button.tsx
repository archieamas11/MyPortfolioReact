import { useTheme } from 'next-themes'
import React from 'react'
import { SunIcon, MoonIcon } from 'lucide-react'

import { createAnimation } from '@/components/provider/theme-animations'
import { Button } from '@/components/ui/button'

interface ThemeToggleAnimationProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  isMobile?: boolean
}

export function ThemeToggleButton({
  className = '',
  size = 'md',
  isMobile = false,
}: ThemeToggleAnimationProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const styleId = 'theme-transition-styles'

  const updateStyles = React.useCallback((css: string) => {
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
    const switchTheme = () => {
      const next = (resolvedTheme ?? 'light') === 'light' ? 'dark' : 'light'
      setTheme(next)
    }

    if (typeof window === 'undefined') return

    // Skip animation on mobile or if View Transitions API is not supported
    if (isMobile || !document.startViewTransition) {
      switchTheme()
      return
    }

    const animation = createAnimation()
    updateStyles(animation.css)

    document.startViewTransition(switchTheme)
  }, [resolvedTheme, setTheme, updateStyles, isMobile])

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
      <div className="relative flex h-full w-5 items-center justify-center transition-all delay-75 duration-300 hover:scale-110 hover:rotate-10">
        {mounted ? (
          <>
            <SunIcon
              className={`transition-transform duration-300 ease-in-out ${resolvedTheme === 'dark' ? 'scale-0 -rotate-90' : 'scale-120 rotate-0'}`}
              size={iconSize}
              aria-hidden="true"
            />
            <MoonIcon
              className={`absolute transition-transform duration-300 ease-in-out ${
                resolvedTheme === 'dark' ? 'scale-120 rotate-0' : 'scale-0 -rotate-90'
              }`}
              size={iconSize}
              aria-hidden="true"
            />
          </>
        ) : (
          <div style={{ width: iconSize, height: iconSize }} />
        )}
      </div>
    </Button>
  )
}

export default ThemeToggleButton
