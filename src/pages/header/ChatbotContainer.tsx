import { Activity, lazy, Suspense, useState, useEffect } from 'react'
import { motion } from 'motion/react'

const Chatbot = lazy(() =>
  import('@/pages/chatbot/Chatbot').then((m) => ({ default: m.Chatbot })),
)

export const CHATBOT_ANIMATION_DURATION = 300

function ChatbotLoadingFallback() {
  return (
    <div
      className="text-muted-foreground flex min-h-[240px] w-full items-center justify-center text-sm"
      role="status"
    >
      Loading assistant…
    </div>
  )
}

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
            <Suspense fallback={<ChatbotLoadingFallback />}>
              <Chatbot isMini={isMini} />
            </Suspense>
          )}
        </div>
      </Activity>
    </motion.div>
  )
}

export default ChatbotContainer
