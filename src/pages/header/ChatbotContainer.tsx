import { Activity, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Chatbot } from '@/pages/chatbot/Chatbot'

export const CHATBOT_ANIMATION_DURATION = 300


const ChatbotContainer = ({ isOpen, isMini }: { isOpen: boolean; isMini: boolean }) => {
  const [activityMode, setActivityMode] = useState<'visible' | 'hidden'>('hidden')
  const [hasOpenedChatbot, setHasOpenedChatbot] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setHasOpenedChatbot(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setActivityMode('visible')
    } else {
      const timer = setTimeout(() => {
        setActivityMode('hidden')
      }, CHATBOT_ANIMATION_DURATION)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const shouldMountChatbot = isOpen || hasOpenedChatbot

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: CHATBOT_ANIMATION_DURATION / 1000, ease: 'easeInOut' }}
      className="max-w-76 md:max-w-118 lg:max-w-118"
      style={{ overflow: 'hidden' }}
    >
      <Activity mode={activityMode}>
        <div>
          {shouldMountChatbot && (
            <Chatbot isMini={isMini} />
          )}
        </div>
      </Activity>
    </motion.div>
  )
}

export default ChatbotContainer
