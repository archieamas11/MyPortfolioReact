import axios from 'axios'

const API_BASE_URL = 'http://localhost/MyPortfolioBackend'

interface ChatbotResponse {
  success: boolean
  data?: {
    answer: string
    sources: string[]
    used_personal_data: boolean
    confidence: number
  }
  error?: string
}

export async function sendChatMessage(query: string): Promise<ChatbotResponse> {
  try {
    const response = await axios.post<ChatbotResponse>(
      `${API_BASE_URL}/api.php`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = (error.response?.data as { error?: string })?.error || error.message
      return {
        success: false,
        error: errorMessage || 'Failed to connect to chatbot service',
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
