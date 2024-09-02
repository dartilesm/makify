"use server";

import { supabase } from "@/lib/supabase";
import { Chat, Prisma } from "@prisma/client";

type UpdateChatMessagesParams = {
  documentId: string;
  messages?: Chat["messages"];
  documentMetadata?: Chat["documentMetadata"];
};

export async function updateChatMessages({
  documentId,
  messages,
  documentMetadata,
}: UpdateChatMessagesParams) {
  await supabase
    .from("Chat")
    .update({
      messages,
      documentMetadata,
    })
    .eq("id", documentId);
}
