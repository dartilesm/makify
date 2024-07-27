"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Message, useChat } from "ai/react";
import { animate, inView, motion } from "framer-motion";
import {
  ArrowDown,
  BookmarkIcon,
  CopyIcon,
  FlagIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AssistantMessage } from "./assistant-message";
import { QUICK_ACTIONS } from "./constants/message-quick-actions";
import { MESSAGE_TYPE } from "./constants/message-type";
import { MessageQuickActions } from "./message-quick-actions";

const AnimatedButton = motion(Button);

const quickActions = [
  {
    Icon: CopyIcon,
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
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const arrowButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messageTooltipOpenIndex, setMessageTooltipOpenIndex] = useState<
    number | null
  >(null);
  const params = useParams();

  const { messages } = useChat({
    id: params.documentId as string,
    body: {
      documentId: params.documentId,
    },
    keepLastMessageOnError: true,
  });

  useEffect(onMessageChanges, [messages.length]);

  function toggleScrollBottomOnScroll() {
    if (!arrowButtonRef.current) return;
    /* animation config when scroll bottom appears */
    animate(arrowButtonRef.current as unknown as HTMLDivElement, {
      opacity: 0,
      y: 100,
      animationDuration: 0.3,
    });

    /* animation config when scroll bottom disappears */
    return () => {
      if (!arrowButtonRef.current) return;

      animate(arrowButtonRef.current as unknown as HTMLDivElement, {
        opacity: 1,
        y: 0,
        animationDuration: 0.3,
      });
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

  function asignRefToLastMessage(el: HTMLDivElement | null, index: number) {
    const isLastMessage = index === messages.length - 1;
    if (el && isLastMessage) {
      lastMessageRef.current = el;
    }
  }

  function getMessageType(message: Message) {
    return (message.data as Record<string, string>)
      ?.messageType as MESSAGE_TYPE;
  }

  function isAHiddenMessage(message: Message) {
    const isUserMessage = message.role === "user";
    const isAnIntroductionMessage =
      getMessageType(message) === MESSAGE_TYPE.INTRODUCTION;
    const isASuggestionMessage =
      getMessageType(message) === MESSAGE_TYPE.SUGGESTION_MESSAGES;

    return isUserMessage && (isAnIntroductionMessage || isASuggestionMessage);
  }

  return (
    <div className="relative flex-1 overflow-hidden" id="chat-messages">
      <div
        className="flex h-full overflow-auto p-4"
        ref={chatContainerRef}
        data-chat-messages-container
      >
        <div className="flex h-fit flex-col gap-4">
          {messages.map((message, index) => {
            if (isAHiddenMessage(message)) return null;
            return (
              <TooltipProvider key={message.id}>
                <Tooltip
                  delayDuration={0}
                  onOpenChange={(isOpen) =>
                    updateMessageTooltipOpenIndex(index, isOpen)
                  }
                  open={index === messageTooltipOpenIndex}
                >
                  <TooltipTrigger asChild>
                    <div
                      className={cn("flex w-full text-left", {
                        "justify-end": message.role === "user",
                        "mt-auto": index === 0, // TODO: Fix this to start from the bottom
                      })}
                      data-message-bubble
                      ref={(el) => {
                        asignRefToLastMessage(el, index);
                      }}
                    >
                      <div className="relative max-w-[70%] space-y-1.5">
                        <div
                          className={cn({
                            "rounded-md bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800":
                              message.role === "assistant",
                            "bg-primary rounded-md px-4 py-3 text-sm text-white":
                              message.role === "user",
                          })}
                        >
                          {message.role === "user" && <p>{message.content}</p>}
                          {message.role === "assistant" && (
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
                                    quickActions={quickActions}
                                    index={index}
                                    onTooltipOpenChange={
                                      updateMessageTooltipOpenIndex
                                    }
                                    message={message}
                                  />
                                </TooltipContent>
                              )}
                            </>
                          )}
                        </div>
                        {index === messages.length - 1 &&
                          message.role === "assistant" && (
                            <MessageQuickActions
                              className="ml-4"
                              quickActions={quickActions}
                              index={index}
                              message={message}
                              onTooltipOpenChange={
                                updateMessageTooltipOpenIndex
                              }
                            />
                          )}
                      </div>
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <AnimatedButton
              className="absolute bottom-4 right-8 -translate-x-2/4 opacity-0"
              ref={arrowButtonRef}
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
    </div>
  );
}
