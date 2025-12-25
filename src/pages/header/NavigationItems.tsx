import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type React from 'react'
import { useRef, memo } from 'react'
import type { NavItem } from './types'

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
    const Icon = item.icon as React.ForwardRefExoticComponent<
      React.HTMLAttributes<HTMLDivElement> & { size?: number } & React.RefAttributes<IconHandle>
    >
    const iconRef = useRef<IconHandle>(null)
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
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => onClick(e, item.href, item.id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={cn(
                'group text-primary/50 flex flex-col items-center justify-center rounded-lg text-center text-xs no-underline',
                'hover:bg-primary/5 bg-transparent',
                'transform-gpu transition-all duration-300',
                'hover:scale-105 active:scale-95',
                'ease-in-out',
                {
                  'glass-effect bg-primary/20 text-accent scale-105': isActive,
                  'h-17 w-17 p-1': !isMini && !isMobile,
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
                  'transform-gpu transition-all delay-100 duration-300 ease-in-out',
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

export default NavigationItem
