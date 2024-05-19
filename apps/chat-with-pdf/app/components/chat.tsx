"use client";

import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useChat } from "ai/react";
import { AssistantMessage } from "./chat/assistant-message";

export function Chat({ className }: { className?: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

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
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "",
                )}
              >
                <div className="max-w-[70%] space-y-1.5">
                  <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                    {message.role === "user" ? (
                      <p>{message.content}</p>
                    ) : (
                      <AssistantMessage>{message.content}</AssistantMessage>
                    )}
                  </div>
                  {/* <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      {message.time}
                    </div> */}
                </div>
              </div>
            );
          })}
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
