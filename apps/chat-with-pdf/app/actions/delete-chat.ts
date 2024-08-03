"use server";

import { getPineconeClient } from "@/lib/pinecone.client";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { Chat } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function deleteChat(chat: Chat) {
  return prisma.chat.delete({
    where: {
      id: chat.id,
    },
  });
}

async function deleteDocumentFile(chat: Chat) {
  if (chat.documentUrl?.includes(process.env.SUPABASE_URL as string)) {
    return supabase.storage.from("documents").remove([`${chat.id}.pdf`]);
  }
  return null;
}

async function deleteNamespace(chat: Chat) {
  const pinecone = await getPineconeClient(chat.id);

  return pinecone.deleteAll();
}

export async function deleteChatAndDependencies(chat: Chat) {
  await Promise.allSettled([
    deleteChat(chat),
    deleteDocumentFile(chat),
    deleteNamespace(chat),
  ]);

  const firstChat = await prisma.chat.findFirst();

  revalidatePath("/chat");

  if (firstChat?.id) return redirect(`/chat/${firstChat.id}`);
  redirect("/chat");
}
