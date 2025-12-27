import { Chatbot } from '@/pages/chatbot/Chatbot'
import { motion } from 'motion/react'

const ChatbotContainer = ({ isOpen, isMini }: { isOpen: boolean; isMini: boolean }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="max-w-77 lg:max-w-118"
    style={{ overflow: 'hidden' }}
  >
    <Chatbot isMini={isMini} />
  </motion.div>
)

export default ChatbotContainer
