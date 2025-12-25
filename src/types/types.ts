export interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  sources?: string[]
  confidence?: number
  status?: 'sending' | 'streaming' | 'complete' | 'error'
  timestamp: number
}

export interface ChatbotResponse {
  success: boolean
  data?: {
    answer: string
    sources?: string[]
    confidence?: number
    matchFound?: boolean
    intent?: string
  }
  error?: string
  rateLimited?: boolean
  retryAfter?: number
}

export class APIError extends Error {
  status?: number
  rateLimited: boolean
  retryAfter?: number

  constructor(message: string, status?: number, rateLimited = false, retryAfter?: number) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.rateLimited = rateLimited
    this.retryAfter = retryAfter
    Object.setPrototypeOf(this, APIError.prototype)
  }
}
