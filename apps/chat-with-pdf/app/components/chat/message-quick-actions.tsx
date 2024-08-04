"use client";

import { updateChatMessages } from "@/app/actions/update-chat-messages";
import {
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Chat } from "@prisma/client";
import { Message } from "ai";
import { AnimatePresence, CustomDomComponent, motion } from "framer-motion";
import { useGlobalChat } from "hooks/use-global-chat";
import {
  BookmarkIcon,
  CheckIcon,
  CopyIcon,
  FlagIcon,
  LucideProps,
  RefreshCcwIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { forwardRef, RefAttributes, useState } from "react";
import { QUICK_ACTIONS } from "./constants/message-quick-actions";
import { MessageActions } from "./types/message-actions";

type MessageQuickActionsProps = {
  message: Message;
  index: number;
  className?: string;
  onTooltipOpenChange?: (index: number) => void;
};

const quickActions: MessageActions[] = [
  {
    Icon: CopyIcon,
    SucessIcon: CheckIcon,
    getLabel: () => "Copy message",
    value: QUICK_ACTIONS.COPY,
    onlyLastMessage: false,
  },
  {
    Icon: RefreshCcwIcon,
    getLabel: () => "Regenerate response",
    value: QUICK_ACTIONS.REGENERATE,
    onlyLastMessage: true,
  },
  {
    Icon: BookmarkIcon,
    active: {
      Icon: forwardRef((props, ref) => (
        <BookmarkIcon ref={ref} className="fill-primary h-4 w-4" />
      )),
      condition: (message: Message) => {
        const messageData = (message?.data as Record<string, any>) || {};
        return messageData?.bookmarked;
      },
    },
    getLabel: (message: Message) => {
      const messageData = (message?.data as Record<string, any>) || {};
      return messageData?.bookmarked
        ? "Unbookmark message"
        : "Bookmark message";
    },
    value: QUICK_ACTIONS.BOOKMARK,
    onlyLastMessage: false,
  },
  {
    Icon: FlagIcon,
    getLabel: () => "Report message",
    value: QUICK_ACTIONS.REPORT,
    onlyLastMessage: false,
  },
];

export function MessageQuickActions({
  message,
  index,
  className,
  onTooltipOpenChange = () => null,
}: MessageQuickActionsProps) {
  const params = useParams();
  const [showSuccessIcon, setShowSuccessIcon] = useState<
    Record<MessageActions["value"], boolean>
  >({});
  const {
    useChatReturn: { messages, reload },
  } = useGlobalChat();

  const { toast } = useToast();

  async function copyMessage(message: string) {
    let response: { success: boolean; error: unknown } = {
      success: false,
      error: null,
    };
    try {
      await navigator.clipboard.writeText(message);
      response.success = true;
    } catch (error) {
      response.error = error;
    }

    return response;
  }

  async function handleToggleGroupChange(
    action: QUICK_ACTIONS,
    message: Message,
  ) {
    if (action === QUICK_ACTIONS.COPY) {
      const { success } = await copyMessage(message.content);
      setShowSuccessIcon((prev) => ({ ...prev, [QUICK_ACTIONS.COPY]: true }));
      const toastNotifitcation = toast({
        title: success
          ? "Message copied successfully!"
          : "Failed to copy message",
        duration: Infinity,
      });
      setTimeout(() => {
        setShowSuccessIcon((prev) => ({
          ...prev,
          [QUICK_ACTIONS.COPY]: false,
        }));
        toastNotifitcation.dismiss();
      }, 3000);
    }
    if (action === QUICK_ACTIONS.REGENERATE) {
      reload();
      toast({
        title: "Regenerating response",
      });
    }
    if (action === QUICK_ACTIONS.BOOKMARK) {
      if (typeof messages[index] === "object") {
        const messageData = (messages[index].data as Record<string, any>) || {};
        messages[index].data = {
          ...messageData,
          bookmarked: !messageData?.bookmarked,
        };
        await updateChatMessages({
          documentId: params?.documentId as string,
          messages: messages as unknown as Chat["messages"],
        });
        toast({
          title: messageData?.bookmarked
            ? "Message unbookmarked"
            : "Message bookmarked",
          duration: 3000,
        });
      }
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
      <TooltipProvider delayDuration={0}>
        {quickActions.map(
          (
            { Icon, SucessIcon, active, getLabel, value, onlyLastMessage },
            quickActionIndex,
          ) => {
            const AnimatedIcon = motion(Icon);
            const AnimatedSucessIcon = (
              SucessIcon ? motion(SucessIcon) : SucessIcon
            ) as CustomDomComponent<LucideProps & RefAttributes<SVGSVGElement>>;
            const ActiveIcon = active?.Icon;
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
                    className="hover:text-primary text-primary group flex aspect-square h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-gray-200 data-[state=on]:bg-transparent hover:data-[state=on]:bg-gray-200"
                  >
                    <AnimatePresence mode="wait">
                      {ActiveIcon && active.condition(message) && (
                        <ActiveIcon className="h-4 w-4" stroke="currentColor" />
                      )}
                      {!active?.condition?.(message) &&
                        !showSuccessIcon[value] && (
                          <AnimatedIcon
                            className="h-4 w-4 text-opacity-70"
                            stroke="currentColor"
                            key={`message-quick-action-icon-${message.id}${quickActionIndex}`}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      {!active?.condition?.(message) &&
                        showSuccessIcon[value] &&
                        SucessIcon && (
                          <AnimatedSucessIcon
                            className="h-4 w-4"
                            stroke="currentColor"
                            key={`message-quick-action-sucess-icon-${message.id}${quickActionIndex}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          />
                        )}
                    </AnimatePresence>
                    <span className="sr-only">{getLabel(message)}</span>
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="top"
                  className="bg-primary rounded-md text-xs"
                  arrowPadding={2}
                  sideOffset={6}
                >
                  {getLabel(message)}
                </TooltipContent>
              </Tooltip>
            );
          },
        )}
      </TooltipProvider>
    </ToggleGroup>
  );
}

function QuickActionButton({ Icon, SucessIcon, active }: MessageActions) {
  const AnimatedIcon = motion(Icon);
  const AnimatedSucessIcon = (
    SucessIcon ? motion(SucessIcon) : SucessIcon
  ) as CustomDomComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  const ActiveIcon = active?.Icon;
}
