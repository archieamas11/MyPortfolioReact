import { useState, useRef, useCallback } from 'react'
import { CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ChatHeader } from './components/ChatHeader'
import { ChatMessages } from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import { useChatMessages } from '../../hooks/useChatMessages'
import { useChatbotApi } from '../../hooks/useChatbotApi'
import { useRateLimit } from '../../hooks/useRateLimit'

interface ChatbotProps {
  isMini?: boolean
}

export function Chatbot({ isMini = false }: ChatbotProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')

  const { messages, addMessages, updateMessage, clearMessages } = useChatMessages()
  const { isRateLimited, setRateLimitedUntil } = useRateLimit()
  const { isLoading, sendMessage, cancelRequest } = useChatbotApi({
    messages,
    updateMessage,
    addMessages,
    setRateLimitedUntil,
  })

  const handleSendMessage = useCallback(() => {
    sendMessage(input, isRateLimited)
    setInput('')
  }, [input, isRateLimited, sendMessage])

  const handleClearChat = useCallback(() => {
    cancelRequest()
    clearMessages()
    toast.success('Chat history cleared')
  }, [cancelRequest, clearMessages])

  return (
    <div
      className="w-full border-none bg-transparent shadow-none"
      onWheel={(e) => e.stopPropagation()}
      style={{ overscrollBehavior: 'contain' }}
    >
      <ChatHeader onClear={handleClearChat} isLoading={isLoading} />
      <CardContent className={cn('space-y-8', isMini ? 'pr-2.5' : 'px-6')}>
        <ChatMessages messages={messages} scrollAreaRef={scrollAreaRef} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSendMessage}
          onCancel={cancelRequest}
          isLoading={isLoading}
          isRateLimited={isRateLimited}
        />
      </CardContent>
    </div>
  )
}
