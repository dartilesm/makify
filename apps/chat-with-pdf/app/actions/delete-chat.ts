"use server";

import { createClient } from "@/lib/supabase/server";
import { Tables } from "database.types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteChat(chat: Tables<"Chat">, shouldRedirect = true) {
  const supabase = createClient();

  await supabase.from("Chat").delete().eq("id", chat.id).select("id");

  revalidateTag("chats");
  revalidatePath("/chat");

  if (!shouldRedirect) return;

  const { data: firstChat } = await supabase.from("Chat").select("id").single();

  if (firstChat?.id) return redirect(`/chat/${firstChat.id}`);
  redirect("/chat");
}
