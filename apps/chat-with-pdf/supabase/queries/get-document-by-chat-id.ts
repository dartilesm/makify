import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

async function retrieveDocumentByChatId(
  supabase: SupabaseClient,
  chatId: string,
) {
  const { data: document, error: errorOnFetchingDocument } = await supabase
    .from("Document")
    .select("*")
    .eq("chatId", chatId)
    .single();

  if (errorOnFetchingDocument) {
    throw errorOnFetchingDocument;
  }

  return document;
}

export async function getDocumentByChatId(chatId: string) {
  const supabase = createClient();
  const { data, error: errorOnFetchingSession } = await supabase.auth.getUser();

  if (errorOnFetchingSession) {
    throw errorOnFetchingSession;
  }

  const document = unstable_cache(
    (supabase: SupabaseClient) => retrieveDocumentByChatId(supabase, chatId),
    [data.user.id || "", chatId],
    {
      revalidate: 60 * 60,
      tags: ["document", data.user.id || "", chatId],
    },
  )(supabase);

  return document;
}
