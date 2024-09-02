import { Header } from "@/components/header/header";
import { unstable_cache } from "next/cache";
import { getChats } from "supabase/queries/get-chats";

const getCachedChats = unstable_cache(getChats, ["chats"], {
  revalidate: 60 * 60,
  tags: ["chats"],
});

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getCachedChats();
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col">
      <Header chats={chats} />
      {children}
    </div>
  );
}
