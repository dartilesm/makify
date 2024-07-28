"use client";

import { updateChatMessages } from "@/app/actions/update-chat-messages";
import { ChatContext } from "@/app/context/chat-context";
import { cn } from "@makify/ui/lib/utils";
import { Chat as ChatPrisma } from "@prisma/client";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header/chat-header";
import { ChatMessages } from "./chat-messages";
import { MESSAGE_TYPE } from "./constants/message-type";

type ChatProps = {
  className?: string;
};

export function Chat({ className }: ChatProps) {
  const preloadPrompts = useRef([
    {
      message:
        "Introduce yourself without mention your name and summarize the document.",
      type: MESSAGE_TYPE.INTRODUCTION,
    },
    {
      message:
        "Give me a list of a few questions that I can ask someone to see if they have read the document. Give me the questions as a list. Say those question are suggestions to start and don't mention the questions are to see if they have read the document.",
      type: MESSAGE_TYPE.SUGGESTION_MESSAGES,
    },
  ]);
  const params = useParams();
  const { chatData, isLoading: isChatContextLoading } = useContext(ChatContext);

  // Store the initial messages from the chat context
  const initialMessages = chatData.messages as unknown as Message[];

  /* const { useChatReturn: {append, messages, isLoading} } = useContext(ChatContext); */
  const { append, messages, isLoading } = useChat({
    id: params.documentId as string,
    body: {
      documentId: params.documentId,
    },
    onFinish: onChatFinishStream,
  });

  useEffect(sendPreloadedPrompts, [isChatContextLoading]);

  useEffect(storeChatMessages, [messages, isLoading]);

  function sendPreloadedPrompts() {
    const preloadPromptsArr = preloadPrompts.current;

    // If there are no prompts to send, return
    if (!preloadPromptsArr.length) return;

    if (isChatContextLoading) return;

    // If the chat context is not loading and there are initial messages, return
    if (!isChatContextLoading && initialMessages?.length) {
      preloadPrompts.current = [];
      return;
    }

    const firstMessage = preloadPrompts.current.at(0);

    const message = firstMessage?.message as string;
    const messageType = firstMessage?.type as string;

    setTimeout(() => {
      append({
        role: "user",
        content: message,
        data: {
          messageType,
        },
      });
      // Remove the sent prompt from the array
      preloadPrompts.current = preloadPromptsArr.slice(
        preloadPromptsArr.length - preloadPromptsArr.length + 1,
        preloadPromptsArr.length,
      );
    }, 200);
  }

  function storeChatMessages() {
    // Check if new messages have been added to the chat to not update the chat messages with the same messages
    const hasAddedMessages = initialMessages
      ? messages.length > initialMessages?.length
      : messages.length > 0;
    if (hasAddedMessages && !isLoading)
      updateChatMessages({
        documentId: params.documentId as string,
        messages: messages as unknown as ChatPrisma["messages"],
      });
  }

  function onChatFinishStream() {
    sendPreloadedPrompts();
  }

  return (
    <div
      className={cn(
        "dark:bg-primary-foreground relative flex h-full flex-col bg-white",
        className,
      )}
    >
      <ChatHeader />
      <ChatMessages />
      <ChatFooter />
    </div>
  );
}
