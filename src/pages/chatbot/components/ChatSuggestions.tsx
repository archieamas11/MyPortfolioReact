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
    <div className="mb-4 flex gap-1.5 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon
        return (
          <button
            key={`${suggestion.tag}-${index}`}
            onClick={() => handleSelect(suggestion.question)}
            disabled={isLoading || isRateLimited}
            className={cn(
              'glass-effect text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs whitespace-nowrap transition-colors sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm',
              'hover:bg-accent/50 focus:ring-accent focus:ring-2 focus:ring-offset-2 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            aria-label={`Select suggestion: ${suggestion.tag}`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span>{suggestion.tag}</span>
          </button>
        )
      })}
    </div>
  )
}
