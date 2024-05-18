import { Chat } from "@/components/chat";
import { ChatList } from "@/components/chat-list";
import { PdfViewer } from "@/components/pdf/pdf-viewer";

export function ChatScreen() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="max-w-96">
        <ChatList />
      </div>
      <div className="flex w-full flex-1 flex-row justify-between">
        <PdfViewer className="flex-1" />
        <Chat className="flex-1" />
      </div>
    </div>
  );
}
