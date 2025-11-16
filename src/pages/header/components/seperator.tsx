import { cn } from '@/lib/utils'

const Separator = ({ isMini }: { isMini: boolean }) => (
  <li className="mx-1 flex items-center">
    <div className={cn('bg-primary/50 w-px', { 'h-8': !isMini, 'h-6': isMini })} />
  </li>
)
export default Separator
