"use client";

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
import { Message } from "ai";
import { CopyIcon, ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AssistantMessage } from "./assistant-message";

type ChatMessagesProps = {
  messages: Message[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messageTooltipOpenIndex, setMessageTooltipOpenIndex] = useState<
    number | null
  >(null);

  useEffect(scrollToBottom, [messages]);

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

  return (
    <div className="relative overflow-hidden">
      <div className="h-full flex-1 overflow-auto p-4" ref={chatContainerRef}>
        <div className="grid gap-4">
          {messages.map((message, index) => {
            return (
              <TooltipProvider>
                <Tooltip
                  delayDuration={0}
                  onOpenChange={(isOpen) =>
                    updateMessageTooltipOpenIndex(index, isOpen)
                  }
                  open={index === messageTooltipOpenIndex}
                >
                  <TooltipTrigger className="text-left" asChild>
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "",
                      )}
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
                              <AssistantMessage>
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
                                    <TooltipTrigger>
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
      <Button
        className="absolute bottom-4 left-2/4 -translate-x-2/4"
        size="icon"
        onClick={scrollToBottom}
      >
        <ArrowDown className="h-4 w-4" />
        <span className="sr-only">Scroll to bottom</span>
      </Button>
    </div>
  );
}
