import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { SuggestionTag } from '../constants'

interface ChatSuggestionsProps {
  suggestions: SuggestionTag[]
  onSelect: (question: string) => void
  isLoading?: boolean
  isRateLimited?: boolean
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  isLoading = false,
  isRateLimited = false,
}: ChatSuggestionsProps) {
  const handleSelect = useCallback(
    (question: string) => {
      if (!isLoading && !isRateLimited) {
        onSelect(question)
      }
    },
    [onSelect, isLoading, isRateLimited],
  )

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mb-2.5 flex gap-2 overflow-x-auto overflow-y-hidden pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2.5 [&::-webkit-scrollbar]:hidden">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon
        return (
          <button
            key={`${suggestion.tag}-${index}`}
            onClick={() => handleSelect(suggestion.question)}
            disabled={isLoading || isRateLimited}
            className={cn(
              'glass-effect text-muted-foreground hover:text-foreground group border-border/50 relative flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm',
              'hover:border-primary/30 hover:bg-accent/30 focus:ring-accent cursor-pointer hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none',
              'disabled:hover:border-border/50 disabled:hover:bg-background/50 disabled:cursor-not-allowed disabled:opacity-50',
              'animate-in fade-in slide-in-from-left-2',
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            aria-label={`Select suggestion: ${suggestion.tag}`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-4 sm:w-4" />
            <span className="font-medium">{suggestion.tag}</span>
          </button>
        )
      })}
    </div>
  )
}
