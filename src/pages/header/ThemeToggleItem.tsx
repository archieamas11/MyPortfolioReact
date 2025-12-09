import ThemeToggleButton from '@/components/ui/theme-toggle-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ThemeToggleItem = ({ isMini, isMobile }: { isMini: boolean; isMobile: boolean }) => (
  <li className="mx-1">
    <Tooltip open={!isMobile ? undefined : false}>
      <TooltipTrigger asChild>
        <div
          className={cn('bouncy flex h-17 items-center justify-center', {
            'scale-100 pr-1.5': !isMini || isMobile,
            'scale-80 hover:scale-85': isMini && !isMobile,
          })}
        >
          <ThemeToggleButton
            variant="polygon"
            start="right-middle"
            size={isMini && !isMobile ? 'sm' : 'md'}
            className={cn(
              'hover:text-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 text-primary/50 m-2 h-full w-full rounded-lg hover:scale-105 hover:cursor-pointer',
              isMobile ? 'm-0 h-10 w-10' : '',
              isMini && !isMobile ? 'm-1 h-16 w-16' : '',
            )}
            showLabel={false}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8} className="z-999">
        Theme
      </TooltipContent>
    </Tooltip>
  </li>
)
export default ThemeToggleItem
