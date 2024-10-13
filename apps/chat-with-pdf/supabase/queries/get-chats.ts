import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

async function retrieveChats(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("Chat").select("*");

  if (error) {
    throw error;
  }

  return data;
}

export async function getChats() {
  const supabase = createClient();
  const { data, error: errorOnFetchingSession } = await supabase.auth.getUser();

  if (errorOnFetchingSession) {
    throw errorOnFetchingSession;
  }

  const chats = unstable_cache(retrieveChats, [data.user.id || ""], {
    revalidate: 60 * 60,
    tags: ["chats", data.user.id || ""],
  })(supabase);

  return chats;
}
