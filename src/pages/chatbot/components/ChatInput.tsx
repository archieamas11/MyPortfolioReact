import type React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { IconPlayerStopFilled } from '@tabler/icons-react'
import { useRef, useState, useCallback } from 'react'
import { ArrowUpIcon } from 'lucide-react'

interface RagInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
  isLoading: boolean
  isRateLimited: boolean
  disabled?: boolean
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  isRateLimited,
  disabled,
}: RagInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      onChange(newValue)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }

      setIsExpanded(newValue.length > 50 || newValue.includes('\n'))
    },
    [onChange],
  )

  const resetHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setIsExpanded(false)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (value.trim() && !isRateLimited && !disabled) {
        onSubmit()
        resetHeight()
      }
    },
    [value, onSubmit, isRateLimited, disabled, resetHeight],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (isLoading) {
          onCancel()
        } else if (value.trim() && !isRateLimited && !disabled) {
          onSubmit()
          resetHeight()
        }
      }
    },
    [value, onSubmit, onCancel, isLoading, isRateLimited, disabled, resetHeight],
  )

  const handleButtonClick = useCallback(() => {
    if (isLoading) {
      onCancel()
    } else {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }
  }, [isLoading, onCancel, handleSubmit])

  return (
    <>
      <div className="w-full">
        <form onSubmit={handleSubmit} className="group/composer w-full">
          <div
            className={cn(
              'glass-effect dark:bg-muted/50 border-border bg-background/50 mx-auto max-h-35 w-full max-w-2xl cursor-text overflow-clip border bg-clip-padding p-1 shadow-lg transition-all duration-200 hover:shadow-xl md:p-2',
              {
                'grid grid-cols-1 grid-rows-[auto_1fr_auto] rounded-lg': isExpanded,
                'grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] rounded-lg': !isExpanded,
                'opacity-50': isRateLimited,
              },
            )}
            style={{
              gridTemplateAreas: isExpanded
                ? "'header' 'primary' 'footer'"
                : "'header header header' 'leading primary trailing' '. footer .'",
            }}
          >
            <div
              className={cn('flex min-h-14 items-center overflow-x-hidden px-1.5', {
                'mb-0 px-2 py-1': isExpanded,
                '-my-2.5': !isExpanded,
              })}
              style={{ gridArea: 'primary' }}
            >
              <div className="max-h-52 flex-1 overflow-auto">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isRateLimited ? 'Please wait before sending another message...' : 'Ask anything'
                  }
                  className="placeholder:text-muted-foreground scrollbar-thin md:text-md min-h-0 resize-none rounded-none border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 lg:text-base dark:bg-transparent"
                  rows={1}
                  disabled={isRateLimited || disabled}
                  aria-label="Chat message input"
                  maxLength={2000}
                />
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ gridArea: isExpanded ? 'footer' : 'trailing' }}>
              <div className="ms-auto flex items-center gap-1.5">
                {/* <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent h-9 w-9 rounded-full"
                  disabled={isRateLimited || disabled}
                >
                  <IconMicrophone className="text-muted-foreground size-5" />
                </Button> */}
                {(value.trim() || isLoading) && (
                  <Button
                    type="button"
                    onClick={handleButtonClick}
                    size="icon"
                    disabled={!isLoading && (isRateLimited || !value.trim() || disabled)}
                    aria-label={isLoading ? 'Cancel message' : 'Send message'}
                    className="bg-accent/40 text-primary h-9 w-9 rounded-full shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    {isLoading ? (
                      <IconPlayerStopFilled className="size-5" />
                    ) : (
                      <ArrowUpIcon className="size-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      {isRateLimited && (
        <p className="text-muted-foreground mt-2 text-center text-xs" role="alert">
          Rate limited. Please wait before sending another message.
        </p>
      )}
    </>
  )
}
