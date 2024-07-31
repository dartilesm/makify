"use client";

import {
  Button,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { animate, AnimatePresence, inView, motion } from "framer-motion";
import { useGlobalChat } from "hooks/use-global-chat";
import {
  ArrowDown,
  BookmarkIcon,
  CheckIcon,
  CopyIcon,
  FlagIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QUICK_ACTIONS } from "./constants/message-quick-actions";
import { MessageBubble } from "./message-bubble";
import { MessageActions } from "./types/message-actions";
import { cn } from "@makify/ui/lib/utils";

const AnimatedButton = motion(Button);

const quickActions: MessageActions[] = [
  {
    Icon: CopyIcon,
    SucessIcon: CheckIcon,
    label: "Copy message",
    value: QUICK_ACTIONS.COPY,
    onlyLastMessage: false,
  },
  {
    Icon: RefreshCcwIcon,
    label: "Regenerate response",
    value: QUICK_ACTIONS.REGENERATE,
    onlyLastMessage: true,
  },
  {
    Icon: BookmarkIcon,
    label: "Bookmark response (not implemented)",
    value: QUICK_ACTIONS.BOOKMARK,
    onlyLastMessage: false,
  },
  {
    Icon: FlagIcon,
    label: "Report an issue (not implemented)",
    value: QUICK_ACTIONS.REPORT,
    onlyLastMessage: false,
  },
];

export function ChatMessages() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [messageTooltipOpenIndex, setMessageTooltipOpenIndex] = useState<
    number | null
  >(null);

  const {
    useChatReturn: { messages, isLoading },
  } = useGlobalChat();

  const fakeMessagesLoading = Array.from({ length: 6 }, () => null);

  useEffect(onMessageChanges, [messages.length]);

  function toggleScrollBottomOnScroll() {
    setShowScrollBottom(false);
    return () => {
      setShowScrollBottom(true);
    };
  }

  // Controls the tooltip open state for each message, as it collides with the inner tooltip
  function updateMessageTooltipOpenIndex(index: number, isOpen?: boolean) {
    if (isOpen === undefined) return setMessageTooltipOpenIndex(index);
    setMessageTooltipOpenIndex(isOpen ? index : null);
  }

  function onMessageChanges() {
    scrollToBottom();
    inView("[data-message-bubble]:last-child", toggleScrollBottomOnScroll, {
      root: chatContainerRef.current as unknown as HTMLDivElement,
      amount: 0.5,
    });
  }

  function scrollToBottom() {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative flex-1 overflow-hidden" id="chat-messages">
      <div
        className={cn("flex h-full overflow-auto p-4", {
          "overflow-hidden": messages?.length === 0,
        })}
        ref={chatContainerRef}
        data-chat-messages-container
      >
        {messages?.length === 0 && (
          <div className="flex w-full flex-col gap-4">
            {fakeMessagesLoading.map((_, index) => (
              <div
                key={index}
                className={cn("flex w-full", {
                  "justify-end": index % 2 === 0,
                })}
              >
                {index % 2 !== 0 && (
                  <Skeleton
                    className={cn("w-[70%]", {
                      "h-20": index === 1,
                      "h-48": index === 3,
                      "h-96": index === 5,
                    })}
                  />
                )}
                {index % 2 === 0 && (
                  <Skeleton
                    className={cn("w-[70%]", {
                      "h-20": index === 0 || index === 2,
                      "h-10": index === 4,
                    })}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex h-fit max-w-full flex-col gap-4">
          {messages.map((message, index) => {
            return (
              <MessageBubble
                key={message.id}
                message={message}
                index={index}
                onTooltipOpenChange={() => updateMessageTooltipOpenIndex(index)}
                tooltipOpen={index === messageTooltipOpenIndex}
                quickActions={quickActions}
              />
            );
          })}
          {isLoading && messages?.at(-1)?.role !== "assistant" && (
            <MessageBubble isTyping />
          )}
        </div>
      </div>
      <AnimatePresence>
        {showScrollBottom && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <AnimatedButton
                  className="absolute bottom-4 right-8 -translate-x-2/4 opacity-0"
                  key={`arrow-button`}
                  initial={{
                    opacity: 0,
                    y: 100,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 100,
                  }}
                  size="icon"
                  variant="outline"
                  onClick={scrollToBottom}
                >
                  <ArrowDown className="h-4 w-4" />
                  <span className="sr-only">Scroll to bottom</span>
                </AnimatedButton>
              </TooltipTrigger>
              <TooltipContent>Scroll to bottom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </AnimatePresence>
    </div>
  );
}
