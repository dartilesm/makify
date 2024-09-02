import { ChatsContainer } from "@/components/pages-containers/chats-container";
import { unstable_cache } from "next/cache";
import { getChats } from "supabase/queries/get-chats";

export const dynamic = "force-dynamic";

const getCachedChats = unstable_cache(getChats, ["chats"], {
  revalidate: 60 * 60,
  tags: ["chats"],
});

export default async function Page() {
  const chats = await getCachedChats();

  return <ChatsContainer chats={chats} />;
}
