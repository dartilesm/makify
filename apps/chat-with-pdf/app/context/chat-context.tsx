"use client";

import { Chat } from "@prisma/client";
import { Message, useChat } from "ai/react";
import { createContext, useEffect, useState } from "react";
import { getChatMessages } from "../actions/get-chat-messages";

const EMPTY_CHAT_DATA: Partial<Chat> = {
  id: "",
  documentMetadata: "",
  documentUrl: "",
  messages: [],
};

export const ChatContext = createContext({
  chatData: EMPTY_CHAT_DATA,
  isLoading: true,
});

export function ChatProvider({
  children,
  documentId,
}: {
  children: React.ReactNode;
  documentId: string;
}) {
  const [chatData, setChatData] = useState<Partial<Chat>>(EMPTY_CHAT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { setMessages } = useChat({
    id: documentId,
  });

  useEffect(() => {
    fetchChatData();
  }, []);

  async function fetchChatData() {
    const chatData = await getChatMessages(documentId);

    setChatData(chatData as Chat);
    setIsLoading(false);

    // restore messages from db
    setMessages(chatData?.messages as unknown as Message[]);
  }

  return (
    <ChatContext.Provider value={{ chatData, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}
