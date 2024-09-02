"use server";

import { supabase } from "@/lib/supabase";
import { Chat, Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function editChat(chat: Chat, title: string) {
  await supabase
    .from("Chat")
    .update({
      documentMetadata: {
        ...(chat.documentMetadata as Prisma.JsonObject),
        title,
      },
    })
    .eq("id", chat.id);
  await supabase.from("Document").update({ name: title }).eq("chatId", chat.id);

  revalidatePath(`/chat/${chat.id}`);
  revalidatePath("/chat");
  revalidateTag("chats");
}
