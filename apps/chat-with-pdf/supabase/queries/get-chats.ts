import { supabase } from "@/lib/supabase";

export async function getChats() {
  const { data, error } = await supabase.from("Chat").select("*");

  if (error) {
    throw error;
  }

  return data;
}
