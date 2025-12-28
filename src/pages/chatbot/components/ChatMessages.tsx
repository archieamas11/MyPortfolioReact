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
    <div ref={scrollAreaRef} className="h-full w-full">
      <ScrollArea className="h-85 w-full" role="log" aria-label="Chat messages" aria-live="polite">
        <div className="flex min-h-full flex-col justify-start px-4 py-6 sm:px-6" role="list">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Start a conversation by asking a question or selecting a suggestion below
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
