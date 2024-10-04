import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

async function retrieveChat(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("Chat")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getChat(id: string) {
  const supabase = createClient();
  const { data, error: errorOnFetchingSession } = await supabase.auth.getUser();

  if (errorOnFetchingSession) {
    throw errorOnFetchingSession;
  }

  const chat = unstable_cache(
    (supabase: SupabaseClient) => retrieveChat(supabase, id),
    [data.user.id || "", id],
    {
      revalidate: 60 * 60,
      tags: ["chat", data.user.id || "", id],
    },
  )(supabase);

  return chat;
}
