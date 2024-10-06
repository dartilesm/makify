import { generateSuggestedQuestions } from "@/app/actions/generate-suggested-questions";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

async function retrieveChat(supabase: SupabaseClient, id: string) {
  const { data: chatData, error: chatError } = await supabase
    .from("Chat")
    .select("*")
    .eq("id", id)
    .single();

  if (chatError) {
    throw chatError;
  }

  if (chatData.suggestedQuestions) {
    return chatData;
  }

  const suggestedQuestions = await generateAndUpdateSuggestedQuestions(
    supabase,
    id,
  );
  return { ...chatData, suggestedQuestions };
}

async function generateAndUpdateSuggestedQuestions(
  supabase: SupabaseClient,
  id: string,
) {
  const result = await generateSuggestedQuestions(id);

  if (!result?.questions) {
    return null;
  }

  const { data, error: updateError } = await supabase
    .from("Chat")
    .update({ suggestedQuestions: result.questions })
    .eq("id", id)
    .select();

  if (updateError) {
    throw updateError;
  }

  return result.questions;
}

export async function getChat(id: string) {
  const supabase = createClient();
  const { data, error: errorOnFetchingSession } = await supabase.auth.getUser();

  if (errorOnFetchingSession) {
    throw errorOnFetchingSession;
  }

  const chat = unstable_cache(
    (supabase: SupabaseClient) => retrieveChat(supabase, id),
    [data.user.id || "", id],
    {
      revalidate: 60 * 60,
      tags: ["chat", data.user.id || "", id],
    },
  )(supabase);

  return chat;
}
