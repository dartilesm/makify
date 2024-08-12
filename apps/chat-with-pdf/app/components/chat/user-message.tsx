import { Alert, AlertDescription, AlertTitle } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { type Message } from "ai";

interface UserMessageProps {
  className?: string;
  message: Message;
}

export function UserMessage({ className, message }: UserMessageProps) {
  const messageData = message.data as Record<string, unknown>;

  return (
    <div
      className={cn("flex flex-col", className, {
        "px-1 py-1": messageData.quotedText,
      })}
    >
      {(messageData.quotedText as string) ? <Alert className="flex max-h-24 flex-col justify-between gap-2 rounded-md border-none bg-[#1f50bb] text-[#cdcdcd]">
          <AlertTitle>
            Quoted text from page {messageData.page as string}
          </AlertTitle>
          <AlertDescription
            className="line-clamp-2 text-ellipsis"
            title={messageData.quotedText as string}
          >
            {messageData.quotedText as string}
          </AlertDescription>
        </Alert> : null}
      <p
        className={cn({
          "px-3 py-2": messageData.quotedText,
          "px-4 py-3": !messageData.quotedText,
        })}
      >
        {message.content}
      </p>
    </div>
  );
}
