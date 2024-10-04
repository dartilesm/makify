"use client";

import { MESSAGE_TYPE } from "@/components/chat/constants/message-type";
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
import { Tables } from "database.types";
import { createClient } from "@/lib/supabase/client";
import { generateDocumentTitle as generateDocumentTitleAction } from "../actions/generate-document-title";
import { generateSuggestedQuestions } from "../actions/generate-suggested-questions";
import { revalidatePath, revalidateTag } from "next/cache";

const EMPTY_CHAT_DATA: Partial<Tables<"Chat">> = {
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
  chatData: Partial<Tables<"Chat">>;
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
        "Introduce yourself and explain your purpose here. Mention that you're here to assist with the provided document. Avoid mentioning your name. Make your message friendly and professional.",
      type: MESSAGE_TYPE.INTRODUCTION,
    },
  ]);

  useEffect(() => {
    fetchChatData();
    generateDocumentTitle();
    if (!chatData.suggestedQuestions) fetchSuggestedQuestions();
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

  async function generateDocumentTitle() {
    const supabase = createClient();

    const chatId = chatData.id as string;

    // Check if the document title is already set
    const {
      data: { name: documentTitle },
      error,
    } = await supabase
      .from("Document")
      .select("name")
      .eq("chatId", chatId)
      .single();

    if (!documentTitle) {
      const { title: generatedTitle } =
        await generateDocumentTitleAction(chatId);
      console.log({ generatedTitle });

      await supabase
        .from("Document")
        .update({ name: generatedTitle })
        .eq("chatId", chatId);
    }
  }

  async function fetchSuggestedQuestions() {
    const supabase = createClient();

    const chatId = chatData.id as string;

    const { questions } = await generateSuggestedQuestions(chatId);

    const { error } = await supabase
      .from("Chat")
      .update({ suggestedQuestions: questions })
      .eq("id", chatId);

    if (error) {
      console.error(error);
    }

    revalidatePath(`/chat/${chatId}`);
    revalidateTag("chat");
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
        messages:
          useChatReturn.messages as unknown as Tables<"Chat">["messages"],
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
