import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  className?: string
}

function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} role="status" aria-label="Bot is typing">
      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  )
}

TypingIndicator.displayName = 'TypingIndicator'

export { TypingIndicator }
