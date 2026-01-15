import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createAnimation } from "./theme-animations"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Check if View Transitions API is supported
const supportsViewTransitions = typeof document !== "undefined" && "startViewTransition" in document

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const styleSheetRef = useRef<HTMLStyleElement | null>(null)
  const previousResolvedThemeRef = useRef<"dark" | "light" | null>(null)
  const isInitialMountRef = useRef(true)

  // Check if mobile and inject animation styles (only on desktop)
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches
      setIsMobile(mobile)
      return mobile
    }

    // Initial check
    const mobile = checkMobile()

    // Listen for resize to update mobile state
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener("resize", handleResize)

    // Inject animation styles only if desktop and View Transitions are supported
    if (supportsViewTransitions && !mobile) {
      const animation = createAnimation()
      
      // Remove existing style sheet if it exists
      if (styleSheetRef.current) {
        styleSheetRef.current.remove()
      }

      // Create and inject style sheet
      const styleSheet = document.createElement("style")
      styleSheet.id = "theme-transition-styles"
      styleSheet.textContent = animation.css
      document.head.appendChild(styleSheet)
      styleSheetRef.current = styleSheet

      // Set view-transition-name on root element
      const root = document.documentElement
      root.style.viewTransitionName = "root"
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      if (styleSheetRef.current) {
        styleSheetRef.current.remove()
        styleSheetRef.current = null
      }
    }
  }, [])

  // Safely access localStorage after mount
  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    if (storedTheme && ["dark", "light", "system"].includes(storedTheme)) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const applyTheme = (themeToApply: "dark" | "light") => {
      root.classList.remove("light", "dark")
      root.classList.add(themeToApply)
    }

    const getResolvedTheme = (): "dark" | "light" => {
      if (theme === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        return mediaQuery.matches ? "dark" : "light"
      }
      return theme
    }

    const resolvedTheme = getResolvedTheme()

    // Only animate if theme actually changed, it's not the initial mount, and it's desktop
    const shouldAnimate = 
      !isInitialMountRef.current &&
      previousResolvedThemeRef.current !== null &&
      previousResolvedThemeRef.current !== resolvedTheme &&
      !isMobile &&
      supportsViewTransitions

    if (shouldAnimate) {
      document.startViewTransition(() => {
        applyTheme(resolvedTheme)
      })
    } else {
      applyTheme(resolvedTheme)
    }

    previousResolvedThemeRef.current = resolvedTheme
    isInitialMountRef.current = false

    if (theme === "system") {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? "dark" : "light"
        const shouldAnimateSystem = 
          supportsViewTransitions && 
          previousResolvedThemeRef.current !== newSystemTheme &&
          !isMobile
        
        if (shouldAnimateSystem) {
          document.startViewTransition(() => {
            applyTheme(newSystemTheme)
          })
          previousResolvedThemeRef.current = newSystemTheme
        } else {
          applyTheme(newSystemTheme)
          previousResolvedThemeRef.current = newSystemTheme
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, mounted])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}