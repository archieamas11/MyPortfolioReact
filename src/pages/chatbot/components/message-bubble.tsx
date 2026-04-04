import { AlertCircleIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

  let messageContent: ReactNode
  if (isStreaming && !message.text) {
    messageContent = <TypingIndicator />
  } else if (isError) {
    messageContent = (
      <div className="flex items-start gap-2">
        <AlertCircleIcon className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
        <span className="text-destructive">{message.text}</span>
      </div>
    )
  } else {
    messageContent = (
      <ReactMarkdown
        components={{
          a: ({ ...props }) => (
            <a
              {...props}
              className="text-blue-600 underline underline-offset-4 dark:text-blue-300"
              href={props.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {props.children}
            </a>
          ),
          p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
          ul: ({ ...props }) => <ul {...props} className="mb-2 ml-4 list-disc space-y-1 last:mb-0" />,
          ol: ({ ...props }) => <ol {...props} className="mb-2 ml-4 list-decimal space-y-1 last:mb-0" />,
          code: ({ ...props }) => (
            <code
              {...props}
              className={cn(
                'rounded px-1.5 py-0.5 font-mono text-xs',
                isUser ? 'bg-primary-foreground/20' : 'bg-muted',
              )}
            />
          ),
          pre: ({ ...props }) => (
            <pre
              {...props}
              className={cn(
                'overflow-x-auto rounded-lg p-3 text-xs',
                isUser ? 'bg-primary-foreground/20' : 'bg-muted',
              )}
            />
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {message.text}
      </ReactMarkdown>
    )
  }

  return (
    <li
      className={cn('flex', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
    >
      <div
        className={cn(
          'relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed wrap-break-word sm:max-w-[75%]',
          'transition-all duration-200 ease-out',
          {
            'bg-primary text-primary-foreground mr-2 ml-auto rounded-br-md shadow-md hover:shadow-lg sm:mr-3':
              isUser,
            'bg-accent/40 text-primary mr-auto ml-2 rounded-bl-md font-normal shadow-sm sm:ml-3': !isUser,
            'border-destructive/50 bg-destructive/10 border-2': isError,
          },
        )}
      >
        {messageContent}
        {isStreaming && message.text && (
          <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-current" />
        )}
      </div>
    </li>
  )
}
