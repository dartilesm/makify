"use server";

import { getOAuthRedirectUrl } from "@/lib/oauth-redirect-url";
import { createClient } from "@/lib/supabase/server";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams, redirect } from "next/navigation";

export async function signInWithOAuth(
  provider: SignInWithOAuthCredentials["provider"],
  searchParams: ReadonlyURLSearchParams,
) {
  const supabase = createClient();
  const redirectTo = getOAuthRedirectUrl(searchParams);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}
