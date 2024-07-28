"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Message } from "ai";
import { useGlobalChat } from "hooks/use-global-chat";
import { QUICK_ACTIONS } from "./constants/message-quick-actions";
import { MessageActions } from "./types/message-actions";

type MessageQuickActionsProps = {
  quickActions: MessageActions[];
  message: Message;
  index: number;
  className?: string;
  onTooltipOpenChange?: (index: number) => void;
};

export function MessageQuickActions({
  quickActions = [] as MessageActions[],
  message,
  index,
  className,
  onTooltipOpenChange = () => null,
}: MessageQuickActionsProps) {
  const {
    useChatReturn: { messages, reload },
  } = useGlobalChat();

  const { toast } = useToast();

  function copyMessage(message: string) {
    navigator.clipboard.writeText(message);
  }
  function handleToggleGroupChange(action: QUICK_ACTIONS, message: Message) {
    if (action === QUICK_ACTIONS.COPY) {
      copyMessage(message.content);
      toast({
        title: "Message copied successfully!",
      });
    }
    if (action === QUICK_ACTIONS.REGENERATE) {
      reload();
      toast({
        title: "Regenerating response",
      });
    }
  }

  function handleTooltipOpenChange() {
    onTooltipOpenChange(index);
  }

  return (
    <ToggleGroup
      type="single"
      size="xs"
      className={cn("z-10 justify-start", className)}
      onClick={(e) => e.stopPropagation()}
      onValueChange={(action: QUICK_ACTIONS) =>
        handleToggleGroupChange(action, message)
      }
    >
      {quickActions.map(
        ({ Icon, label, value, onlyLastMessage }, quickActionIndex) => {
          if (onlyLastMessage && index !== messages.length - 1) {
            return null;
          }
          return (
            <Tooltip
              delayDuration={0}
              onOpenChange={handleTooltipOpenChange}
              key={`message-quick-action-${message.id}${quickActionIndex}`}
            >
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={value}
                  onClick={(e) => e.stopPropagation()}
                  className="flex aspect-square h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-gray-200 data-[state=on]:bg-transparent hover:data-[state=on]:bg-gray-200"
                >
                  <Icon className="text-primary h-4 w-4 text-opacity-70" />
                  <span className="sr-only">{label}</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="top"
                className="bg-primary rounded-md text-xs"
                arrowPadding={2}
                sideOffset={6}
              >
                {label}
              </TooltipContent>
            </Tooltip>
          );
        },
      )}
    </ToggleGroup>
  );
}
