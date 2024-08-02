"use server";

import { prisma } from "@/lib/prisma";

export async function getChatMessages(documentId: string) {
  const chatData = await prisma.chat.findUnique({
    where: {
      id: documentId,
    },
  });

  return chatData;
}
