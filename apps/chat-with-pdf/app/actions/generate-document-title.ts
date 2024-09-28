"use server";

import { getContext } from "@/lib/context";
import { createClient } from "@/lib/supabase/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function generateDocumentTitle(documentId: string) {
  const documentSummary = await getContext(
    "Give me a summary of the document.",
    documentId,
  );

  const { object } = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z.string(),
    }),
    prompt: `You are an AI assistant that generates a title for a given text in a max of 40 characters: ${documentSummary}`,
  });

  if (object.title) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    revalidateTag(data.session?.user.id || "documents");
  }

  return object;
}
