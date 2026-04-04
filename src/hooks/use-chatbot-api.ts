import { type MutableRefObject, useCallback, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { sendChatMessageStreaming } from "@/api/api-chatbot";
import {
  type ToastDefinition,
  useToast,
} from "@/components/ui/toast/toast-provider";
import type { ChatbotResponse, Message } from "@/types/types";

interface UseChatbotApiParams {
  addMessages: (messages: Message[]) => void;
  messages: Message[];
  setRateLimitedUntil: (timestamp: number) => void;
  updateMessage: (id: number, updates: Partial<Message>) => void;
}

const CANCELLED_TEXT = "Cancelled.";
const GENERIC_ERROR_TEXT =
  "Something went wrong while generating a reply. Please try again.";
const CONNECTION_ERROR_TEXT =
  "We couldn't reach the chatbot service. Please try again in a moment.";

const HAPTIC_COOLDOWN_MS = 70;
const HAPTIC_DURATION_MS = 12;

function extractConversationHistory(
  messages: Message[]
): Array<{ role: "user" | "assistant"; content: string }> {
  const history: Array<{ role: "user" | "assistant"; content: string }> = [];
  const pairs: Array<{ user: Message; bot: Message }> = [];

  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];

    if (current.sender !== "user" || current.status !== "complete") {
      continue;
    }

    let bot: Message | null = null;

    for (let j = i + 1; j < messages.length; j++) {
      if (messages[j].sender === "bot" && messages[j].status === "complete") {
        bot = messages[j];
        break;
      }
      if (messages[j].sender === "user") {
        break;
      }
    }

    if (bot) {
      pairs.push({ user: current, bot });
    }
  }

  const recent = pairs.slice(-10);

  for (const pair of recent) {
    history.push(
      { role: "user", content: pair.user.text },
      { role: "assistant", content: pair.bot.text || "" }
    );
  }

  return history;
}

function createMessages(input: string): {
  userMessage: Message;
  botMessage: Message;
} {
  const now = Date.now();

  const userMessage: Message = {
    id: now,
    text: input,
    sender: "user",
    status: "complete",
    timestamp: now,
  };

  const botMessage: Message = {
    id: now + 1,
    text: "",
    sender: "bot",
    status: "streaming",
    timestamp: now,
  };

  return { userMessage, botMessage };
}

function handleStreamUpdate(
  botMessageId: number,
  onChunkHaptic: (chunk: string) => void,
  updateMessage: UseChatbotApiParams["updateMessage"]
): (chunk: string) => void {
  let accumulatedText = "";

  return (chunk: string) => {
    accumulatedText += chunk;
    onChunkHaptic(chunk);

    updateMessage(botMessageId, {
      text: accumulatedText,
      status: "streaming",
    });
  };
}

function handleSuccess(
  botMessageId: number,
  response: ChatbotResponse,
  updateMessage: UseChatbotApiParams["updateMessage"]
): void {
  const data = response.data;
  if (!data) {
    return;
  }
  updateMessage(botMessageId, {
    text: data.answer,
    confidence: data.confidence,
    sources: data.matchFound ? ["Knowledge Base"] : undefined,
    status: "complete",
  });
}

function handleError(
  response: ChatbotResponse,
  botMessageId: number,
  abortControllerRef: MutableRefObject<AbortController | null>,
  setRateLimitedUntil: (timestamp: number) => void,
  updateMessage: UseChatbotApiParams["updateMessage"],
  showToast: (toast: ToastDefinition) => string,
  toUserFacingErrorText: (error?: string) => string
): void {
  if (response.rateLimited && response.retryAfter) {
    setRateLimitedUntil(Date.now() + response.retryAfter * 1000);
  }

  const isCancelled =
    response.error === "Request cancelled" ||
    abortControllerRef.current?.signal.aborted;

  const errorText = toUserFacingErrorText(response.error);

  updateMessage(botMessageId, {
    text: isCancelled ? "Cancelled." : errorText,
    status: isCancelled ? "complete" : "error",
  });

  if (!isCancelled) {
    showToast({ variant: "error", description: errorText });
  }
}

function findLastBotMessage(messages: Message[]): Message | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.sender === "bot") {
      return message;
    }
  }
  return undefined;
}

export function useChatbotApi({
  messages,
  updateMessage,
  addMessages,
  setRateLimitedUntil,
}: UseChatbotApiParams) {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { showToast } = useToast();
  const { trigger } = useWebHaptics();

  const lastHapticAtRef = useRef(0);

  const toUserFacingErrorText = useCallback((error?: string): string => {
    if (!error) {
      return GENERIC_ERROR_TEXT;
    }
    if (
      error === "Request cancelled" ||
      error.startsWith("Too many requests") ||
      error === "Please enter a message" ||
      error.startsWith("Message is too long")
    ) {
      return error;
    }
    return GENERIC_ERROR_TEXT;
  }, []);

  const maybeTriggerStreamingHaptic = useCallback(
    (chunkText: string) => {
      if (!chunkText) {
        return;
      }
      const runHaptic = trigger;
      if (!runHaptic) {
        return;
      }
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      const now =
        typeof performance === "undefined" ? Date.now() : performance.now();

      if (now - lastHapticAtRef.current < HAPTIC_COOLDOWN_MS) {
        return;
      }

      lastHapticAtRef.current = now;

      Promise.resolve(runHaptic(HAPTIC_DURATION_MS, { intensity: 0.15 })).catch(
        () => undefined
      );
    },
    [trigger]
  );

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    lastHapticAtRef.current = 0;

    const lastBot = findLastBotMessage(messages);

    if (lastBot?.status === "streaming") {
      updateMessage(lastBot.id, {
        text: lastBot.text || CANCELLED_TEXT,
        status: "complete",
      });
    }
  }, [messages, updateMessage]);

  const sendMessage = useCallback(
    async (input: string, isRateLimited: boolean) => {
      const trimmed = input.trim();
      if (!trimmed || isLoading || isRateLimited) {
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const { userMessage, botMessage } = createMessages(trimmed);
      const history = extractConversationHistory(messages);

      addMessages([userMessage, botMessage]);
      setIsLoading(true);
      lastHapticAtRef.current = 0;

      try {
        const response = await sendChatMessageStreaming(
          trimmed,
          handleStreamUpdate(
            botMessage.id,
            maybeTriggerStreamingHaptic,
            updateMessage
          ),
          [],
          controller.signal,
          history.length ? history : undefined
        );

        if (response.success && response.data) {
          handleSuccess(botMessage.id, response, updateMessage);
        } else {
          handleError(
            response,
            botMessage.id,
            abortControllerRef,
            setRateLimitedUntil,
            updateMessage,
            showToast,
            toUserFacingErrorText
          );
        }
      } catch {
        const isCancelled = abortControllerRef.current?.signal.aborted;

        updateMessage(botMessage.id, {
          text: isCancelled ? CANCELLED_TEXT : CONNECTION_ERROR_TEXT,
          status: isCancelled ? "complete" : "error",
        });

        if (!isCancelled) {
          showToast({
            variant: "error",
            description: CONNECTION_ERROR_TEXT,
          });
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      addMessages,
      isLoading,
      messages,
      maybeTriggerStreamingHaptic,
      setRateLimitedUntil,
      showToast,
      updateMessage,
      toUserFacingErrorText,
    ]
  );

  return {
    isLoading,
    sendMessage,
    cancelRequest,
  };
}
