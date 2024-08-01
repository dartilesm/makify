"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatPDF } from "./chat-pdf";
import { useGlobalChat } from "hooks/use-global-chat";
import dynamic from "next/dynamic";

// Dynamically import BlobProvider from react-pdf/renderer to avoid SSR issues
const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
  {
    ssr: false,
  },
);

export function ChatHeader() {
  const params = useParams();
  const {
    useChatReturn: { messages },
  } = useGlobalChat();

  return (
    <header className="flex items-center border-b-[1px] border-gray-100 p-2">
      <TooltipProvider delayDuration={0}>
        <div className="ml-auto flex h-9 items-center gap-2">
          <BlobProvider
            document={
              <ChatPDF
                documentId={params.documentId as string}
                messages={messages}
              />
            }
          >
            {({ url }) => {
              // Do whatever you need with blob here
              return url ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="flex gap-2"
                      variant="ghost"
                      size="default"
                      asChild
                    >
                      <Link
                        href={url as string}
                        download={`chat conversation - ${params.documentId}.pdf`}
                        target="_blank"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        <span>Download chat</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Download the conversation as PDF.
                  </TooltipContent>
                </Tooltip>
              ) : null;
            }}
          </BlobProvider>
        </div>
      </TooltipProvider>
    </header>
  );
}
