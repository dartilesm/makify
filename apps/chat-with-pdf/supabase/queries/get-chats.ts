import { SupabaseClient } from "@supabase/supabase-js";

export async function getChats(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("Chat").select("*");

  if (error) {
    throw error;
  }

  return data;
}
