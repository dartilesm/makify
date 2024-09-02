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

  const { error } = await supabase.auth.signUp(signUpData);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
