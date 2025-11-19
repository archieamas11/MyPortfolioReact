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
    <li className="mx-1 transition-all delay-100 duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
      <Tooltip open={showTooltip ? undefined : false}>
        <TooltipTrigger asChild>
          {/* Navigation items */}
          <a
            href={item.href}
            aria-label={item.ariaLabel}
            onClick={(e) => onClick(e, item.href, item.id)}
            className={cn(
              'text-primary/50 flex flex-col items-center justify-center rounded-lg text-center text-xs no-underline transition-all delay-100 duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:opacity-100',
              {
                'text-secondary dark:text-primary bg-[#4e67b0]': isActive,
                'h-17 w-17 p-1': !isMini && !isMobile,
                'h-14 w-14': isMini && !isMobile,
                'h-10 w-10': isMobile,
              },
            )}
          >
            {/* Icon */}
            <Icon
              className={cn('transition-all delay-100 duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]', {
                'h-6 w-6': !isMini,
                'h-4 w-4': isMini,
              })}
            />

            {/* Caption */}
            <span
              className={cn('transition-all delay-100 duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] max-[480px]:hidden max-md:hidden', {
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
