"use server";

import { createClient } from "@/lib/supabase/server";

export const verifyOtp = async (data: {
  email: string;
  otp: string;
  type: string;
}) => {
  const supabase = createClient();

  const res = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.otp,
    type: "email",
  });
  return JSON.stringify(res);
};
