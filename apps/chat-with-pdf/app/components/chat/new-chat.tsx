"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@makify/ui";
import { Heading } from "../ui/heading";
import { NewDocumentDialog } from "../header/new-document-dialog/new-document-dialog";
import { useState } from "react";
import { Container } from "../ui/container";
import { Chat } from "@prisma/client";
import Link from "next/link";
import { FileTextIcon, MessageCirclePlus, PlusCircleIcon } from "lucide-react";

type NewChatProps = {
  chats: Chat[];
};

export function NewChat({ chats }: NewChatProps) {
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  function handleNewChatDialogToggle() {
    setIsNewChatDialogOpen(!isNewChatDialogOpen);
  }
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <Container className="pb-4">
          <Heading
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
        <Card className="col-span-4 h-full hover:shadow-none">
          <CardContent className="flex flex-col gap-4 p-4">
            {chats.map((chat) => (
              <Card className="flex flex-row items-center justify-between p-4">
                <div className="flex flex-row items-center gap-4">
                  <FileTextIcon className="h-6 w-6" />
                  <div className="flex flex-col gap-2">
                    <CardHeader className="p-0">
                      <CardTitle>{chat.documentMetadata?.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex gap-2 p-0">
                      <span>
                        {chat?.documentMetadata?.numPages} page
                        {chat?.documentMetadata?.numPages > 1 ? "s" : ""}{" "}
                      </span>
                      <span>
                        {chat?.documentMetadata?.size.mb > 1
                          ? `${chat?.documentMetadata?.size.mb} MB`
                          : `${chat?.documentMetadata?.size.kb} KB`}
                      </span>
                    </CardContent>
                  </div>
                </div>
                <Button className="flex-shrink-0" variant="outline" asChild>
                  <Link href={`/chat/${chat.id}`}>Open chat</Link>
                </Button>
              </Card>
            ))}
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
