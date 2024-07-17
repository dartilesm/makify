import { cache } from "react";
import { DocumentSwitcher } from "./header/document-switcher";
import { UserNav } from "./header/user-nav";
import { prisma } from "@/lib/prisma";

const getCachedChats = cache(getChats);

async function getChats() {
  const chats = await prisma.chat.findMany();
  return chats;
}

export async function Header() {
  const chats = await getCachedChats();

  return (
    <header className="border-b">
      <div className="flex h-20 flex-row items-center justify-evenly px-4">
        <div className="text-sm">Chat with PDF</div>
        <div className="flex flex-1 justify-center">
          <DocumentSwitcher chats={chats} />
        </div>
        <div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
