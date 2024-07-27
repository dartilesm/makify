"use server";

import { prisma } from "@/lib/prisma";
import { Chat } from "@prisma/client";

export async function editChat(chat: Chat, title: string) {
  return await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {
      documentMetadata: {
        ...chat.documentMetadata,
        title,
      },
    },
  });
}
