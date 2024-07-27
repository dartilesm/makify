import { ChatScreen } from "@/components/chat/chat-screen";

export default async function Page({
  params,
}: {
  params: { documentId: string };
}) {
  return <ChatScreen documentId={params.documentId} />;
}
