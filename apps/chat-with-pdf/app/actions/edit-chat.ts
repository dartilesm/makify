"use server";

import { createClient } from "@/lib/supabase/server";
import { Tables } from "database.types";
import { revalidatePath, revalidateTag } from "next/cache";

export async function editChat(document: Tables<"Document">, title: string) {
  const supabase = createClient();

  await supabase.from("Document").update({ name: title }).eq("id", document.id);

  revalidatePath(`/chat/${document.id}`);
  revalidatePath("/chat");
  revalidateTag("documents");
}
