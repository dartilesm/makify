import { ChatProvider } from "@/app/context/chat-context";
import { ChatScreen } from "../chat/chat-screen";
import { Tables } from "database.types";

type ChatIdContainerProps =
  | {
      loading: true;
      chatData?: never;
    }
  | {
      loading?: false;
      chatData: Tables<"Chat">;
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
