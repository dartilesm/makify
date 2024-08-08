"use server";

import { prisma } from "@/lib/prisma";
import { Chat, Prisma } from "@prisma/client";

type UpdateChatMessagesParams = {
  documentId: string;
  messages?: Chat["messages"];
  documentMetadata?: Chat["documentMetadata"];
};

export async function updateChatMessages({
  documentId,
  messages,
  documentMetadata,
}: UpdateChatMessagesParams) {
  const chat = await prisma.chat.update({
    where: {
      id: documentId as string,
    },
    data: {
      messages: messages as unknown as Chat["messages"][],
      documentMetadata: documentMetadata as Prisma.JsonObject,
    },
  });
  return chat;
}
