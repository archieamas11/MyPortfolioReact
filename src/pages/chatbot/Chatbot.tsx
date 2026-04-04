import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/components/ui/toast/toast-provider'
import { cn } from '@/lib/utils'
import ChatInput from '@/pages/chatbot/components/chat-input'
import { useChatMessages } from '../../hooks/use-chat-messages'
import { useChatbotApi } from '../../hooks/use-chatbot-api'
import { useIsMobile } from '../../hooks/use-mobile'
import { useRateLimit } from '../../hooks/use-rate-limit'
import { ChatHeader } from './components/chat-header'
import { ChatMessages } from './components/chat-messages'
import { ChatSuggestions } from './components/chat-suggestions'
import { INITIAL_MESSAGE_TEXT, SUGGESTION_TAGS } from './constants'

interface ChatbotProps {
  isMini?: boolean
}

export function Chatbot({ isMini = false }: ChatbotProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isClearingRef = useRef(false)
  const [input, setInput] = useState('')
  const [usedSuggestions, setUsedSuggestions] = useState<Set<string>>(new Set())
  const isMobile = useIsMobile()
  const { showToast } = useToast()

  const { messages, addMessages, updateMessage, clearMessages } = useChatMessages()
  const { isRateLimited, setRateLimitedUntil } = useRateLimit()
  const { isLoading, sendMessage, cancelRequest } = useChatbotApi({
    messages,
    updateMessage,
    addMessages,
    setRateLimitedUntil,
  })

  const maxSuggestions = isMobile ? 3 : 6
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
    if (isClearingRef.current) {
      return
    }
    const isAlreadyCleared = messages.length === 1 && messages[0].text === INITIAL_MESSAGE_TEXT
    if (isAlreadyCleared) {
      return
    }

    isClearingRef.current = true

    try {
      cancelRequest()
      clearMessages()
      setUsedSuggestions(new Set())
      showToast({ variant: 'success', description: 'Conversation cleared.' })
    } finally {
      // Allow the next interaction after state updates are queued.
      window.setTimeout(() => {
        isClearingRef.current = false
      }, 0)
    }
  }, [cancelRequest, clearMessages, messages, showToast])

  return (
    <div
      className={cn('relative flex w-full flex-col overflow-hidden')}
      onWheel={(e) => e.stopPropagation()}
      style={{ overscrollBehavior: 'contain' }}
    >
      <ChatHeader isLoading={isLoading} onClear={handleClearChat} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <ChatMessages messages={messages} scrollAreaRef={scrollAreaRef} />
      </div>
      <div
        className={cn('relative pb-5', {
          'ml-1 px-4 pt-2': isMobile || isMini,
          'px-4 pt-3': !(isMobile || isMini),
        })}
      >
        <ChatSuggestions
          isLoading={isLoading}
          isRateLimited={isRateLimited}
          onSelect={handleSelectSuggestion}
          suggestions={currentSuggestions}
        />
        <ChatInput
          isLoading={isLoading}
          isRateLimited={isRateLimited}
          onCancel={cancelRequest}
          onChange={setInput}
          onSubmit={handleSendMessage}
          value={input}
        />
      </div>
    </div>
  )
}
