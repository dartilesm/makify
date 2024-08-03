import { getChatMessages } from "@/app/actions/get-chat-messages";
import { ChatIdContainer } from "@/components/pages-containers/chat-id-container";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { documentId: string };
}) {
  console.log("I am executed on the server side");
  const chatData = await getChatMessages(params.documentId);

  if (!chatData) redirect("/chat");

  return <ChatIdContainer chatData={chatData} />;
}
