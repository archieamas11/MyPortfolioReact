import ThemeToggleButton from '@/components/ui/theme-toggle-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ThemeToggleItem = ({ isMini, isMobile }: { isMini: boolean; isMobile: boolean }) => (
  <li className="mx-1">
    <Tooltip open={!isMobile ? undefined : false}>
      <TooltipTrigger asChild>
        <div
          className={cn('bouncy hover:bg-primary/5 flex h-17 items-center justify-center rounded-lg hover:scale-105', {
            'scale-100': !isMini || isMobile,
            'scale-80 p-1 hover:scale-85': isMini && !isMobile,
          })}
        >
          <ThemeToggleButton
            variant="circle-blur"
            start="right-middle"
            size={isMini && !isMobile ? 'sm' : 'md'}
            className={cn(
              'hover:text-primary/50 text-primary/50 m-2 h-full w-full bg-transparent transition-all duration-200 hover:scale-110 hover:rotate-10 hover:cursor-pointer hover:bg-transparent dark:hover:bg-transparent',
              isMobile ? 'm-0' : '',
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
