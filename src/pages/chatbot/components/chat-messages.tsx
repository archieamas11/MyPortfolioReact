import type { RefObject } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types/types";
import { useAutoScroll } from "../../../hooks/use-auto-scroll";
import { MessageBubble } from "./message-bubble";

interface ChatMessagesProps {
  messages: Message[];
  scrollAreaRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, scrollAreaRef }: ChatMessagesProps) {
  useAutoScroll(scrollAreaRef, messages);

  return (
    <div className="h-full w-full" ref={scrollAreaRef}>
      <ScrollArea
        aria-label="Chat messages"
        aria-live="polite"
        className="h-85 w-full"
        role="log"
      >
        <ul className="flex min-h-full flex-col justify-start px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Start a conversation by asking a question or selecting a
                  suggestion below
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
        </ul>
      </ScrollArea>
    </div>
  );
}
