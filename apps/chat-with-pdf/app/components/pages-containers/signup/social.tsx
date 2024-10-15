"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@makify/ui";

export function Social({ redirectTo }: { redirectTo: string }) {
  const loginWithProvider = async (provider: "github" | "google") => {
    const supbase = createClient();
    await supbase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          window.location.origin + `/auth/callback?next=` + redirectTo,
      },
    });
  };

  return (
    <div className="flex w-full gap-2">
      <Button
        className="flex h-8 w-full items-center gap-5"
        variant="outline"
        onClick={() => loginWithProvider("github")}
      >
        <IoLogoGithub />
        Github
      </Button>
      <Button
        className="flex h-8 w-full items-center gap-2"
        variant="outline"
        onClick={() => loginWithProvider("google")}
      >
        <FcGoogle />
        Google
      </Button>
    </div>
  );
}
