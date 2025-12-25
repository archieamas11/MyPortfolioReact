import type { Message } from '@/types/types'
import { STORAGE_KEY, MAX_STORED_MESSAGES, INITIAL_MESSAGE_TEXT } from '../pages/chatbot/constants'

export function validateMessage(msg: unknown): msg is Message {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'text' in msg &&
    typeof (msg as Message).text === 'string' &&
    'sender' in msg &&
    typeof (msg as Message).sender === 'string'
  )
}

export function createInitialMessage(): Message {
  return {
    id: Date.now(),
    text: INITIAL_MESSAGE_TEXT,
    sender: 'bot',
    status: 'complete',
    timestamp: Date.now(),
  }
}

export function getInitialMessages(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const messages = JSON.parse(stored) as Message[]
      return messages
        .filter(validateMessage)
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
  return [createInitialMessage()]
}

export function saveMessages(messages: Message[]): void {
  try {
    const messagesToStore = messages.slice(-MAX_STORED_MESSAGES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore))
  } catch (error) {
    console.error('Failed to save chat history:', error)
  }
}
