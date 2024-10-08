"use client";

import { MESSAGE_TYPE } from "@/components/chat/constants/message-type";
import { Chat } from "@prisma/client";
import { Message, useChat, UseChatOptions } from "ai/react";
import { useParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { updateChatMessages } from "../actions/update-chat-messages";

const EMPTY_CHAT_DATA: Partial<Chat> = {
  id: "",
  documentMetadata: "",
  documentUrl: "",
  messages: [],
};

export const ChatContext = createContext({
  globalContext: {
    chatData: EMPTY_CHAT_DATA,
    isLoading: false,
    extraData: {} as Record<string, unknown>,
    setExtraData: (() => null) as Dispatch<
      SetStateAction<Record<string, unknown>>
    >,
  },
  initOptions: {} as UseChatOptions,
  useChatReturn: {} as ReturnType<typeof useChat>,
});

type ChatProviderProps = {
  children: React.ReactNode;
  chatData: Partial<Chat>;
};

export function ChatProvider({ children, chatData }: ChatProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [extraData, setExtraData] = useState<Record<string, unknown>>({});
  const params = useParams();
  const initOptions = {
    id: chatData.id,
    body: {
      documentId: params.documentId as string,
    },
  };
  const { ...useChatReturn } = useChat({
    ...initOptions,
    onFinish: sendPreloadedPrompts,
  });

  const preloadPrompts = useRef([
    {
      message:
        "Introduce yourself without mention your name and summarize the document.",
      type: MESSAGE_TYPE.INTRODUCTION,
    },
    {
      message:
        "Give me a list of a few questions that are already answered by the document content. Give me the questions as a list. Say those questions are suggestions to start and don't mention the questions are already answered by the document content.",
      type: MESSAGE_TYPE.SUGGESTION_MESSAGES,
    },
  ]);

  useEffect(() => {
    fetchChatData();
  }, []);

  useEffect(sendPreloadedPrompts, [isLoading]);

  useEffect(storeChatMessages, [
    useChatReturn.messages,
    useChatReturn.isLoading,
  ]);

  const initialMessages = chatData.messages as unknown as Message[];

  async function fetchChatData() {
    setIsLoading(false);

    // restore messages from db
    useChatReturn.setMessages(chatData?.messages as unknown as Message[]);
  }

  function sendPreloadedPrompts() {
    const preloadPromptsArr = preloadPrompts.current;

    // If there are no prompts to send, return
    if (!preloadPromptsArr.length) return;

    if (isLoading) return;

    // If the chat context is not loading and there are initial messages, return
    if (!isLoading && initialMessages?.length) {
      preloadPrompts.current = [];
      return;
    }

    const firstMessage = preloadPrompts.current.at(0);

    const message = firstMessage?.message as string;
    const messageType = firstMessage?.type as string;

    setTimeout(() => {
      useChatReturn.append({
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
      ? useChatReturn.messages.length > initialMessages?.length
      : useChatReturn.messages.length > 0;
    if (hasAddedMessages && !useChatReturn.isLoading)
      updateChatMessages({
        documentId: params.documentId as string,
        messages: useChatReturn.messages as unknown as Chat["messages"],
      });
  }

  return (
    <ChatContext.Provider
      value={{
        globalContext: {
          chatData,
          isLoading,
          extraData,
          setExtraData,
        },
        useChatReturn,
        initOptions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
