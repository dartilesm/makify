import { type Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getCachedChatMessages } from "@/app/actions/get-chat-messages";
import { ChatIdContainer } from "@/components/pages-containers/chat-id-container";

interface Props {
  params: {
    documentId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chatData = await getCachedChatMessages(params.documentId);

  return {
    title: `Chat - ${(chatData?.documentMetadata as Record<string, unknown>).title}`,
  };
}

export default async function Page({ params }: Props) {
  const chatData = await getCachedChatMessages(params.documentId);

  if (!chatData) redirect("/chat");

  return <ChatIdContainer chatData={chatData} />;
}
