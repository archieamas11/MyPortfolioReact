import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type React from 'react'
import type { NavItem } from './types'

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
    <li className="bouncy mx-1">
      <Tooltip open={showTooltip ? undefined : false}>
        <TooltipTrigger asChild>
          {/* Navigation items */}
          <a
            href={item.href}
            aria-label={item.ariaLabel}
            onClick={(e) => onClick(e, item.href, item.id)}
            className={cn(
              'text-primary/50 bouncy flex flex-col items-center justify-center rounded-lg text-center text-xs no-underline hover:opacity-100',
              {
                'text-secondary dark:text-primary border bg-[#4e67b0]': isActive,
                'h-17 w-17 p-1': !isMini && !isMobile,
                'h-14 w-14': isMini && !isMobile,
                'h-10 w-10': isMobile,
              },
            )}
          >
            {/* Icon */}
            <Icon
              className={cn('bouncy', {
                'h-6 w-6': !isMini,
                'h-4 w-4': isMini,
              })}
            />

            {/* Caption */}
            <span
              className={cn('bouncy max-[480px]:hidden max-md:hidden', {
                'h-0 scale-0': !isActive && !isMini,
                'h-3 scale-110': isActive && !isMini,
                hidden: isMini,
              })}
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
