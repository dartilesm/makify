"use server";

import { type Chat, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface UpdateChatMessagesParams {
  documentId: string;
  messages?: Chat["messages"];
  documentMetadata?: Chat["documentMetadata"];
}

export async function updateChatMessages({
  documentId,
  messages,
  documentMetadata,
}: UpdateChatMessagesParams) {
  const chat = await prisma.chat.update({
    where: {
      id: documentId,
    },
    data: {
      messages: messages as unknown as Chat["messages"][],
      documentMetadata: documentMetadata as Prisma.JsonObject,
    },
  });
  return chat;
}
