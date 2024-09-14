"use server";

import { createClient } from "@/lib/supabase/server";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function signInWithOAuth(
  provider: SignInWithOAuthCredentials["provider"],
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: process.env.SUPABASE_AUTH_REDIRECT_URL,
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}
