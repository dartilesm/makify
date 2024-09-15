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
  console.log({ redirectTo });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  console.log({ dataUrl: data?.url, error });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}
