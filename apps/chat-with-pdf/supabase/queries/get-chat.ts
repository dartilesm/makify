import { supabase } from "@/lib/supabase";

export async function getChat(id: string) {
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
