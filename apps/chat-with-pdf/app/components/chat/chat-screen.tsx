import { ChatProvider } from "@/app/context/chat-context";
import { Chat } from "@/components/chat/chat";
import { ChatList } from "@/components/chat/chat-list";
import { PdfViewer } from "@/components/pdf/pdf-viewer";

export async function ChatScreen({ documentId }: { documentId: string }) {
  return (
    <ChatProvider documentId={documentId}>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="flex w-full flex-1 flex-row justify-between">
          <PdfViewer className="flex-1" />
          <Chat className="flex-1" />
        </div>
      </div>
    </ChatProvider>
  );
}
