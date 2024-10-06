"use server";

import { createClient } from "@/lib/supabase/server";
import { Tables } from "database.types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteChat(
  chatId: Tables<"Chat">["id"],
  shouldRedirect = true,
) {
  const supabase = createClient();

  await supabase.from("Chat").delete().eq("id", chatId).select("id");

  revalidateTag("documents");
  revalidatePath("/chat");

  if (!shouldRedirect) return;

  const { data: firstDocument } = await supabase
    .from("Document")
    .select("chatId")
    .single();

  if (firstDocument?.chatId) return redirect(`/chat/${firstDocument.chatId}`);
  redirect("/chat");
}
