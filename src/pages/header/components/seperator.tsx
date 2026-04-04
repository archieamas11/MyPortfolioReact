import { cn } from '@/lib/utils'

const Separator = ({ isMini }: { isMini: boolean }) => (
  <li aria-hidden="true" className="mx-1 flex items-center">
    <div className={cn('bg-primary/40 w-px', { 'h-8': !isMini, 'h-6': isMini })} />
  </li>
)
export default Separator
