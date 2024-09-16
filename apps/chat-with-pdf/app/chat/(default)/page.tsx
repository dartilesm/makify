import { ChatsContainer } from "@/components/pages-containers/chats-container";
import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { getChats } from "supabase/queries/get-chats";

export const dynamic = "force-dynamic";

const getCachedChats = unstable_cache(getChats, ["chats"], {
  revalidate: 60 * 60,
  tags: ["chats"],
});

export default async function Page() {
  const supabase = createClient();
  // Sending supabase as a parameter to getCachedChats to avoid
  // accessing to dynamic data in a cached function
  const chats = await getCachedChats(supabase);

  return <ChatsContainer chats={chats} />;
}
