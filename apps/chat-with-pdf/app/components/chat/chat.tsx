"use client";

import { updateChatMessages } from "@/app/actions/update-chat-messages";
import { cn } from "@makify/ui/lib/utils";
import { Chat as ChatPrisma } from "@prisma/client";
import { CoreMessage, Message } from "ai";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import ChatMessagesStream from "./chat-messages-stream";
import { preload } from "react-dom";

type ChatProps = {
  className?: string;
  initialMessages: Message[];
};

export function Chat({ className, initialMessages }: ChatProps) {
  const preloadPrompts = useRef([
    {
      message:
        "Introduce yourself without mention your name and summarize the document.",
      type: "introduction",
    },
    {
      message:
        "Give me a list of a few questions that I can ask someone to see if they have read the document. Give me the questions as a list. Say those question are suggestions to start.",
      type: "questions",
    },
  ]);
  const params = useParams();
  const {
    append,
    messages,
    input: inputValue,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    id: params.documentId as string,
    body: {
      documentId: params.documentId,
    },
    initialMessages,
    onFinish: onChatFinishStream,
  });

  useEffect(() => {
    if (!initialMessages?.length) sendPreloadedPrompts();
    if (initialMessages?.length) preloadPrompts.current = [];
  }, []);

  useEffect(() => {
    const hasAddedMessages = initialMessages
      ? messages.length > initialMessages?.length
      : messages.length > 0;
    if (hasAddedMessages && !isLoading)
      updateChatMessages({
        documentId: params.documentId as string,
        messages: messages as unknown as ChatPrisma["messages"],
      });
  }, [messages, isLoading]);

  function sendPreloadedPrompts() {
    const preloadPromptsArr = preloadPrompts.current;
    const message = preloadPrompts.current.at(0)?.message as string;
    const type = preloadPrompts.current.at(0)?.type as string;

    if (preloadPrompts.current.length) {
      setTimeout(() => {
        append({
          role: "user",
          content: message,
          annotations: [{ type }],
        });
        preloadPrompts.current = preloadPromptsArr.slice(
          preloadPromptsArr.length - preloadPromptsArr.length + 1,
          preloadPromptsArr.length,
        );
      }, 1000);
    }
  }

  function onChatFinishStream() {
    sendPreloadedPrompts();
  }

  console.log({ messages });

  return (
    <div
      className={cn(
        "dark:bg-primary-foreground relative flex h-full flex-col bg-white",
        className,
      )}
    >
      <ChatHeader />
      <ChatMessages messages={messages as Message[]} />
      <ChatFooter
        inputValue={inputValue}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
