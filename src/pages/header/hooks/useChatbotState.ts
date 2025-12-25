import { useState, useCallback } from 'react'

export const useChatbotState = (): {
  isChatbotOpen: boolean
  handleChatbotToggle: () => void
  handleChatbotClose: () => void
} => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const handleChatbotClose = useCallback(() => {
    setIsChatbotOpen(false)
  }, [])

  const handleChatbotToggle = useCallback(() => {
    setIsChatbotOpen((prev) => !prev)
  }, [])

  return {
    isChatbotOpen,
    handleChatbotToggle,
    handleChatbotClose,
  }
}
