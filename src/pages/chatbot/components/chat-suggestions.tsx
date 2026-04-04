import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { SuggestionTag } from "../constants";

interface ChatSuggestionsProps {
  isLoading?: boolean;
  isRateLimited?: boolean;
  onSelect: (question: string) => void;
  suggestions: SuggestionTag[];
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
        onSelect(question);
      }
    },
    [onSelect, isLoading, isRateLimited]
  );

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-1 flex gap-2 overflow-x-auto overflow-y-hidden pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2.5 lg:mb-2 [&::-webkit-scrollbar]:hidden">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            aria-label={`Select suggestion: ${suggestion.tag}`}
            className={cn(
              "glass-effect group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border/50 px-3 py-1.5 text-muted-foreground text-xs transition-all duration-200 hover:text-foreground sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm",
              "cursor-pointer hover:border-primary/30 hover:bg-accent/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/50 disabled:hover:bg-background/50"
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
        );
      })}
    </div>
  );
}
