"use server";

import { getPineconeClient } from "@/lib/pinecone.client";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function removeChatAndDependencies(documentId: string) {
  await prisma.chat.delete({
    where: {
      id: documentId,
    },
  });

  await supabase.storage.from("documents").remove([`${documentId}.pdf`]);

  const pinecone = await getPineconeClient(documentId);

  await pinecone.deleteAll();

  const chat = await prisma.chat.findFirst();

  if (chat?.id) return redirect(`/chat/${chat.id}`);
  redirect("/chat");
}
