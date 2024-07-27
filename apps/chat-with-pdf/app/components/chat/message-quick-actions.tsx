"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "@makify/ui";
import { QUICK_ACTIONS } from "./constants/message-quick-actions";
import { Message } from "ai";
import { MessageActions } from "./types/message-actions";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { cn } from "@makify/ui/lib/utils";

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
  const params = useParams();

  const { messages, reload } = useChat({
    id: params.documentId as string,
    body: {
      documentId: params.documentId,
    },
  });

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
      onValueChange={(action: QUICK_ACTIONS) =>
        handleToggleGroupChange(action, message)
      }
    >
      {quickActions.map(({ Icon, label, value, onlyLastMessage }) => {
        if (onlyLastMessage && index !== messages.length - 1) {
          return null;
        }
        return (
          <Tooltip delayDuration={0} onOpenChange={handleTooltipOpenChange}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={value}
                className="flex aspect-square h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-gray-200"
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
      })}
    </ToggleGroup>
  );
}
