import ThemeToggleButton from '@/components/ui/theme-toggle-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ThemeToggleItem = ({ isMini, isMobile }: { isMini: boolean; isMobile: boolean }) => (
  <li className="mx-1">
    <Tooltip open={!isMobile ? undefined : false}>
      <TooltipTrigger asChild>
        <div
          className={cn('flex h-15 items-center justify-center transition-all delay-100 duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]', {
            'scale-100': !isMini || isMobile,
            'scale-75': isMini && !isMobile,
          })}
        >
          <ThemeToggleButton
            variant="circle-blur"
            start="right-middle"
            size={isMini && !isMobile ? 'sm' : 'md'}
            className={cn(
              'text-primary m-2 h-full w-full bg-transparent hover:cursor-pointer hover:bg-transparent dark:hover:bg-transparent',
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
