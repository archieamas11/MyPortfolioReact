import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ChatHeader } from './components/ChatHeader'
import { ChatMessages } from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import { ChatSuggestions } from './components/ChatSuggestions'
import { useChatMessages } from '../../hooks/useChatMessages'
import { useChatbotApi } from '../../hooks/useChatbotApi'
import { useRateLimit } from '../../hooks/useRateLimit'
import { useIsMobile } from '../../hooks/use-mobile'
import { SUGGESTION_TAGS } from './constants'

interface ChatbotProps {
  isMini?: boolean
}

export function Chatbot({ isMini = false }: ChatbotProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [usedSuggestions, setUsedSuggestions] = useState<Set<string>>(new Set())
  const isMobile = useIsMobile()

  const { messages, addMessages, updateMessage, clearMessages } = useChatMessages()
  const { isRateLimited, setRateLimitedUntil } = useRateLimit()
  const { isLoading, sendMessage, cancelRequest } = useChatbotApi({
    messages,
    updateMessage,
    addMessages,
    setRateLimitedUntil,
  })

  const maxSuggestions = useMemo(() => {
    return isMobile ? 3 : 6
  }, [isMobile])

  const availableSuggestions = useMemo(() => {
    return SUGGESTION_TAGS.filter((tag) => !usedSuggestions.has(tag.question))
  }, [usedSuggestions])

  useEffect(() => {
    if (availableSuggestions.length === 0) {
      setUsedSuggestions(new Set())
    }
  }, [availableSuggestions.length])

  const currentSuggestions = useMemo(() => {
    const suggestionsToUse = availableSuggestions.length === 0 ? SUGGESTION_TAGS : availableSuggestions
    const shuffled = [...suggestionsToUse].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, maxSuggestions)
  }, [availableSuggestions, maxSuggestions])

  const handleSelectSuggestion = useCallback(
    (question: string) => {
      setUsedSuggestions((prev) => new Set(prev).add(question))
      sendMessage(question, isRateLimited)
      setInput('')
    },
    [sendMessage, isRateLimited],
  )

  const handleSendMessage = useCallback(() => {
    const trimmedInput = input.trim()
    const matchingTag = SUGGESTION_TAGS.find((tag) => tag.question === trimmedInput)
    if (matchingTag) {
      setUsedSuggestions((prev) => new Set(prev).add(trimmedInput))
    }
    sendMessage(input, isRateLimited)
    setInput('')
  }, [input, isRateLimited, sendMessage])

  const handleClearChat = useCallback(() => {
    cancelRequest()
    clearMessages()
    setUsedSuggestions(new Set())
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
        <ChatSuggestions
          suggestions={currentSuggestions}
          onSelect={handleSelectSuggestion}
          isLoading={isLoading}
          isRateLimited={isRateLimited}
        />
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
