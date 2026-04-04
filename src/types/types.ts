export interface Message {
  confidence?: number
  id: number
  sender: 'user' | 'bot'
  sources?: string[]
  status?: 'sending' | 'streaming' | 'complete' | 'error'
  text: string
  timestamp: number
}

export interface ChatbotResponse {
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
  success: boolean
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
