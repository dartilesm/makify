import { ChatScreen } from "@/components/chat/chat-screen";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function Page({
  params,
}: {
  params: { documentId: string };
}) {
  return <ChatScreen documentId={params.documentId} />;
}
