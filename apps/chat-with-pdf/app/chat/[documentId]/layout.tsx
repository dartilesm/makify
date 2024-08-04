import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getCachedChats = cache(getChats);

async function getChats() {
  const chats = await prisma.chat.findMany();
  return chats;
}

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getCachedChats();
  return (
    <div className="flex h-dvh flex-col">
      <Header chats={chats} />
      {children}
    </div>
  );
}
