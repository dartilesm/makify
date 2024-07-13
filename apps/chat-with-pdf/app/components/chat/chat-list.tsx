import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cache } from "react";

const getCachedChats = cache(getChats);

async function getChats() {
  const chats = await prisma.chat.findMany();
  return chats;
}

type ChatListProps = {
  documentId: string;
};

export async function ChatList({ documentId }: ChatListProps) {
  const chats = await getCachedChats();

  return (
    <div className="hidden h-full border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex flex-col gap-2">
        <div className="flex h-[60px] items-center px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <ChatBubbleIcon className="h-6 w-6" />
            <span className="">Chats</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {chats.map(({ id: chatId }) => (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-lg  px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  {
                    "bg-gray-100": documentId === chatId,
                  },
                )}
                href={`/chat/${chatId}`}
                key={chatId}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Online
                  </p>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
