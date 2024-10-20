import { ChatsContainer } from "@/components/pages-containers/chats-container";
import { getChats } from "supabase/queries/get-chats";
import { getDocuments } from "supabase/queries/get-documents";

export const dynamic = "force-dynamic";

export default async function Page() {
  const chats = await getChats();
  const documents = await getDocuments();

  return <ChatsContainer chats={chats} documents={documents} />;
}
