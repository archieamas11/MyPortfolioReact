import { useState, useRef, useCallback } from 'react'
import { sendChatMessageStreaming } from '@/api/api.chatbot'
import { useToast } from '@/components/ui/toast'
import type { Message } from '@/types/types'
import { useWebHaptics } from 'web-haptics/react'

interface UseChatbotApiParams {
  messages: Message[]
  updateMessage: (id: number, updates: Partial<Message>) => void
  addMessages: (messages: Message[]) => void
  setRateLimitedUntil: (timestamp: number) => void
}

/**
 * Extract conversation history from messages array
 * Returns the last 10 user messages with their corresponding bot responses
 * Only includes complete pairs (user message followed by bot response)
 */
function extractConversationHistory(
  messages: Message[],
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  const pairs: Array<{ user: Message; bot: Message }> = []

  // Extract complete pairs (user message followed by bot response)
  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i]

    if (currentMessage.sender === 'user' && currentMessage.status === 'complete') {
      // Look for the next bot message
      let botMessage: Message | null = null
      for (let j = i + 1; j < messages.length; j++) {
        if (messages[j].sender === 'bot' && messages[j].status === 'complete') {
          botMessage = messages[j]
          break
        }
        // If we hit another user message before finding a bot response, skip this user message
        if (messages[j].sender === 'user') {
          break
        }
      }

      // Only add if we found a complete pair
      if (botMessage) {
        pairs.push({ user: currentMessage, bot: botMessage })
      }
    }
  }

  // Take the last 10 pairs (last 10 user messages with responses)
  const recentPairs = pairs.slice(-10)

  // Format for API
  for (const pair of recentPairs) {
    history.push(
      { role: 'user', content: pair.user.text },
      { role: 'assistant', content: pair.bot.text || '' },
    )
  }

  return history
}

export function useChatbotApi({
  messages,
  updateMessage,
  addMessages,
  setRateLimitedUntil,
}: UseChatbotApiParams) {
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { showToast } = useToast()
  const { trigger } = useWebHaptics()

  // Prevent haptics spam
  const lastHapticAtRef = useRef(0)
  const HAPTIC_COOLDOWN_MS = 70
  const HAPTIC_DURATION_MS = 12

  const CANCELLED_TEXT = 'Cancelled.'
  const GENERIC_ERROR_TEXT = 'Something went wrong while generating a reply. Please try again.'
  const CONNECTION_ERROR_TEXT = "We couldn't reach the chatbot service. Please try again in a moment."

  const toUserFacingErrorText = (error?: string): string => {
    if (!error) return GENERIC_ERROR_TEXT
    if (error === 'Request cancelled') return CANCELLED_TEXT
    if (error.startsWith('Too many requests')) return error
    if (error === 'Please enter a message') return error
    if (error.startsWith('Message is too long')) return error

    return GENERIC_ERROR_TEXT
  }

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsLoading(false)
    lastHapticAtRef.current = 0

    let lastBotIndex = -1
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'bot') {
        lastBotIndex = i
        break
      }
    }

    if (lastBotIndex !== -1 && messages[lastBotIndex].status === 'streaming') {
      updateMessage(messages[lastBotIndex].id, {
        text: messages[lastBotIndex].text || CANCELLED_TEXT,
        status: 'complete',
      })
    }
  }, [messages, updateMessage])

  const maybeTriggerStreamingHaptic = useCallback(
    (chunkText: string) => {
      if (!chunkText) return
      if (!trigger) return
      if (typeof document !== 'undefined' && document.hidden) return

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      if (now - lastHapticAtRef.current < HAPTIC_COOLDOWN_MS) return
      lastHapticAtRef.current = now

      void trigger?.(HAPTIC_DURATION_MS, { intensity: 0.15 })?.catch(() => {})
    },
    [trigger],
  )

  const sendMessage = useCallback(
    async (input: string, isRateLimited: boolean) => {
      const trimmedInput = input.trim()
      if (!trimmedInput || isLoading || isRateLimited) return

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

      // Extract conversation history before adding new messages
      const conversationHistory = extractConversationHistory(messages)

      addMessages([userMessage, botMessage])
      setIsLoading(true)
      lastHapticAtRef.current = 0

      try {
        let accumulatedText = ''
        const response = await sendChatMessageStreaming(
          trimmedInput,
          (chunk: string) => {
            accumulatedText += chunk
            maybeTriggerStreamingHaptic(chunk)
            updateMessage(botMessageId, {
              text: accumulatedText,
              status: 'streaming',
            })
          },
          [],
          abortControllerRef.current?.signal,
          conversationHistory.length > 0 ? conversationHistory : undefined,
        )

        if (response.success && response.data) {
          updateMessage(botMessageId, {
            text: response.data.answer,
            confidence: response.data.confidence,
            sources: response.data.matchFound ? ['Knowledge Base'] : undefined,
            status: 'complete',
          })
        } else {
          if (response.rateLimited && response.retryAfter) {
            setRateLimitedUntil(Date.now() + response.retryAfter * 1000)
          }

          const isCancelled =
            response.error === 'Request cancelled' || abortControllerRef.current?.signal.aborted
          const errorText = toUserFacingErrorText(response.error)

          updateMessage(botMessageId, {
            text: isCancelled ? CANCELLED_TEXT : errorText,
            status: isCancelled ? 'complete' : 'error',
          })

          if (!isCancelled) {
            showToast({ variant: 'error', description: errorText })
          }
        }
      } catch (error) {
        console.error('Error sending chat message:', error)

        const isCancelled = abortControllerRef.current?.signal.aborted
        if (isCancelled) {
          updateMessage(botMessageId, { text: CANCELLED_TEXT, status: 'complete' })
        } else {
          updateMessage(botMessageId, {
            text: CONNECTION_ERROR_TEXT,
            status: 'error',
          })
          showToast({ variant: 'error', description: CONNECTION_ERROR_TEXT })
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [
      addMessages,
      isLoading,
      messages,
      maybeTriggerStreamingHaptic,
      setRateLimitedUntil,
      showToast,
      updateMessage,
    ],
  )

  return {
    isLoading,
    sendMessage,
    cancelRequest,
  }
}
