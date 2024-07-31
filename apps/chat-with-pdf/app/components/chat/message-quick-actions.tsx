"use client";

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
import { Message } from "ai";
import { useGlobalChat } from "hooks/use-global-chat";
import { memo, RefAttributes, useState } from "react";
import { QUICK_ACTIONS } from "./constants/message-quick-actions";
import { MessageActions } from "./types/message-actions";
import { AnimatePresence, CustomDomComponent, motion } from "framer-motion";
import { LucideProps } from "lucide-react";

type MessageQuickActionsProps = {
  quickActions: MessageActions[];
  message: Message;
  index: number;
  className?: string;
  onTooltipOpenChange?: (index: number) => void;
};

function MessageQuickActionsComp({
  quickActions = [] as MessageActions[],
  message,
  index,
  className,
  onTooltipOpenChange = () => null,
}: MessageQuickActionsProps) {
  const [showSuccessIcon, setShowSuccessIcon] = useState<
    Record<MessageActions["value"], boolean>
  >({});
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
      setShowSuccessIcon((prev) => ({ ...prev, [QUICK_ACTIONS.COPY]: true }));
      const toastNotifitcation = toast({
        title: "Message copied successfully!",
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
            { Icon, SucessIcon, label, value, onlyLastMessage },
            quickActionIndex,
          ) => {
            const AnimatedIcon = motion(Icon);
            const AnimatedSucessIcon = (
              SucessIcon ? motion(SucessIcon) : SucessIcon
            ) as CustomDomComponent<LucideProps & RefAttributes<SVGSVGElement>>;
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
                    className="flex aspect-square h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-gray-200 data-[state=on]:bg-transparent hover:data-[state=on]:bg-gray-200"
                  >
                    <AnimatePresence mode="wait">
                      {!showSuccessIcon[value] && (
                        <AnimatedIcon
                          className="text-primary h-4 w-4 text-opacity-70"
                          key={`message-quick-action-icon-${message.id}${quickActionIndex}`}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      {showSuccessIcon[value] && SucessIcon && (
                        <AnimatedSucessIcon
                          className="text-primary h-4 w-4"
                          key={`message-quick-action-sucess-icon-${message.id}${quickActionIndex}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        />
                      )}
                    </AnimatePresence>
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
      </TooltipProvider>
    </ToggleGroup>
  );
}

export const MessageQuickActions = memo(MessageQuickActionsComp, () => true);
