import { useCallback } from 'react'
import { ArrowRightIcon, StopCircleIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTextareaAutoResize } from '../../../hooks/useTextareaAutoResize'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
  isLoading: boolean
  isRateLimited: boolean
  disabled?: boolean
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  isRateLimited,
  disabled,
}: ChatInputProps) {
  const { textareaRef, handleChange, resetHeight } = useTextareaAutoResize()

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleChange(e)
      onChange(e.target.value)
    },
    [handleChange, onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
        resetHeight()
      }
    },
    [onSubmit, resetHeight],
  )

  const handleSubmit = useCallback(() => {
    onSubmit()
    resetHeight()
  }, [onSubmit, resetHeight])

  return (
    <>
      <div className="relative mb-6 w-full max-w-full">
        <Textarea
          ref={textareaRef}
          value={value}
          placeholder={isRateLimited ? 'Please wait before sending another message...' : 'Ask anything'}
          onChange={handleInputChange}
          className={cn(
            'glass-effect md:text-md min-h-10 w-full resize-none rounded-lg py-3 pr-12 text-sm lg:text-base',
            {
              'opacity-50': isRateLimited,
            },
          )}
          onKeyDown={handleKeyDown}
          disabled={isRateLimited || disabled}
          aria-label="Chat message input"
          maxLength={2000}
        />
        <Button
          onClick={isLoading ? onCancel : handleSubmit}
          disabled={!isLoading && (isRateLimited || !value.trim() || disabled)}
          aria-label={isLoading ? 'Cancel message' : 'Send message'}
          size="icon"
          className={cn(
            'bg-accent hover:bg-accent/80 absolute right-2 bottom-1.75 h-8 w-8 rounded-full',
            isLoading && 'bg-muted-foreground hover:bg-muted-foreground/80',
          )}
        >
          {isLoading ? (
            <StopCircleIcon className="text-accent-foreground h-4 w-4" />
          ) : (
            <ArrowRightIcon className="text-accent-foreground h-4 w-4" />
          )}
        </Button>
      </div>
      {isRateLimited && (
        <p className="text-muted-foreground text-center text-xs" role="alert">
          Rate limited. Please wait before sending another message.
        </p>
      )}
    </>
  )
}
