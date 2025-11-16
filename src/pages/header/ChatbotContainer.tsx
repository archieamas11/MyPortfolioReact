import { Chatbot } from '@/components/Chatbot'
import { AnimatePresence, motion } from 'motion/react'

const ChatbotContainer = ({ isOpen }: { isOpen: boolean; isMini: boolean; isMobile: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
        <Chatbot />
      </motion.div>
    )}
  </AnimatePresence>
)

export default ChatbotContainer
