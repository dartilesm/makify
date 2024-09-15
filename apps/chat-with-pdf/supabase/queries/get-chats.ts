import { createClient } from "@/lib/supabase/server";

export async function getChats() {
  const supabase = createClient();

  const { data, error } = await supabase.from("Chat").select("*");

  if (error) {
    throw error;
  }

  return data;
}
