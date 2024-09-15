import { createClient } from "@/lib/supabase/server";

export async function getChat(id: string) {
  const supabase = createClient();

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
