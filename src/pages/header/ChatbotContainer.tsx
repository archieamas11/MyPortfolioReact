import { Chatbot } from '@/components/Chatbot'
import { AnimatePresence, motion } from 'motion/react'

const ChatbotContainer = ({ isOpen, isMini }: { isOpen: boolean; isMini: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="max-w-77 lg:max-w-118"
      >
        <Chatbot isMini={isMini} />
      </motion.div>
    )}
  </AnimatePresence>
)

export default ChatbotContainer
