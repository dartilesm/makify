import { Avatar, AvatarFallback, AvatarImage } from "@makify/ui";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function ChatList() {
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
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt="Recipient Avatar"
                  src="/placeholder-avatar.jpg"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">Jane Doe</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Offline
                </p>
              </div>
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt="Recipient Avatar"
                  src="/placeholder-avatar.jpg"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">Bob Smith</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Offline
                </p>
              </div>
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt="Recipient Avatar"
                  src="/placeholder-avatar.jpg"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">Alice Johnson</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Online
                </p>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
