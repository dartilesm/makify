"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@makify/ui";
import { Chat } from "@prisma/client";
import { FileTextIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NewDocumentDialog } from "../header/new-document-dialog/new-document-dialog";
import { Container } from "../ui/container";
import { Heading } from "../ui/heading";
import { SadFaceIcon } from "icons/sad-face";

type ChatsContainerProps =
  | {
      loading: true;
      chats?: never;
    }
  | {
      loading?: false;
      chats: Chat[];
    };

export function ChatsContainer({
  chats,
  loading = false,
}: ChatsContainerProps) {
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  function handleNewChatDialogToggle() {
    setIsNewChatDialogOpen(!isNewChatDialogOpen);
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
              <Button
                className="flex gap-2"
                onClick={handleNewChatDialogToggle}
              >
                <PlusCircleIcon className="h-4 w-4" />
                Start a new chat
              </Button>
            }
          />
        </Container>
        <Separator />
      </div>
      <Container className="flex-1">
        <Card className="col-span-4 flex h-full hover:shadow-none">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            {!loading &&
              chats?.map((chat) => (
                <Card className="flex flex-row items-center justify-between p-4">
                  <div className="flex flex-row items-center gap-4">
                    <FileTextIcon className="h-6 w-6" />
                    <div className="flex flex-col gap-2">
                      <CardHeader className="p-0">
                        <CardTitle>
                          {
                            (chat?.documentMetadata as Record<string, any>)
                              ?.title
                          }
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground flex gap-2 p-0">
                        <span>
                          {
                            (chat?.documentMetadata as Record<string, any>)
                              ?.numPages
                          }{" "}
                          page
                          {(chat?.documentMetadata as Record<string, any>)
                            ?.numPages > 1
                            ? "s"
                            : ""}{" "}
                        </span>
                        <span>
                          {(chat?.documentMetadata as Record<string, any>)?.size
                            .mb > 1
                            ? `${(chat?.documentMetadata as Record<string, any>)?.size.mb} MB`
                            : `${(chat?.documentMetadata as Record<string, any>)?.size.kb} KB`}
                        </span>
                      </CardContent>
                    </div>
                  </div>
                  <Button className="flex-shrink-0" variant="outline" asChild>
                    <Link href={`/chat/${chat.id}`}>
                      Open the chat and let the adventure begin
                    </Link>
                  </Button>
                </Card>
              ))}
            {loading &&
              fakeChatsList.map((_, index) => (
                <Skeleton className="h-20 w-full" />
              ))}
            {!loading && chats?.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <SadFaceIcon className="h-28 w-28 fill-gray-600 opacity-30" />
                <p className="text-muted-foreground max-w-72 text-center">
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
