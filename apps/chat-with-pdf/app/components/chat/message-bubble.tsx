import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Message } from "ai";
import { useGlobalChat } from "hooks/use-global-chat";
import { AssistantMessage } from "./assistant-message";
import { MESSAGE_TYPE } from "./constants/message-type";
import { MessageQuickActions } from "./message-quick-actions";
import { UserMessage } from "./user-message";

type MessageBubbleProps =
  | {
      message: Message;
      index: number;
      onTooltipOpenChange: (index: number) => void;
      tooltipOpen: boolean;
      isTyping?: boolean;
    }
  | {
      isTyping: true;
      index?: never;
      onTooltipOpenChange?: never;
      tooltipOpen?: never;
      message?: never;
    };

export function MessageBubble({
  message,
  index,
  onTooltipOpenChange = () => null,
  tooltipOpen,
  isTyping,
}: MessageBubbleProps) {
  const {
    useChatReturn: { messages },
  } = useGlobalChat();

  function getMessageType(message: Message) {
    return (message?.data as Record<string, string>)
      ?.messageType as MESSAGE_TYPE;
  }

  function isAHiddenMessage() {
    if (!message) return null;

    const isUserMessage = message?.role === "user";

    const isAnIntroductionMessage =
      getMessageType(message) === MESSAGE_TYPE.INTRODUCTION;
    const isASuggestionMessage =
      getMessageType(message) === MESSAGE_TYPE.SUGGESTION_MESSAGES;

    return isUserMessage && (isAnIntroductionMessage || isASuggestionMessage);
  }

  if (isAHiddenMessage()) return null;

  return (
    <div
      className={cn("flex w-full text-left", {
        "justify-end": message?.role === "user",
        "mt-auto": index === 0, // TODO: Fix this to start from the bottom
      })}
      data-message-bubble={isTyping ? undefined : true}
    >
      <div className="relative max-w-[70%] space-y-1.5">
        <TooltipProvider>
          <Tooltip
            delayDuration={0}
            onOpenChange={() => onTooltipOpenChange(!isTyping ? index : -1)}
            open={tooltipOpen}
          >
            <TooltipTrigger asChild>
              <div
                className={cn("w-fit rounded-md px-4 py-3 text-sm", {
                  "bg-gray-100 dark:bg-gray-800":
                    message?.role === "assistant" || isTyping,
                  "bg-primary text-primary-foreground bg-opacity-20 ":
                    message?.role === "user",
                })}
              >
                {isTyping && (
                  <div className="flex h-5 items-center gap-2">
                    <div className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                      <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
                      <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                    </div>
                  </div>
                )}
                {!isTyping && message?.role === "user" && (
                  <UserMessage message={message} />
                )}
                {!isTyping && message?.role === "assistant" && (
                  <>
                    <AssistantMessage
                      type={getMessageType(messages[index - 1]!)}
                    >
                      {message.content}
                    </AssistantMessage>
                    {index !== messages.length - 1 && (
                      <TooltipContent
                        align="start"
                        side="bottom"
                        className="rounded-md border-[1px] border-gray-200 bg-gray-50 p-1"
                        sideOffset={-10}
                        alignOffset={10}
                        avoidCollisions={false}
                      >
                        <MessageQuickActions
                          index={index}
                          onTooltipOpenChange={onTooltipOpenChange}
                          message={message}
                        />
                      </TooltipContent>
                    )}
                  </>
                )}
              </div>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        {index === messages.length - 1 && message?.role === "assistant" && (
          <MessageQuickActions
            className="ml-4"
            index={index}
            message={message}
            onTooltipOpenChange={onTooltipOpenChange}
          />
        )}
      </div>
    </div>
  );
}
