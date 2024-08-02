import { ChatsContainer } from "@/components/pages-containers/chats-container";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getCachedChats = cache(getChats);

async function getChats() {
  const chats = await prisma.chat.findMany();
  return chats;
}

export default async function Page() {
  console.log("This are the variables defined", {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  });
  const chats = await getCachedChats();

  return <ChatsContainer chats={chats} />;
}
