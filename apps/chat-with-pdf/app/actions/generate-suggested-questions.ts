"use server";

import { getContext } from "@/lib/context";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function generateSuggestedQuestions(documentId: string) {
  const documentSummary = await getContext(
    "Give me a summary of the document.",
    documentId,
  );

  const { object } = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      questions: z.array(z.string()).min(3).max(5),
    }),
    prompt: `You are an AI assistant that generates a list of 3-5 suggested questions based on the following document summary. The questions should be diverse and cover different aspects of the document: ${documentSummary}`,
  });

  revalidatePath(`/chat/${documentId}`, "page");

  return object;
}
