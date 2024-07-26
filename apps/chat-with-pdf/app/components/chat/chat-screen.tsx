import { ChatProvider } from "@/app/context/chat-context";
import { Chat } from "@/components/chat/chat";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@makify/ui";

export async function ChatScreen({ documentId }: { documentId: string }) {
  return (
    <ChatProvider documentId={documentId}>
      <div className="flex w-full flex-1 overflow-hidden">
        <ResizablePanelGroup
          className="flex w-full flex-1 flex-row justify-between"
          direction="horizontal"
        >
          <ResizablePanel minSize={35} defaultSize={50}>
            <Chat className="flex-1" />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={35} defaultSize={50}>
            <PdfViewer className="flex-1" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ChatProvider>
  );
}
