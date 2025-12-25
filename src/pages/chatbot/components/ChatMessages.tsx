import { type RefObject } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'
import { useAutoScroll } from '../../../hooks/useAutoScroll'
import type { Message } from '@/types/types'

interface ChatMessagesProps {
  messages: Message[]
  scrollAreaRef: RefObject<HTMLDivElement | null>
}

export function ChatMessages({ messages, scrollAreaRef }: ChatMessagesProps) {
  useAutoScroll(scrollAreaRef, messages)

  return (
    <div ref={scrollAreaRef}>
      <ScrollArea
        className="h-80 overflow-y-auto lg:h-90"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div className="space-y-5" role="list">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
