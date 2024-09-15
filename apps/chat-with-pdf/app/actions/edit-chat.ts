"use server";

import { createClient } from "@/lib/supabase/server";
import { JsonObject } from "@prisma/client/runtime/library";
import { Tables } from "database.types";
import { revalidatePath, revalidateTag } from "next/cache";

export async function editChat(chat: Tables<"Chat">, title: string) {
  const supabase = createClient();

  await supabase
    .from("Chat")
    .update({
      documentMetadata: {
        ...(chat.documentMetadata as JsonObject),
        title,
      },
    })
    .eq("id", chat.id);
  await supabase.from("Document").update({ name: title }).eq("chatId", chat.id);

  revalidatePath(`/chat/${chat.id}`);
  revalidatePath("/chat");
  revalidateTag("chats");
}
