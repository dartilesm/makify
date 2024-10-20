"use client";

import {
  Button,
  Card,
  CardContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { BookmarkIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatPDF } from "./chat-pdf";
import { useGlobalChat } from "hooks/use-global-chat";
import dynamic from "next/dynamic";
import { Message } from "ai";
import { useState } from "react";
import { SadFaceIcon } from "icons/sad-face";

// Dynamically import BlobProvider from react-pdf/renderer to avoid SSR issues
const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
  {
    ssr: false,
  },
);

export function ChatHeader() {
  const params = useParams();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const {
    globalContext: { setExtraData },
    useChatReturn: { messages },
  } = useGlobalChat();

  const bookmarkedMessages = messages.filter(
    (message) => (message.data as Record<string, any>)?.bookmarked === true,
  );

  function handleOnBookmarkedMessageClick(message: Message) {
    // Scroll to the message
    const messageElement = document.getElementById(`message-${message.id}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsPopoverOpen(false);
      setExtraData({
        messageScrollId: message.id,
      });
    }
  }

  return (
    <header className="border-border bg-background z-[2] flex items-center p-2">
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
                    Download chat as PDF
                  </TooltipContent>
                </Tooltip>
              ) : null;
            }}
          </BlobProvider>

          <Tooltip>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className="flex gap-2" variant="ghost" size="icon">
                    <BookmarkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent side="bottom">Bookmarked messages</TooltipContent>
              <PopoverContent asChild align="end" className="p-0">
                <div className="relative flex max-h-96 flex-col gap-2 overflow-auto rounded-md border px-4 pb-4">
                  {bookmarkedMessages.length > 0 && (
                    <div className="sticky top-0 z-10 bg-inherit pt-4">
                      <p className="text-sm">
                        Bookmarked messages ({bookmarkedMessages.length})
                      </p>
                      <span className="text-muted-foreground text-sm">
                        Click on a message to scroll to it
                      </span>
                    </div>
                  )}
                  {bookmarkedMessages.map((message) => {
                    return (
                      <Card
                        key={message.id}
                        className="max-h-20 max-w-full cursor-pointer p-2 text-xs"
                        onClick={() => handleOnBookmarkedMessageClick(message)}
                      >
                        <CardContent className="line-clamp-3 p-0">
                          {message.content}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {bookmarkedMessages.length === 0 && (
                    <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
                      <SadFaceIcon className="fill-muted-foreground h-8 w-8" />
                      <span className="text-muted-foreground w-3/4 text-center text-xs">
                        No bookmarked messages yet. Click on the bookmark icon
                        to bookmark a message.
                      </span>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  );
}
