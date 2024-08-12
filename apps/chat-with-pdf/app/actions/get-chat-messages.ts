"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

export async function getCachedChatMessages(documentId: string) {
  return cache(getChatMessages)(documentId);
}

async function getChatMessages(documentId: string) {
  const chatData = await prisma.chat.findUnique({
    where: {
      id: documentId,
    },
  });

  return chatData;
}
