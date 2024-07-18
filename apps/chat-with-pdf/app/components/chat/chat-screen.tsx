import { ChatProvider } from "@/app/context/chat-context";
import { Chat } from "@/components/chat/chat";
import { PdfViewer } from "@/components/pdf/pdf-viewer";

export async function ChatScreen({ documentId }: { documentId: string }) {
  return (
    <ChatProvider documentId={documentId}>
      <div className="flex w-full flex-1 overflow-hidden">
        <div className="flex w-full flex-1 flex-row justify-between">
          <Chat className="flex-1" />
          <PdfViewer className="flex-1" />
        </div>
      </div>
    </ChatProvider>
  );
}
