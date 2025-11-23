import { Textarea } from '@/components/ui/textarea'

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowRightIcon, LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sendChatMessage } from '@/api/api.chatbot'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  sources?: string[]
  confidence?: number
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. Ask me anything about my portfolio, skills, experience, or projects!",
      sender: 'bot',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' }
    setMessages((prev) => [...prev, userMessage])
    const query = input
    setInput('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = { id: Date.now() + 0.5, text: 'typing', sender: 'bot' }
    setMessages((prev) => [...prev, typingMessage])

    try {
      const response = await sendChatMessage(query)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.text !== 'typing'))

      if (response.success && response.data) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.data.answer,
          sender: 'bot',
          sources: response.data.sources,
          confidence: response.data.confidence,
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: response.error || 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
        }
        setMessages((prev) => [...prev, errorMessage])
        toast.error(response.error || 'Failed to get response')
      }
    } catch (error) {
      // Remove typing indicator on error
      setMessages((prev) => prev.filter((msg) => msg.text !== 'typing'))

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error connecting to the server. Please try again.',
        sender: 'bot',
      }
      setMessages((prev) => [...prev, errorMessage])
      toast.error('Failed to connect to chatbot service')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div>
      <Card className="border-none bg-transparent shadow-none" onWheel={(e) => e.stopPropagation()} style={{ overscrollBehavior: 'contain' }}>
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold">AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea ref={scrollAreaRef} className="h-80 overflow-y-auto pr-3">
            <div className="space-y-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-100 rounded-lg border p-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user' ? 'bg-white text-gray-950' : 'bg-[#4e67b0] text-gray-200'
                    }`}
                  >
                    {msg.text === 'typing' ? (
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-current"></span>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ ...props }) => (
                            <a {...props} href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline" />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="relative w-full max-w-105 space-y-5">
            <Textarea
              value={input}
              placeholder="Ask anything"
              onChange={(e) => {
                setInput(e.target.value)
                const target = e.target
                target.style.height = 'auto'
                const scrollHeight = target.scrollHeight
                const newHeight = Math.min(scrollHeight, 200)
                target.style.height = `${newHeight}px`
                target.style.overflow = scrollHeight > 200 ? 'auto' : 'hidden'
              }}
              className="glass-effect min-h-[40px] w-full resize-none rounded-lg py-3 pr-12 leading-relaxed"
              onKeyDown={(e) => {
                handleKeyPress(e)
              }}
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              size="icon"
              className="bg-primary absolute right-2 bottom-2 h-8 w-8 rounded-full"
            >
              {isLoading ? (
                <LoaderIcon className="text-primary-foreground h-4 w-4 animate-spin" />
              ) : (
                <ArrowRightIcon className="text-primary-foreground h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-muted-foreground mx-auto w-full max-w-105 text-center text-[8px] lg:text-xs">
            Powered by a custom RAG-enabled Ollama setup, delivering precise, context-aware responses about my portfolio, projects, and professional
            experience.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
