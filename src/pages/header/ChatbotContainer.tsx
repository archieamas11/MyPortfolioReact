import { Activity } from 'react'
import { useState, useEffect } from 'react'
import { Chatbot } from '@/pages/chatbot/Chatbot'
import { motion } from 'motion/react'

export const CHATBOT_ANIMATION_DURATION = 300

const ChatbotContainer = ({ isOpen, isMini }: { isOpen: boolean; isMini: boolean }) => {
  const [activityMode, setActivityMode] = useState<'visible' | 'hidden'>('hidden')

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

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: CHATBOT_ANIMATION_DURATION / 1000, ease: 'easeInOut' }}
      className="max-w-77 lg:max-w-118"
      style={{ overflow: 'hidden' }}
    >
      <Activity mode={activityMode}>
        <div>
          <Chatbot isMini={isMini} />
        </div>
      </Activity>
    </motion.div>
  )
}

export default ChatbotContainer
