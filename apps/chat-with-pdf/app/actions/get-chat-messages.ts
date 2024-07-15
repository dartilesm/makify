"use server";

import { prisma } from "@/lib/prisma";

export async function getChatMessages(documentId: string) {
  const chatData = await prisma.chat.findUnique({
    where: {
      id: documentId,
    },
    select: {
      messages: true,
      id: true,
      documentMetadata: true,
      documentUrl: true,
    },
  });

  return chatData;
}
