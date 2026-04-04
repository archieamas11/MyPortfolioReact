import type { SVGMotionProps } from 'motion/react'
import { useTheme } from 'next-themes'
import type React from 'react'
import type { MouseEventHandler } from 'react'
import { memo, useEffect, useRef } from 'react'
import { defaultPatterns, type WebHaptics } from 'web-haptics'
import { MoonIcon, type MoonIconHandle } from '@/components/icons/moon'
import { SunIcon, type SunIconHandle } from '@/components/icons/sun'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Separator from './components/seperator'
import { navigationItems } from './constants'
import type { NavItem, SectionId } from './types'

interface IconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

type NavIconProps = Omit<SVGMotionProps<SVGSVGElement>, 'onMouseEnter' | 'onMouseLeave'> & {
  size?: number
  onMouseEnter?: MouseEventHandler<SVGSVGElement>
  onMouseLeave?: MouseEventHandler<SVGSVGElement>
}

interface ResolvedNavigationIcon {
  Icon: React.ForwardRefExoticComponent<NavIconProps & React.RefAttributes<IconHandle>>
  isThemeToggle: boolean
}

function resolveNavigationIcon(item: NavItem, theme: string): ResolvedNavigationIcon | null {
  const isThemeToggle = item.id === 'theme-toggle-nav'

  if (isThemeToggle) {
    return {
      Icon: (theme === 'dark' ? MoonIcon : SunIcon) as React.ForwardRefExoticComponent<
        NavIconProps & React.RefAttributes<IconHandle>
      >,
      isThemeToggle,
    }
  }

  if (!item.icon) {
    return null
  }

  return {
    Icon: item.icon as React.ForwardRefExoticComponent<NavIconProps & React.RefAttributes<IconHandle>>,
    isThemeToggle,
  }
}

function canRenderNavigationItem(item: NavItem, isThemeToggle: boolean): boolean {
  if (!item.ariaLabel) {
    return false
  }
  if (isThemeToggle) {
    return true
  }
  return Boolean(item.href && item.label)
}

function getIconScale(isMini: boolean, isActive: boolean): number {
  if (!isMini) {
    return isActive ? 1.2 : 1
  }
  return isActive ? 0.95 : 0.833
}

const NavigationItem = memo(
  ({
    item,
    isActive,
    isMini,
    isMobile,
    onClick,
    haptics,
  }: {
    item: NavItem
    isActive: boolean
    isMini: boolean
    isMobile: boolean
    onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => void
    haptics: WebHaptics
  }) => {
    const { theme, setTheme } = useTheme()
    const iconRef = useRef<IconHandle | SunIconHandle | MoonIconHandle>(null)
    const prevIsActiveRef = useRef<boolean>(isActive)

    useEffect(() => {
      if (item.type === 'separator') {
        return
      }
      if (!isActive) {
        prevIsActiveRef.current = false
        return
      }

      // Trigger only on the transition to "active" to avoid spamming while scrolling.
      const shouldTrigger = prevIsActiveRef.current === false
      prevIsActiveRef.current = true

      if (!shouldTrigger) {
        return
      }
    }, [item.type, isActive])

    if (item.type === 'separator') {
      return <Separator isMini={isMini} />
    }

    const resolvedIcon = resolveNavigationIcon(item, theme ?? 'light')
    if (!resolvedIcon) {
      return null
    }

    const { Icon, isThemeToggle } = resolvedIcon
    if (!canRenderNavigationItem(item, isThemeToggle)) {
      return null
    }

    const showTooltip = !(isActive || isMobile)

    const handleMouseEnter = () => {
      if (!isActive) {
        iconRef.current?.startAnimation()
      }
    }

    const handleMouseLeave = () => {
      if (!isActive) {
        iconRef.current?.stopAnimation()
      }
    }

    const iconScale = getIconScale(isMini, isActive)

    const onItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isThemeToggle) {
        e.preventDefault()
        haptics.trigger(defaultPatterns.medium)
        setTheme(theme === 'dark' ? 'light' : 'dark')
        return
      }

      if (!item.href) {
        return
      }

      haptics.trigger(defaultPatterns.selection)
      onClick(e, item.href, item.id)
    }

    return (
      <li className="mx-1">
        <Tooltip open={showTooltip ? undefined : false}>
          <TooltipTrigger asChild>
            <a
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.ariaLabel}
              className={cn(
                'group text-muted-foreground flex flex-col items-center justify-center rounded-lg text-center text-xs no-underline',
                'hover:bg-primary/10 hover:text-primary bg-transparent',
                'transform-gpu transition-all duration-300',
                'hover:scale-105 active:scale-95',
                'ease-in-out',
                'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                {
                  'glass-effect bg-primary/5 text-accent backdrop-blur-3xl': isActive,
                  'rounded-full': isMobile,
                  'h-17 w-17': !(isMini || isMobile),
                  'h-14 w-14': isMini && !isMobile,
                  'h-10 w-10': isMobile && !isMini,
                  'my-1 h-8 w-8': isMobile && isMini,
                },
              )}
              href={item.href || '#'}
              onClick={onItemClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              tabIndex={0}
            >
              <div
                className={cn(
                  'flex transform-gpu items-center justify-center transition-all duration-300 ease-in-out outline-none',
                  isMobile ? 'h-5 w-5' : 'h-6 w-6',
                )}
                style={{
                  transform: `scale(${iconScale})`,
                }}
              >
                <Icon ref={iconRef} size={isMobile ? 20 : 24} />
              </div>

              <span
                className={cn(
                  'transform-gpu text-[12px] font-semibold transition-all delay-100 duration-300 ease-in-out',
                  'max-[480px]:hidden max-md:hidden',
                  {
                    'h-0 translate-y-2 scale-0 opacity-0': !isActive || isMini,
                    'mt-1 h-3 translate-y-0 scale-110 opacity-100': isActive && !isMini,
                  },
                )}
              >
                {item.label}
              </span>
            </a>
          </TooltipTrigger>
          <TooltipContent className="z-999" side="bottom" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      </li>
    )
  },
)

NavigationItem.displayName = 'NavigationItem'

const NavigationList = memo(
  ({
    activeSection,
    isMini,
    isMobile,
    onNavClick,
    haptics,
  }: {
    activeSection: SectionId
    isMini: boolean
    isMobile: boolean
    onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => void
    haptics: WebHaptics
  }) => (
    <ul
      className={cn(
        'flex list-none flex-row items-center justify-between p-1 py-2 transition-all duration-300 ease-in-out',
        isMobile && isMini && 'py-1',
      )}
    >
      {navigationItems.map((item) => (
        <NavigationItem
          haptics={haptics}
          isActive={activeSection === item.id}
          isMini={isMini}
          isMobile={isMobile}
          item={item}
          key={item.id}
          onClick={onNavClick}
        />
      ))}
    </ul>
  ),
)

NavigationList.displayName = 'NavigationList'

export default NavigationList
