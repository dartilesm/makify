import { Chat } from "@/components/chat/chat";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { ChatLoading } from "./loading/chat-loading";
import { PDFLoading } from "./loading/pdf-loading";

type ChatScreenProps = {
  loading?: boolean;
};

export function ChatScreen({ loading }: ChatScreenProps) {
  return (
    <div
      className={cn("flex w-full flex-1 flex-col overflow-hidden", [
        /* Mobile styles: Hide document view on chat-view-toggle is active */
        "max-sm:[&:has(#chat-view-toggle[data-state=active])>div>#document-view]:hidden",
        /* Mobile styles: Hide chat view on document-view-toggle is active */
        "max-sm:[&:has(#chat-view-toggle[data-state=inactive])>div>#chat-view]:hidden",
      ])}
    >
      <div className="border-border flex items-center justify-center space-x-2 border-b-[1px] py-2 sm:hidden">
        <Tabs defaultChecked defaultValue="chat">
          <TabsList>
            <TabsTrigger value="chat" id="chat-view-toggle">
              Chat view
            </TabsTrigger>
            <TabsTrigger value="document" id="document-view-toggle">
              Document view
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ResizablePanelGroup
        className="flex w-full flex-1 flex-row justify-between"
        direction="horizontal"
      >
        <ResizablePanel minSize={35} defaultSize={100} id="chat-view">
          {!loading && <Chat className="flex-1" />}
          {loading && <ChatLoading />}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={35} defaultSize={100} id="document-view">
          {!loading && <PdfViewer className="flex-1" />}
          {loading && <PDFLoading />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
