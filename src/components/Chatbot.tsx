import { Textarea } from '@/components/ui/textarea'
import { TypingIndicator } from '@/components/ui/typing-indicator'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowRightIcon, TrashIcon, StopCircleIcon, AlertCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sendChatMessageStreaming } from '@/api/api.chatbot'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/types'

const STORAGE_KEY = 'chatbot-messages'
const MAX_STORED_MESSAGES = 50
const INITIAL_MESSAGE_TEXT =
  "Hello! I'm your AI assistant. Ask me anything about my portfolio, skills, experience, or projects!"

const getInitialMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const messages = JSON.parse(stored) as Message[]
      // Validate and sanitize stored messages
      return messages
        .filter((msg) => msg && typeof msg.text === 'string' && msg.sender)
        .slice(-MAX_STORED_MESSAGES)
        .map((msg) => ({
          ...msg,
          status: msg.status === 'streaming' ? 'complete' : msg.status,
        }))
    }
  } catch (error) {
    console.error('Failed to load chat history:', error)
    localStorage.removeItem(STORAGE_KEY)
  }
  return [
    {
      id: 1,
      text: INITIAL_MESSAGE_TEXT,
      sender: 'bot',
      status: 'complete',
      timestamp: Date.now(),
    },
  ]
}

// Message bubble component
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user'
  const isStreaming = message.status === 'streaming'
  const isError = message.status === 'error'

  return (
    <div
      className={cn('flex', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
      role="listitem"
    >
      <div
        className={cn(
          'relative max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-[1.45] break-words shadow-sm',
          'transition-all',
          {
            // User (right)
            'mr-3 ml-auto rounded-br-md bg-white text-gray-950': isUser,

            // Bot (left)
            'bg-accent/40 text-primary mr-auto ml-3 rounded-bl-md font-normal': !isUser,

            // Error
            'border-destructive/50 bg-destructive/10 border': isError,
          },
        )}
      >
        {isStreaming && !message.text ? (
          <TypingIndicator />
        ) : isError ? (
          <div className="flex items-start gap-2">
            <AlertCircleIcon className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
            <span className="text-destructive">{message.text}</span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <a
                  {...props}
                  href={props.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-600"
                />
              ),
              p: ({ ...props }) => <p {...props} className="last:mb-0" />,
              ul: ({ ...props }) => <ul {...props} className="ml-4 list-disc last:mb-0" />,
              ol: ({ ...props }) => <ol {...props} className="ml-4 list-decimal last:mb-0" />,
              // code: ({ ...props }) => (
              //   <code {...props} className="bg-muted rounded px-1 py-0.5 font-mono text-xs" />
              // ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
        {isStreaming && message.text && (
          <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-current" />
        )}
      </div>
    </div>
  )
}

export function Chatbot({ isMini = false }: { isMini?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Check if rate limited
  const isRateLimited = useMemo(() => {
    if (!rateLimitedUntil) return false
    return Date.now() < rateLimitedUntil
  }, [rateLimitedUntil])

  // Save messages to localStorage whenever they change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const messagesToStore = messages.slice(-MAX_STORED_MESSAGES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore))
      } catch (error) {
        console.error('Failed to save chat history:', error)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [messages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        })
      }
    }
  }, [messages])

  // Clear rate limit after timeout
  useEffect(() => {
    if (!rateLimitedUntil) return

    const remaining = rateLimitedUntil - Date.now()
    if (remaining <= 0) {
      setRateLimitedUntil(null)
      return
    }

    const timeoutId = setTimeout(() => {
      setRateLimitedUntil(null)
    }, remaining)

    return () => clearTimeout(timeoutId)
  }, [rateLimitedUntil])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsLoading(false)

    // Update the last bot message to show cancellation
    setMessages((prev) => {
      // Find last bot message index (compatible with older ES versions)
      let lastBotIndex = -1
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].sender === 'bot') {
          lastBotIndex = i
          break
        }
      }
      if (lastBotIndex === -1) return prev

      const lastBot = prev[lastBotIndex]
      if (lastBot.status !== 'streaming') return prev

      return prev.map((msg, i) =>
        i === lastBotIndex
          ? {
              ...msg,
              text: msg.text || 'Request cancelled.',
              status: 'complete' as const,
            }
          : msg,
      )
    })
  }, [])

  const sendMessage = useCallback(async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading || isRateLimited) return

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    const userMessage: Message = {
      id: Date.now(),
      text: trimmedInput,
      sender: 'user',
      status: 'complete',
      timestamp: Date.now(),
    }

    const botMessageId = Date.now() + 1
    const botMessage: Message = {
      id: botMessageId,
      text: '',
      sender: 'bot',
      status: 'streaming',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setInput('')
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await sendChatMessageStreaming(
        trimmedInput,
        (chunk: string) => {
          // Update the bot message with streaming content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, text: msg.text + chunk, status: 'streaming' as const }
                : msg,
            ),
          )
        },
        [], // existingIntents - could be populated from previous messages
        abortControllerRef.current?.signal,
      )

      if (response.success && response.data) {
        // Update final message with metadata
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: response.data!.answer,
                  confidence: response.data!.confidence,
                  sources: response.data!.matchFound ? ['Knowledge Base'] : undefined,
                  status: 'complete' as const,
                }
              : msg,
          ),
        )
      } else {
        // Handle rate limiting
        if (response.rateLimited && response.retryAfter) {
          setRateLimitedUntil(Date.now() + response.retryAfter * 1000)
        }

        // Update with error message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: response.error || 'Sorry, I encountered an error. Please try again.',
                  status: 'error' as const,
                }
              : msg,
          ),
        )

        if (response.error !== 'Request cancelled') {
          toast.error(response.error || 'Failed to get response')
        }
      }
    } catch (error) {
      // Update with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: 'Sorry, I encountered an error connecting to the server. Please try again.',
                status: 'error' as const,
              }
            : msg,
        ),
      )
      toast.error('Failed to connect to chatbot service')
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [input, isLoading, isRateLimited])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const target = e.target
    target.style.height = 'auto'
    const scrollHeight = target.scrollHeight
    const newHeight = Math.min(scrollHeight, 200)
    target.style.height = `${newHeight}px`
    target.style.overflow = scrollHeight > 200 ? 'auto' : 'hidden'
  }, [])

  const clearChat = useCallback(() => {
    // Cancel any ongoing request
    abortControllerRef.current?.abort()

    const initialMessage: Message = {
      id: Date.now(),
      text: INITIAL_MESSAGE_TEXT,
      sender: 'bot',
      status: 'complete',
      timestamp: Date.now(),
    }
    setMessages([initialMessage])
    setIsLoading(false)
    setRateLimitedUntil(null)
    toast.success('Chat history cleared')
  }, [])

  const inputDisabled = isLoading || isRateLimited || !input.trim()

  return (
    <div>
      <div
        className="w-full border-none bg-transparent shadow-none"
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        <CardHeader className="mb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-foreground text-base font-semibold">AI Assistant</CardTitle>
          <Button
            onClick={clearChat}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            aria-label="Clear chat history"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className={cn('space-y-8', isMini ? 'pr-2.5' : 'px-6')}>
          <ScrollArea
            ref={scrollAreaRef}
            className="h-80 overflow-y-auto lg:h-90"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            <div className="space-y-5" role="list">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          </ScrollArea>
          <div className="relative mb-6 w-full max-w-full">
            <Textarea
              ref={textareaRef}
              value={input}
              placeholder={isRateLimited ? 'Please wait before sending another message...' : 'Ask anything'}
              onChange={handleInputChange}
              className={cn('glass-effect min-h-10 w-full resize-none rounded-lg py-3 pr-12', {
                'opacity-50': isRateLimited,
              })}
              onKeyDown={handleKeyPress}
              disabled={isRateLimited}
              aria-label="Chat message input"
              maxLength={2000}
            />
            <Button
              onClick={isLoading ? cancelRequest : sendMessage}
              disabled={inputDisabled && !isLoading}
              aria-label={isLoading ? 'Cancel message' : 'Send message'}
              size="icon"
              className={cn(
                'bg-accent hover:bg-accent/80 absolute right-2 bottom-1.75 h-8 w-8 rounded-full',
                isLoading && 'bg-muted-foreground hover:bg-muted-foreground/80',
              )}
            >
              {isLoading ? (
                <StopCircleIcon className="text-accent-foreground h-4 w-4" />
              ) : (
                <ArrowRightIcon className="text-accent-foreground h-4 w-4" />
              )}
            </Button>
          </div>
          {isRateLimited && (
            <p className="text-muted-foreground text-center text-xs" role="alert">
              Rate limited. Please wait before sending another message.
            </p>
          )}
        </CardContent>
      </div>
    </div>
  )
}
