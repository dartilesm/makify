"use client";

import { updateChatMessages } from "@/app/actions/update-chat-messages";
import { cn } from "@makify/ui/lib/utils";
import { Chat as ChatPrisma } from "@prisma/client";
import { CoreMessage, Message } from "ai";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";

type ChatProps = {
  className?: string;
  initialMessages: Message[];
};

export function Chat({ className, initialMessages }: ChatProps) {
  const params = useParams();
  const {
    messages,
    input: inputValue,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    reload,
  } = useChat({
    id: params.documentId as string,
    body: {
      documentId: params.documentId,
    },
    initialMessages,
  });

  useEffect(() => {
    if (!initialMessages?.length)
      handleSubmit(
        { preventDefault: () => null },
        {
          body: {
            documentId: params.documentId,
            messages: [
              {
                role: "system",
                content:
                  "Introduce yourself and mention you are here to help without mentioning your name. Summarize the document and provide me with some questions that are related and answerable from the document. Don't say the questions are 'answerable from the document'.",
              },
            ] as CoreMessage[],
            isInitialMessage: true,
          },
        },
      );
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
