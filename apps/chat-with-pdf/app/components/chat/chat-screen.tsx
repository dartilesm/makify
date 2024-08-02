import { Chat } from "@/components/chat/chat";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@makify/ui";
import { ChatLoading } from "./loading/chat-loading";
import { PDFLoading } from "./loading/pdf-loading";

type ChatScreenProps = {
  loading?: boolean;
};

export async function ChatScreen({ loading }: ChatScreenProps) {
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <ResizablePanelGroup
        className="flex w-full flex-1 flex-row justify-between"
        direction="horizontal"
      >
        <ResizablePanel minSize={35} defaultSize={50}>
          {!loading && <Chat className="flex-1" />}
          {loading && <ChatLoading />}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={35} defaultSize={50}>
          {!loading && <PdfViewer className="flex-1" />}
          {loading && <PDFLoading />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
