import type { ChatbotResponse } from '@/types/types'
import { APIError } from '@/types/types'

const API_BASE_URL = import.meta.env.VITE_RAG_API_URL
const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY

const REQUEST_TIMEOUT = 30000
const MAX_RETRIES = 2
const RETRY_DELAY = 1000
const MAX_QUERY_LENGTH = 2000
const MAX_BUFFER_SIZE = 1024 * 1024

export type { ChatbotResponse }
export { APIError }

interface StreamMetadata {
  originalQuestion: string
  matchFound: boolean
  answer?: string | null
  intent: string
}

interface SSEEvent {
  event: string
  data: string
}

interface ChatRequestOptions {
  prompt: string
  existingIntents: string[]
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

interface ErrorEventData {
  message: string
  code?: string
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
    Object.setPrototypeOf(this, ConfigurationError.prototype)
  }
}

function validateConfiguration(): void {
  if (!API_BASE_URL || typeof API_BASE_URL !== 'string') {
    throw new ConfigurationError('VITE_RAG_API_URL is not configured')
  }
  try {
    new URL(API_BASE_URL)
  } catch {
    throw new ConfigurationError('VITE_RAG_API_URL is not a valid URL')
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function validateQuery(query: string): { valid: boolean; error?: string } {
  const trimmed = query.trim()
  if (!trimmed) {
    return { valid: false, error: 'Please enter a message' }
  }
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Message is too long. Please keep it under ${MAX_QUERY_LENGTH} characters.`,
    }
  }
  return { valid: true }
}

function parseSSEEvents(chunk: string): SSEEvent[] {
  const events: SSEEvent[] = []
  const lines = chunk.split('\n')
  let currentEvent = 'message'
  let currentData = ''
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('event:')) {
      currentEvent = trimmedLine.slice(6).trim() || 'message'
    } else if (trimmedLine.startsWith('data:')) {
      const dataValue = trimmedLine.slice(5).trim()
      if (currentData) {
        currentData += '\n' + dataValue
      } else {
        currentData = dataValue
      }
    } else if (trimmedLine === '' && currentData) {
      events.push({ event: currentEvent, data: currentData })
      currentEvent = 'message'
      currentData = ''
    } else if (trimmedLine && !trimmedLine.startsWith(':')) {
      if (currentData) {
        currentData += '\n' + trimmedLine
      }
    }
  }
  if (currentData && !chunk.endsWith('\n\n')) {
    return events
  }
  return events
}

function processSSEEvent(
  event: SSEEvent,
  metadata: StreamMetadata | null,
  fullAnswer: string,
  onChunk: (text: string) => void,
): { metadata: StreamMetadata | null; fullAnswer: string; error?: APIError } {
  const { event: eventType, data } = event
  if (!data || data === '{}' || data.trim() === '') {
    return { metadata, fullAnswer }
  }
  try {
    if (eventType === 'metadata') {
      const parsed = JSON.parse(data) as StreamMetadata
      return { metadata: parsed, fullAnswer }
    }
    if (eventType === 'text') {
      let text: string
      try {
        text = JSON.parse(data) as string
      } catch {
        text = data
      }
      const updatedAnswer = fullAnswer + text
      onChunk(text)
      return { metadata, fullAnswer: updatedAnswer }
    }
    if (eventType === 'error') {
      const errorData = JSON.parse(data) as ErrorEventData
      return {
        metadata,
        fullAnswer,
        error: new APIError(errorData.message || 'Unknown error occurred'),
      }
    }
  } catch (parseError) {
    if (eventType === 'text') {
      const updatedAnswer = fullAnswer + data
      onChunk(data)
      return { metadata, fullAnswer: updatedAnswer }
    }
    console.warn('Failed to parse SSE event:', eventType, parseError)
  }
  return { metadata, fullAnswer }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId)
      throw new DOMException('Request aborted', 'AbortError')
    }
    signal.addEventListener('abort', () => {
      controller.abort()
      clearTimeout(timeoutId)
    })
  }
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

function handleRateLimitResponse(response: Response): ChatbotResponse {
  const retryAfterHeader = response.headers.get('Retry-After')
  const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
  return {
    success: false,
    error: `Too many requests. Please wait ${retryAfter} seconds.`,
    rateLimited: true,
    retryAfter: Number.isNaN(retryAfter) ? 60 : retryAfter,
  }
}

async function processStreamResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  onChunk: (text: string) => void,
  abortSignal?: AbortSignal,
): Promise<{ fullAnswer: string; metadata: StreamMetadata | null }> {
  let fullAnswer = ''
  let metadata: StreamMetadata | null = null
  let buffer = ''
  try {
    while (true) {
      if (abortSignal?.aborted) {
        await reader.cancel()
        throw new DOMException('Request cancelled', 'AbortError')
      }
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      buffer += decoder.decode(value, { stream: true })
      if (buffer.length > MAX_BUFFER_SIZE) {
        throw new APIError('Response buffer exceeded maximum size')
      }
      const events = parseSSEEvents(buffer)
      const lastCompleteEvent = buffer.lastIndexOf('\n\n')
      if (lastCompleteEvent !== -1) {
        buffer = buffer.slice(lastCompleteEvent + 2)
      }
      for (const event of events) {
        const result = processSSEEvent(event, metadata, fullAnswer, onChunk)
        if (result.error) {
          throw result.error
        }
        metadata = result.metadata ?? metadata
        fullAnswer = result.fullAnswer
      }
    }
    if (buffer.trim()) {
      const remainingEvents = parseSSEEvents(buffer + '\n\n')
      for (const event of remainingEvents) {
        const result = processSSEEvent(event, metadata, fullAnswer, onChunk)
        if (result.error) {
          throw result.error
        }
        metadata = result.metadata ?? metadata
        fullAnswer = result.fullAnswer
      }
    }
  } finally {
    reader.releaseLock()
  }
  return { fullAnswer, metadata }
}

export async function sendChatMessageStreaming(
  query: string,
  onChunk: (text: string) => void,
  existingIntents: string[] = [],
  abortSignal?: AbortSignal,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<ChatbotResponse> {
  try {
    validateConfiguration()
  } catch (error) {
    return {
      success: false,
      error: error instanceof ConfigurationError ? error.message : 'API configuration error',
    }
  }
  const validation = validateQuery(query)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  const trimmedQuery = query.trim()
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (abortSignal?.aborted) {
        return { success: false, error: 'Request cancelled' }
      }
      const requestBody: ChatRequestOptions = {
        prompt: trimmedQuery,
        existingIntents: Array.isArray(existingIntents) ? existingIntents : [],
        conversationHistory:
          conversationHistory && Array.isArray(conversationHistory) ? conversationHistory : undefined,
      }
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (API_SECRET_KEY && typeof API_SECRET_KEY === 'string') {
        headers['x-api-key'] = API_SECRET_KEY
      }
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/chat`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        },
        REQUEST_TIMEOUT,
        abortSignal,
      )
      if (response.status === 429) {
        return handleRateLimitResponse(response)
      }
      if (!response.ok) {
        let errorData: { error?: string } = {}
        try {
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            errorData = await response.json()
          }
        } catch {
          // Ignore JSON parse errors for error responses
        }
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY * (attempt + 1))
          continue
        }
        throw new APIError(errorData.error || `Server error: ${response.status}`, response.status)
      }
      if (!response.body) {
        throw new APIError('No response body received')
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      const { fullAnswer, metadata } = await processStreamResponse(reader, decoder, onChunk, abortSignal)
      if (!metadata && !fullAnswer) {
        throw new APIError('No response received from server')
      }
      return {
        success: true,
        data: {
          answer: fullAnswer || metadata?.answer || 'No response generated',
          matchFound: metadata?.matchFound ?? false,
          intent: metadata?.intent,
          confidence: metadata?.matchFound ? 0.85 : 0.35,
        },
      }
    } catch (error) {
      if (error instanceof APIError) {
        lastError = error
        if (error.rateLimited) {
          return {
            success: false,
            error: error.message,
            rateLimited: true,
            retryAfter: error.retryAfter,
          }
        }
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, error: 'Request cancelled' }
      } else if (error instanceof Error) {
        lastError = error
      } else {
        lastError = new Error(String(error))
      }
      if (attempt < MAX_RETRIES) {
        const isNetworkError =
          error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'))
        if (isNetworkError || (error instanceof APIError && error.status && error.status >= 500)) {
          await sleep(RETRY_DELAY * (attempt + 1))
          continue
        }
      }
    }
  }
  return {
    success: false,
    error: lastError?.message || 'Failed to connect. Please check your connection and try again.',
  }
}

export async function sendChatMessage(
  query: string,
  existingIntents: string[] = [],
  abortSignal?: AbortSignal,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<ChatbotResponse> {
  return sendChatMessageStreaming(query, () => {}, existingIntents, abortSignal, conversationHistory)
}
