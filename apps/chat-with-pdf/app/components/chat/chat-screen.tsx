import { Chat } from "@/components/chat/chat";
import { ChatList } from "@/components/chat/chat-list";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import { PrismaClient } from "@prisma/client";
import { Message } from "ai";

const prisma = new PrismaClient();

async function getDocumentUrl(chatId: string) {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });
  return chat?.documentUrl;
}

async function getMessages(chatId: string) {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    select: {
      messages: true,
    },
  });
  return chat?.messages;
}

export async function ChatScreen({ documentId }: { documentId: string }) {
  const documentUrl = await getDocumentUrl(documentId as string);
  const messages = await getMessages(documentId as string);

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
