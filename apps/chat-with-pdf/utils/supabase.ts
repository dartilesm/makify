import { createClient, SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as { supabase: SupabaseClient };

export const supabase =
  globalForSupabase.supabase ||
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);

if (process.env.NODE_ENV !== "production")
  globalForSupabase.supabase = supabase;
