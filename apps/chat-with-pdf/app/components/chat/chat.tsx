"use client";

import { cn } from "@makify/ui/lib/utils";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header/chat-header";
import { ChatMessages } from "./chat-messages";

type ChatProps = {
  className?: string;
};

export function Chat({ className }: ChatProps) {
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
