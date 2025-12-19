export interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  sources?: string[]
  confidence?: number
  status?: 'sending' | 'streaming' | 'complete' | 'error'
  timestamp: number
}
