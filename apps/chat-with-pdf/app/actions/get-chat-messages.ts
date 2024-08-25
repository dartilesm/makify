"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

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
