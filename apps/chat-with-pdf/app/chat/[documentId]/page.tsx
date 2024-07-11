import { ChatScreen } from "@/components/chat/chat-screen";

export default function Page({ params }: { params: { documentId: string } }) {
  return <ChatScreen />;
}
