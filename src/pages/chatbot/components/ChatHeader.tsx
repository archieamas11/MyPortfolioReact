import { TrashIcon } from 'lucide-react'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onClear: () => void
  isLoading: boolean
}

export function ChatHeader({ onClear, isLoading }: ChatHeaderProps) {
  return (
    <CardHeader className="mb-2 flex flex-row items-center justify-between">
      <CardTitle className="text-foreground text-base font-semibold">Portfolio Chatbot</CardTitle>
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
