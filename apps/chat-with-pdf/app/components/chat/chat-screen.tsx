import { Chat } from "@/components/chat/chat";
import { ChatList } from "@/components/chat/chat-list";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import { prisma } from "@/lib/prisma";
import { Chat as ChatPrisma } from "@prisma/client";
import { Message } from "ai";
import { cache } from "react";

const getCachedChatData = cache(getChatData) as (
  chatId: string,
) => Promise<ChatPrisma>;

async function getChatData(chatId: string) {
  console.log("Getting chatData");
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    select: {
      messages: true,
      documentUrl: true,
    },
  });
  return chat;
}

export async function ChatScreen({ documentId }: { documentId: string }) {
  const { documentUrl, messages } = await getCachedChatData(
    documentId as string,
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="max-w-96">
        <ChatList documentId={documentId} />
      </div>
      <div className="flex w-full flex-1 flex-row justify-between">
        <PdfViewer className="flex-1" documentUrl={documentUrl} />
        <Chat
          className="flex-1"
          initialMessages={messages as unknown as Message[]}
        />
      </div>
    </div>
  );
}
