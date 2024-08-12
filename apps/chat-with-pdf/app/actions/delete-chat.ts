"use server";

import { type Chat } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPineconeClient } from "@/lib/pinecone.client";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

async function deleteChat(chat: Chat) {
  return prisma.chat.delete({
    where: {
      id: chat.id,
    },
  });
}

async function deleteDocumentFile(chat: Chat) {
  if (chat.documentUrl?.includes(process.env.SUPABASE_URL!)) {
    return supabase.storage.from("documents").remove([`${chat.id}.pdf`]);
  }
  return null;
}

async function deleteNamespace(chat: Chat) {
  const pinecone = await getPineconeClient(chat.id);

  return pinecone.deleteAll();
}

export async function deleteChatAndDependencies(
  chat: Chat,
  shouldRedirect = true,
) {
  await Promise.allSettled([
    deleteChat(chat),
    deleteDocumentFile(chat),
    deleteNamespace(chat),
  ]);

  revalidatePath("/chat");

  if (!shouldRedirect) return;

  const firstChat = await prisma.chat.findFirst();

  if (firstChat?.id) return redirect(`/chat/${firstChat.id}`);
  redirect("/chat");
}
