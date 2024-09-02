import { ChatIdContainer } from "@/components/pages-containers/chat-id-container";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getChat } from "supabase/queries/get-chat";

type Props = {
  params: {
    documentId: string;
  };
};

const getCachedChats = unstable_cache(getChat, ["chat"], {
  revalidate: 60 * 60,
  tags: ["chat"],
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chatData = await getCachedChats(params.documentId);

  return {
    title: `Chat - ${(chatData?.documentMetadata as Record<string, unknown>)?.title}`,
  };
}

export default async function Page({ params }: Props) {
  const chatData = await getCachedChats(params.documentId);

  if (!chatData) redirect("/chat");

  return <ChatIdContainer chatData={chatData} />;
}
