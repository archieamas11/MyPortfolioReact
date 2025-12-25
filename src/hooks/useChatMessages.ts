import { useState, useEffect, useCallback } from 'react'
import type { Message } from '@/types/types'
import { getInitialMessages, saveMessages, createInitialMessage } from '../utils/message-storage'

const SAVE_DEBOUNCE_MS = 500

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveMessages(messages)
    }, SAVE_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [messages])

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const addMessages = useCallback((newMessages: Message[]) => {
    setMessages((prev) => [...prev, ...newMessages])
  }, [])

  const updateMessage = useCallback((messageId: number, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg)))
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([createInitialMessage()])
  }, [])

  return {
    messages,
    addMessage,
    addMessages,
    updateMessage,
    clearMessages,
    setMessages,
  }
}
