import { SupabaseClient } from "@supabase/supabase-js";

export async function getChat(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("Chat")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
