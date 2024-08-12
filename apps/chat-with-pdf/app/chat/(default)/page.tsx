import { cache } from "react";
import { ChatsContainer } from "@/components/pages-containers/chats-container";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const getCachedChats = cache(getChats);

async function getChats() {
  const chats = await prisma.chat.findMany();
  return chats;
}

export default async function Page() {
  const chats = await getCachedChats();

  return <ChatsContainer chats={chats} />;
}
