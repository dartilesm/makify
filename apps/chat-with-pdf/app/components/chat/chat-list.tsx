import { Avatar, AvatarFallback, AvatarImage } from "@makify/ui";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

async function getChatIds() {
  const pc = new Pinecone({ apiKey: process.env.PINECODE_API_KEY! });
  const index = pc.index(process.env.PINECODE_INDEX_NAME!);

  const stats = await index.describeIndexStats();

  // Namespaces are the chat IDs
  const namespaces = stats?.namespaces ? Object.keys(stats.namespaces) : [];

  return namespaces;
}

export async function ChatList() {
  const chatIds = await getChatIds();

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex flex-col gap-2">
        <div className="flex h-[60px] items-center px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <ChatBubbleIcon className="h-6 w-6" />
            <span className="">Chats</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {chatIds.map((chatId) => (
              <Link
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                href="#"
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
