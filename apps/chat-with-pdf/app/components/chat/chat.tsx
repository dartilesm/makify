"use client";

import { updateChatMessages } from "@/app/actions/update-chat-messages";
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Chat as ChatPrisma } from "@prisma/client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ChatMessages } from "./chat-messages";

type ChatProps = {
  className?: string;
  initialMessages: Message[];
};

export function Chat({ className, initialMessages }: ChatProps) {
  const params = useParams();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      id: params.documentId as string,
      body: {
        documentId: params.documentId,
      },
      initialMessages,
    });

  useEffect(() => {
    console.log(initialMessages, messages, isLoading);
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
    <div className={cn("flex h-full flex-col", className)}>
      <header className="flex h-[60px] items-center justify-between border-b px-6 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage alt="Recipient Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">John Doe</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
        <Button className="rounded-full" size="icon" variant="ghost">
          <DotsVerticalIcon className="h-5 w-5" />
        </Button>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          <ChatMessages messages={messages as Message[]} />
        </div>
      </div>
      <div className="border-t bg-gray-100 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <Input
            className="flex-1"
            placeholder="Type your message..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button>Submit</Button>
        </form>
      </div>
    </div>
  );
}
