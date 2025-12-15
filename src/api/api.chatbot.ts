// RAG API base URL - update this with your deployed Vercel URL
const API_BASE_URL = import.meta.env.VITE_RAG_API_URL
const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY

// Request configuration
const REQUEST_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 2
const RETRY_DELAY = 1000

interface ChatbotResponse {
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

interface StreamMetadata {
  originalQuestion: string
  matchFound: boolean
  answer?: string | null
  intent: string
}

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  status?: number
  rateLimited: boolean
  retryAfter?: number

  constructor(message: string, status?: number, rateLimited = false, retryAfter?: number) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.rateLimited = rateLimited
    this.retryAfter = retryAfter
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Parse SSE events from a text chunk
 */
function parseSSEEvents(chunk: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = []
  const lines = chunk.split('\n')

  let currentEvent = 'message'
  let currentData = ''

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7).trim()
    } else if (line.startsWith('data: ')) {
      currentData = line.slice(6)
    } else if (line === '' && currentData) {
      events.push({ event: currentEvent, data: currentData })
      currentEvent = 'message'
      currentData = ''
    }
  }

  return events
}

/**
 * Make a fetch request with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // Combine external abort signal with timeout
  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

// Streaming callback for real-time updates
export async function sendChatMessageStreaming(
  query: string,
  onChunk: (text: string) => void,
  existingIntents: string[] = [],
  abortSignal?: AbortSignal,
): Promise<ChatbotResponse> {
  // Input validation
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return { success: false, error: 'Please enter a message' }
  }

  if (trimmedQuery.length > 2000) {
    return { success: false, error: 'Message is too long. Please keep it under 2000 characters.' }
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Check if aborted before attempting
      if (abortSignal?.aborted) {
        return { success: false, error: 'Request cancelled' }
      }

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(API_SECRET_KEY ? { 'x-api-key': API_SECRET_KEY } : {}),
          },
          body: JSON.stringify({
            prompt: trimmedQuery,
            existingIntents,
          }),
        },
        REQUEST_TIMEOUT,
        abortSignal,
      )

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10)
        return {
          success: false,
          error: `Too many requests. Please wait ${retryAfter} seconds.`,
          rateLimited: true,
          retryAfter,
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Retry on server errors
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY * (attempt + 1))
          continue
        }

        throw new APIError(errorData.error || `Server error: ${response.status}`, response.status)
      }

      if (!response.body) {
        throw new APIError('No response body received')
      }

      // Read SSE stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullAnswer = ''
      let metadata: StreamMetadata | null = null
      let buffer = ''

      while (true) {
        // Check for abort
        if (abortSignal?.aborted) {
          reader.cancel()
          return { success: false, error: 'Request cancelled' }
        }

        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete events from buffer
        const events = parseSSEEvents(buffer)

        // Keep incomplete data in buffer
        const lastNewline = buffer.lastIndexOf('\n\n')
        if (lastNewline !== -1) {
          buffer = buffer.slice(lastNewline + 2)
        }

        for (const { event, data } of events) {
          if (!data || data === '{}') continue

          try {
            if (event === 'metadata') {
              metadata = JSON.parse(data) as StreamMetadata
            } else if (event === 'text') {
              const text = JSON.parse(data) as string
              fullAnswer += text
              onChunk(text)
            } else if (event === 'error') {
              const errorData = JSON.parse(data) as { message: string }
              throw new APIError(errorData.message)
            }
            // 'done' event is handled by the stream ending
          } catch {
            // If not JSON, treat as raw text
            if (event === 'text' && typeof data === 'string') {
              fullAnswer += data
              onChunk(data)
            }
          }
        }
      }

      if (!metadata) {
        // If we got text but no metadata, still return success
        if (fullAnswer) {
          return {
            success: true,
            data: {
              answer: fullAnswer,
              matchFound: false,
              confidence: 0.5,
            },
          }
        }
        throw new APIError('No response received from server')
      }

      return {
        success: true,
        data: {
          answer: fullAnswer || metadata.answer || 'No response generated',
          matchFound: metadata.matchFound,
          intent: metadata.intent,
          confidence: metadata.matchFound ? 0.85 : 0.35,
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
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request cancelled' }
        }
        lastError = error
      }

      // Retry on network errors
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * (attempt + 1))
        continue
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to connect. Please check your connection and try again.',
  }
}

// Non-streaming version for simpler usage
export async function sendChatMessage(
  query: string,
  existingIntents: string[] = [],
  abortSignal?: AbortSignal,
): Promise<ChatbotResponse> {
  return sendChatMessageStreaming(query, () => {}, existingIntents, abortSignal)
}
