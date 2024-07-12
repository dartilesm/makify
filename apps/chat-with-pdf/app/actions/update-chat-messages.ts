"use server";

import { Chat, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateChatMessagesParams = {
    documentId: string;
    messages: Chat['messages'];
};

export async function updateChatMessages({ documentId, messages }: UpdateChatMessagesParams) {
    const chat = await prisma.chat.update({
      where: {
        id: documentId as string,
      },
      data: {
        messages: messages as unknown as Chat["messages"][],
      },
    });
    return chat;
  }