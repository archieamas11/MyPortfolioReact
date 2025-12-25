import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AlertCircleIcon } from 'lucide-react'
import { TypingIndicator } from '@/components/ui/typing-indicator'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/types'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  const isStreaming = message.status === 'streaming'
  const isError = message.status === 'error'

  return (
    <div
      className={cn('flex', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
      role="listitem"
    >
      <div
        className={cn(
          'relative max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-[1.45] break-words shadow-sm',
          'transition-all',
          {
            'mr-3 ml-auto rounded-br-md bg-white text-gray-950': isUser,
            'bg-accent/40 text-primary mr-auto ml-3 rounded-bl-md font-normal': !isUser,
            'border-destructive/50 bg-destructive/10 border': isError,
          },
        )}
      >
        {isStreaming && !message.text ? (
          <TypingIndicator />
        ) : isError ? (
          <div className="flex items-start gap-2">
            <AlertCircleIcon className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
            <span className="text-destructive">{message.text}</span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <a
                  {...props}
                  href={props.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-600"
                />
              ),
              p: ({ ...props }) => <p {...props} className="last:mb-0" />,
              ul: ({ ...props }) => <ul {...props} className="ml-4 list-disc last:mb-0" />,
              ol: ({ ...props }) => <ol {...props} className="ml-4 list-decimal last:mb-0" />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
        {isStreaming && message.text && (
          <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-current" />
        )}
      </div>
    </div>
  )
}
