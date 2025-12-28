import { TrashIcon } from 'lucide-react'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onClear: () => void
  isLoading: boolean
}

export function ChatHeader({ onClear, isLoading }: ChatHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6">
      <CardTitle className="text-foreground flex items-center gap-2 text-base font-semibold">
        Portfolio Chatbot
      </CardTitle>
      <Button
        onClick={onClear}
        disabled={isLoading}
        variant="ghost"
        size="icon"
        aria-label="Clear chat history"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </CardHeader>
  )
}
