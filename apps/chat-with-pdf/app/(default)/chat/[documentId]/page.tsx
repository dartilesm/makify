import { ChatIdContainer } from "@/components/pages-containers/chat-id-container";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getChat } from "supabase/queries/get-chat";
import { getDocumentByChatId } from "@/app/actions/get-document-by-chat-id";

type Props = {
  params: {
    documentId: string;
  };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const document = await getDocumentByChatId(params.documentId);

  return {
    title: `Chat - ${document?.name || "Untitled"}`,
  };
}

export default async function Page({ params }: Props) {
  const chatData = await getChat(params.documentId);

  if (!chatData) redirect("/chat");

  return <ChatIdContainer chatData={chatData} />;
}
