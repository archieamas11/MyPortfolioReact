import type React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { SunIcon, type SunIconHandle } from '@/components/icons/sun'
import { MoonIcon, type MoonIconHandle } from '@/components/icons/moon'
import Separator from './components/seperator'
import type { NavItem, SectionId } from './types'
import { navigationItems } from './constants'
import { useTheme } from 'next-themes'
import { memo, useEffect, useRef } from 'react'

interface IconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

const NavigationItem = memo(
  ({
    item,
    isActive,
    isMini,
    isMobile,
    onClick,
  }: {
    item: NavItem
    isActive: boolean
    isMini: boolean
    isMobile: boolean
    onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => void
  }) => {
    const { theme, setTheme } = useTheme()
    const iconRef = useRef<IconHandle | SunIconHandle | MoonIconHandle>(null)
    const prevIsActiveRef = useRef<boolean>(isActive)

    useEffect(() => {
      if (item.type === 'separator') return
      if (!isActive) {
        prevIsActiveRef.current = false
        return
      }

      // Trigger only on the transition to "active" to avoid spamming while scrolling.
      const shouldTrigger = prevIsActiveRef.current === false
      prevIsActiveRef.current = true

      if (!shouldTrigger) return
    }, [item.type, isActive])

    if (item.type === 'separator') {
      return <Separator isMini={isMini} />
    }

    const isThemeToggle = item.id === 'theme-toggle-nav'

    let Icon: React.ForwardRefExoticComponent<
      React.HTMLAttributes<HTMLDivElement> & { size?: number } & React.RefAttributes<IconHandle>
    > | null = null

    if (isThemeToggle) {
      Icon = theme === 'dark' ? MoonIcon : SunIcon
    } else if (item.icon) {
      Icon = item.icon as React.ForwardRefExoticComponent<
        React.HTMLAttributes<HTMLDivElement> & { size?: number } & React.RefAttributes<IconHandle>
      >
    }

    if (!Icon || !item.ariaLabel || (!isThemeToggle && (!item.href || !item.label))) {
      return null
    }

    const showTooltip = !isActive && !isMobile

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

    return (
      <li className="mx-1">
        <Tooltip open={showTooltip ? undefined : false}>
          <TooltipTrigger asChild>
            <a
              href={item.href || '#'}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
              onClick={(e) => {
                if (isThemeToggle) {
                  e.preventDefault()
                  setTheme(theme === 'dark' ? 'light' : 'dark')
                } else {
                  onClick(e, item.href!, item.id)
                }
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={cn(
                'group text-muted-foreground flex flex-col items-center justify-center rounded-lg text-center text-xs no-underline',
                'hover:bg-primary/5 hover:text-primary bg-transparent',
                'transform-gpu transition-all duration-300',
                'hover:scale-105 active:scale-95',
                'ease-in-out',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                {
                  'glass-effect bg-primary/20 text-accent scale-105': isActive,
                  'h-17 w-17': !isMini && !isMobile,
                  'h-14 w-14': isMini && !isMobile,
                  'h-10 w-10': isMobile,
                },
              )}
            >
              <div
                className={cn(
                  'flex transform-gpu items-center justify-center transition-all duration-300 ease-in-out outline-none',
                  isMobile ? 'h-5 w-5' : 'h-6 w-6',
                )}
                style={{
                  transform:
                    !isMobile && isMini
                      ? `scale(${isActive ? 0.95 : 0.833})`
                      : `scale(${isActive ? 1.2 : 1})`,
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
          <TooltipContent side="bottom" sideOffset={8} className="z-999">
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
  }: {
    activeSection: SectionId
    isMini: boolean
    isMobile: boolean
    onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => void
  }) => (
    <ul
      className={cn(
        'transition-all duration-300 ease-in-out flex list-none flex-row items-center justify-between p-1 py-2',
        isMobile ? 'py-3 px-2' : '',
      )}
    >
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={activeSection === item.id}
          isMini={isMini}
          isMobile={isMobile}
          onClick={onNavClick}
        />
      ))}
    </ul>
  ),
)

NavigationList.displayName = 'NavigationList'

export default NavigationList
