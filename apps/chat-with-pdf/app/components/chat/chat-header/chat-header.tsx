"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { usePDF } from "@react-pdf/renderer";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ChatPDF } from "./chat-pdf";
import { useGlobalChat } from "hooks/use-global-chat";

export function ChatHeader() {
  const params = useParams();
  const {
    useChatReturn: { messages },
  } = useGlobalChat();

  const [instance, updateInstance] = usePDF({
    document: (
      <ChatPDF documentId={params.documentId as string} messages={messages} />
    ),
  });

  useEffect(() => {
    updateInstance(
      <ChatPDF documentId={params.documentId as string} messages={messages} />,
    );
  }, [messages]);

  return (
    <header className="flex items-center border-b-[1px] border-gray-100 p-2">
      <TooltipProvider delayDuration={0}>
        <div className="ml-auto flex items-center gap-2">
          {instance.url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex gap-2"
                  variant="ghost"
                  size="default"
                  asChild
                >
                  <Link
                    href={instance.url as string}
                    download={`chat conversation - ${params.documentId}.pdf`}
                    target="_blank"
                  >
                    <span>Download chat</span>
                    <DownloadIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Download the conversation as PDF.
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </header>
  );
}
