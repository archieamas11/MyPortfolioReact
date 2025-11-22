import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type React from 'react'
import type { NavItem } from './types'

const BOUNCE_CURVE = 'cubic-bezier(0.8, -0.5, 0.2, 1.5)'

const NavigationItem = ({
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
  const Icon = item.icon
  const showTooltip = !isActive && !isMobile

  return (
    <li className="mx-1">
      <Tooltip open={showTooltip ? undefined : false}>
        <TooltipTrigger asChild>
          <a
            href={item.href}
            aria-label={item.ariaLabel}
            onClick={(e) => onClick(e, item.href, item.id)}
            className={cn(
              'text-primary/50 flex flex-col items-center justify-center rounded-lg text-center text-xs no-underline',
              'hover:bg-primary/5 bg-transparent',
              'transform-gpu transition-all duration-500 will-change-[width,height,transform,background-color]',
              'hover:scale-105 active:scale-95',
              `ease-[${BOUNCE_CURVE}]`,
              {
                'text-secondary dark:text-primary scale-105 bg-[#4e67b0] hover:bg-[#4e67b0]': isActive,
                'h-17 w-17 scale-100 p-1': !isMini && !isMobile,
                'h-14 w-14 scale-95': isMini && !isMobile,
                'h-10 w-10': isMobile,
              },
            )}
          >
            <Icon
              className={cn(
                'transform-gpu will-change-[width,height,transform]',
                'transition-all delay-100 duration-500 hover:scale-110 hover:rotate-10',
                `ease-[${BOUNCE_CURVE}]`,
                {
                  'h-6 w-6 scale-100': !isMini,
                  'h-4 w-4 scale-90': isMini,
                  'scale-125 rotate-0': isActive,
                  'h-5 w-5': isMobile,
                },
              )}
            />

            <span
              className={cn(
                'transform-gpu will-change-[transform,opacity,width,height]',
                'transition-all delay-200 duration-500 max-[480px]:hidden max-md:hidden',
                `ease-[${BOUNCE_CURVE}]`,
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
}

export default NavigationItem
