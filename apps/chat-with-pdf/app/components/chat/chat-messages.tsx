"use client";

import { ChatContext } from "@/app/context/chat-context";
import {
  Button,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { useChat } from "ai/react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDown, CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { AssistantMessage } from "./assistant-message";

const AnimatedButton = motion(Button);

export function ChatMessages() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [messageTooltipOpenIndex, setMessageTooltipOpenIndex] = useState<
    number | null
  >(null);
  const params = useParams();

  const { messages } = useChat({
    id: params.documentId as string,
  });

  const isLastMessageInView = useInView(lastMessageRef, {
    root: chatContainerRef.current as unknown as RefObject<HTMLDivElement>,
  });

  const isScrollHeightGreaterThanContainerHeight =
    (chatContainerRef.current &&
      chatContainerRef.current?.scrollHeight >
        chatContainerRef.current?.clientHeight) ||
    false;

  const messagesWithAnnotations = messages.filter(
    (message) => message.annotations,
  );

  useEffect(scrollToBottom, [messages.length]);

  // Controls the tooltip open state for each message, as it collides with the inner tooltip
  function updateMessageTooltipOpenIndex(index: number, isOpen?: boolean) {
    if (isOpen === undefined) return setMessageTooltipOpenIndex(index);
    setMessageTooltipOpenIndex(isOpen ? index : null);
  }

  function copyMessage(message: string) {
    navigator.clipboard.writeText(message);
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

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="flex h-full overflow-auto p-4" ref={chatContainerRef}>
        <div className="flex h-fit flex-col gap-4">
          {messages
            .filter((message) => !message.annotations)
            .map((message, index) => {
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
                        ref={(el) => {
                          asignRefToLastMessage(el, index);
                        }}
                      >
                        <div className="max-w-[70%] space-y-1.5">
                          <div
                            className={cn({
                              "rounded-3xl bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800":
                                message.role === "assistant",
                              "bg-primary rounded-3xl px-4 py-3 text-sm text-white":
                                message.role === "user",
                            })}
                          >
                            {message.role === "user" ? (
                              <p>{message.content}</p>
                            ) : (
                              <>
                                <AssistantMessage
                                  type={
                                    messagesWithAnnotations?.[
                                      index
                                    ]?.annotations?.at(0)?.type as string
                                  }
                                >
                                  {message.content}
                                </AssistantMessage>

                                <TooltipContent
                                  align="start"
                                  side="bottom"
                                  className="rounded-3xl border-[1px] border-gray-200 bg-gray-50 p-1"
                                  sideOffset={-10}
                                  alignOffset={10}
                                  avoidCollisions={false}
                                >
                                  <ToggleGroup
                                    type="single"
                                    size="xs"
                                    className="z-10"
                                  >
                                    <Tooltip
                                      delayDuration={0}
                                      onOpenChange={() =>
                                        updateMessageTooltipOpenIndex(index)
                                      }
                                    >
                                      <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                          value="a"
                                          className="flex aspect-square h-[30px] w-[30px] items-center justify-center rounded-3xl hover:bg-gray-200"
                                          onClick={() =>
                                            copyMessage(message.content)
                                          }
                                        >
                                          <CopyIcon className="text-primary h-4 w-4 text-opacity-70" />
                                          <span className="sr-only">Copy</span>
                                        </ToggleGroupItem>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        align="center"
                                        side="top"
                                        className="bg-primary rounded-3xl text-xs"
                                        arrowPadding={2}
                                        sideOffset={6}
                                      >
                                        Copy
                                      </TooltipContent>
                                    </Tooltip>
                                  </ToggleGroup>
                                </TooltipContent>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
        </div>
      </div>
      <AnimatePresence>
        {isScrollHeightGreaterThanContainerHeight && !isLastMessageInView && (
          <AnimatedButton
            className="absolute bottom-4 left-2/4 -translate-x-2/4"
            size="icon"
            onClick={scrollToBottom}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ y: { type: "just" } }}
            exit={{ opacity: 0, y: 100 }}
          >
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Scroll to bottom</span>
          </AnimatedButton>
        )}
      </AnimatePresence>
    </div>
  );
}
