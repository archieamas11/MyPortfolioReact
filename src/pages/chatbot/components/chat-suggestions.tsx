import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { SuggestionTag } from '../constants'

interface ChatSuggestionsProps {
  isLoading?: boolean
  isRateLimited?: boolean
  onSelect: (question: string) => void
  suggestions: SuggestionTag[]
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  isLoading = false,
  isRateLimited = false,
}: ChatSuggestionsProps) {
  const handleSelect = useCallback(
    (question: string) => {
      if (!(isLoading || isRateLimited)) {
        onSelect(question)
      }
    },
    [onSelect, isLoading, isRateLimited],
  )

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mb-1 flex gap-2 overflow-x-auto overflow-y-hidden pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2.5 lg:mb-2 [&::-webkit-scrollbar]:hidden">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon
        return (
          <button
            aria-label={`Select suggestion: ${suggestion.tag}`}
            className={cn(
              'glass-effect group border-border/50 text-muted-foreground hover:text-foreground relative flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm',
              'hover:border-primary/30 hover:bg-accent/30 focus:ring-accent cursor-pointer hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none',
              'disabled:hover:border-border/50 disabled:hover:bg-background/50 disabled:cursor-not-allowed disabled:opacity-50',
            )}
            disabled={isLoading || isRateLimited}
            key={suggestion.question}
            onClick={() => handleSelect(suggestion.question)}
            style={{ animationDelay: `${index * 50}ms` }}
            type="button"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-4 sm:w-4" />
            <span className="font-medium">{suggestion.tag}</span>
          </button>
        )
      })}
    </div>
  )
}
