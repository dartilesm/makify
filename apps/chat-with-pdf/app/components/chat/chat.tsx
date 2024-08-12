"use client";

import { cn } from "@makify/ui/lib/utils";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header/chat-header";
import { ChatMessages } from "./chat-messages";

interface ChatProps {
  className?: string;
}

export function Chat({ className }: ChatProps) {
  return (
    <div className={cn("relative flex h-full flex-col", className)}>
      <ChatHeader />
      <ChatMessages />
      <ChatFooter />
    </div>
  );
}
