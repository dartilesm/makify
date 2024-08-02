import { ChatProvider } from "@/app/context/chat-context";
import { ChatScreen } from "../chat/chat-screen";
import { Chat } from "@prisma/client";

type ChatIdContainerProps =
  | {
      loading: true;
      chatData?: never;
    }
  | {
      loading?: false;
      chatData: Chat;
    };

export function ChatIdContainer({ chatData, loading }: ChatIdContainerProps) {
  return !loading ? (
    <ChatProvider chatData={chatData}>
      <ChatScreen />
    </ChatProvider>
  ) : (
    <ChatScreen loading />
  );
}
