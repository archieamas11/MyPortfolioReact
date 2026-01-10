import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { sendChatMessageStreaming } from '@/api/api.chatbot'
import type { Message } from '@/types/types'

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

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsLoading(false)

    let lastBotIndex = -1
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'bot') {
        lastBotIndex = i
        break
      }
    }

    if (lastBotIndex !== -1 && messages[lastBotIndex].status === 'streaming') {
      updateMessage(messages[lastBotIndex].id, {
        text: messages[lastBotIndex].text || 'Request cancelled.',
        status: 'complete',
      })
    }
  }, [messages, updateMessage])

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

      try {
        let accumulatedText = ''
        const response = await sendChatMessageStreaming(
          trimmedInput,
          (chunk: string) => {
            accumulatedText += chunk
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

          updateMessage(botMessageId, {
            text: response.error || 'Sorry, I encountered an error. Please try again.',
            status: 'error',
          })

          if (response.error !== 'Request cancelled') {
            toast.error(response.error || 'Failed to get response')
          }
        }
      } catch (error) {
        console.error('Error sending chat message:', error)
        updateMessage(botMessageId, {
          text: 'Sorry, I encountered an error connecting to the server. Please try again.',
          status: 'error',
        })
        toast.error('Failed to connect to chatbot service')
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [isLoading, messages, addMessages, updateMessage, setRateLimitedUntil],
  )

  return {
    isLoading,
    sendMessage,
    cancelRequest,
  }
}
