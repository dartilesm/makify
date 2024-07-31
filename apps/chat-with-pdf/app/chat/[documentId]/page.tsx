import { getChatMessages } from "@/app/actions/get-chat-messages";
import { ChatProvider } from "@/app/context/chat-context";
import { ChatScreen } from "@/components/chat/chat-screen";
import { Chat } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { documentId: string };
}) {
  const chatData = (await getChatMessages(params.documentId)) as Partial<Chat>;

  if (!chatData) redirect("/chat");

  return (
    <ChatProvider chatData={chatData}>
      <ChatScreen documentId={params.documentId} />
    </ChatProvider>
  );
}
