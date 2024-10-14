"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { FileTextIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Container } from "../ui/container";
import { Heading } from "../ui/heading";
import { SadFaceIcon } from "icons/sad-face";
import { NewDocumentDialog } from "../header/document-title/new-document-dialog/new-document-dialog";
import { Tables } from "database.types";

type ChatsContainerProps =
  | {
      loading: true;
      chats?: never;
      documents?: never;
    }
  | {
      loading?: false;
      chats: Tables<"Chat">[];
      documents: Tables<"Document">[];
    };

export function ChatsContainer({
  chats,
  documents,
  loading = false,
}: ChatsContainerProps) {
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  function handleNewChatDialogToggle() {
    setIsNewChatDialogOpen(!isNewChatDialogOpen);
  }

  function getChatData(chatId: string) {
    return chats?.find((chat) => chat.id === chatId);
  }

  const fakeChatsList = Array.from({ length: 6 }).fill(null);

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <Container className="pb-4">
          <Heading
            loading={loading}
            title="Chats"
            description="All your conversations with your documents"
            actionButton={
              <TooltipProvider delayDuration={0}>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={documents?.length === 5}
                      className="flex gap-2"
                      onClick={handleNewChatDialogToggle}
                    >
                      <PlusCircleIcon className="h-4 w-4" />
                      Start a new chat
                    </Button>
                  </TooltipTrigger>
                  {documents?.length === 5 && (
                    <TooltipContent>
                      You have reached the maximum number of documents.
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            }
          />
        </Container>
        <Separator />
      </div>
      <Container className="flex-1">
        <Card className="col-span-4 flex h-full hover:shadow-none">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            {!loading &&
              documents?.map((document) => (
                <Card
                  className="flex flex-row items-center justify-between p-4"
                  key={document.chatId}
                >
                  <div className="flex flex-row items-center gap-4">
                    <FileTextIcon className="h-6 w-6" />
                    <div className="flex flex-col gap-2">
                      <CardHeader className="p-0">
                        <CardTitle>{document?.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground flex gap-2 p-0">
                        <span>
                          {
                            (
                              getChatData(document.chatId || "")
                                ?.documentMetadata as Record<string, any>
                            )?.numPages
                          }{" "}
                          page
                          {(
                            getChatData(document.chatId || "")
                              ?.documentMetadata as Record<string, any>
                          )?.numPages > 1
                            ? "s"
                            : ""}{" "}
                        </span>
                        <span>
                          {(
                            getChatData(document.chatId || "")
                              ?.documentMetadata as Record<string, any>
                          )?.size.mb > 1
                            ? `${(getChatData(document.chatId || "")?.documentMetadata as Record<string, any>)?.size.mb} MB`
                            : `${(getChatData(document.chatId || "")?.documentMetadata as Record<string, any>)?.size.kb} KB`}
                        </span>
                      </CardContent>
                    </div>
                  </div>
                  <Button className="flex-shrink-0" variant="secondary" asChild>
                    <Link href={`/chat/${document.chatId}`}>Open chat</Link>
                  </Button>
                </Card>
              ))}
            {loading &&
              fakeChatsList.map((_, index) => (
                <Skeleton className="h-20 w-full" key={index} />
              ))}
            {!loading && chats?.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <SadFaceIcon className="h-28 w-28 fill-gray-600 opacity-30" />
                <p className="text-muted-foreground max-w-xs text-center">
                  Oh no! No chats found. Start a new chat to get the party
                  started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
      <NewDocumentDialog
        isOpen={isNewChatDialogOpen}
        onOpenChange={handleNewChatDialogToggle}
      />
    </div>
  );
}
