"use server";

import { type Chat, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function editChat(chat: Chat, title: string) {
  const newChat = await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {
      documentMetadata: {
        ...(chat.documentMetadata as Prisma.JsonObject),
        title,
      },
    },
  });

  revalidatePath(`/chat/${chat.id}`);
  revalidatePath("/chat");

  return newChat;
}
