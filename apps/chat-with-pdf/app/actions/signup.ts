"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SignUpProps = {
  email: string;
  password: string;
};

export async function signup(signUpData: SignUpProps) {
  const supabase = createClient();

  const baseUrl = process.env.VERCEL_URL || "https://localhost:3000";

  const emailRedirectTo = `${baseUrl}/api/auth/callback`;

  const { error } = await supabase.auth.signUp({
    ...signUpData,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}
