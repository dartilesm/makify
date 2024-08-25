import { ChatContext } from "@/app/context/chat-context";
import { useContext } from "react";

export function useGlobalChat() {
  const { globalContext, useChatReturn, initOptions } = useContext(ChatContext);

  if (!useChatReturn) {
    throw new Error("useGlobalChat must be used within a ChatProvider");
  }

  return {
    globalContext,
    useChatReturn,
    initOptions,
  };
}
