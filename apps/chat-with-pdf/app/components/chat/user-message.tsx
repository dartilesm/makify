import { Alert, AlertDescription, AlertTitle } from "@makify/ui";
import { Message } from "ai";

type UserMessageProps = {
  className?: string;
  message: Message;
};

export function UserMessage({ className, message }: UserMessageProps) {
  const messageData = message.data as Record<string, unknown>;

  return (
    <div className="flex flex-col gap-2">
      {(messageData?.quotedText as string) && (
        <Alert className="bg-primary flex max-h-24 flex-col justify-between gap-2 border-slate-600 text-[#b5b5b5]">
          <AlertTitle>
            Quoted text from page {messageData?.page as string}
          </AlertTitle>
          <AlertDescription className="line-clamp-2 text-ellipsis">
            {messageData?.quotedText as string}
          </AlertDescription>
        </Alert>
      )}
      <p>{message.content}</p>
    </div>
  );
}
