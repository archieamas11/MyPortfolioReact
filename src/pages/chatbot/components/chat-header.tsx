import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ChatHeaderProps {
  isLoading: boolean;
  onClear: () => void;
}

export function ChatHeader({ onClear, isLoading }: ChatHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6">
      <CardTitle className="flex items-center gap-2 font-semibold text-base text-foreground">
        Portfolio Chatbot
      </CardTitle>
      <Button
        aria-label="Clear chat history"
        disabled={isLoading}
        onClick={onClear}
        size="icon"
        variant="ghost"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </CardHeader>
  );
}
