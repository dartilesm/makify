import { ChatIdContainer } from "@/components/pages-containers/chat-id-container";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getChat } from "supabase/queries/get-chat";

type Props = {
  params: {
    documentId: string;
  };
};

const getCachedChat = unstable_cache(getChat, ["chat"], {
  revalidate: 60 * 60,
  tags: ["chat"],
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  // Sending supabase as a parameter to getCachedChat to avoid
  // accessing to dynamic data in a cached function
  const chatData = await getCachedChat(supabase, params.documentId);

  return {
    title: `Chat - ${(chatData?.documentMetadata as Record<string, unknown>)?.title}`,
  };
}

export default async function Page({ params }: Props) {
  const supabase = createClient();
  // Sending supabase as a parameter to getCachedChat to avoid
  // accessing to dynamic data in a cached function
  const chatData = await getCachedChat(supabase, params.documentId);

  if (!chatData) redirect("/chat");

  return <ChatIdContainer chatData={chatData} />;
}
