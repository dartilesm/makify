"use server";

import { createClient } from "@/lib/supabase/server";
import { Tables } from "database.types";

type UpdateChatMessagesParams = {
  documentId: string;
  messages?: Tables<"Chat">["messages"];
  documentMetadata?: Tables<"Chat">["documentMetadata"];
};

export async function updateChatMessages({
  documentId,
  messages,
  documentMetadata,
}: UpdateChatMessagesParams) {
  const supabase = createClient();

  await supabase
    .from("Chat")
    .update({
      messages,
      documentMetadata,
    })
    .eq("id", documentId);
}
