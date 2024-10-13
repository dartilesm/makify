import { createClient } from "@/lib/supabase/client";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Tables } from "database.types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type RecentConversation = Record<
  "id" | "name",
  Tables<"Chat">["id"] | Tables<"Document">["name"]
>;

export default function RecentConversations() {
  const [recentConversations, setRecentConversations] = useState<
    RecentConversation[]
  >([]);

  useEffect(() => {
    getRecentConversations();
  }, []);

  async function getRecentConversations() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("Chat")
      .select("id, updatedAt")
      .order("updatedAt", { ascending: false })
      .limit(3);

    if (error) {
      console.error(error);
      return [];
    }

    if (data) {
      const { data: documents, error } = await supabase
        .from("Document")
        .select("name, chatId")
        .in(
          "chatId",
          data.map((chat) => chat.id),
        );

      if (error) {
        console.error(error);
        return [];
      }

      const recentConversations = data.map((chat, index) => ({
        id: chat.id,
        name:
          documents.find((document) => document.chatId === chat.id)?.name ?? "",
      }));

      setRecentConversations(recentConversations);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-muted-foreground px-2 text-sm font-medium">
        Recent conversations
      </h2>
      <NavigationMenu
        className="max-w-none [&>div]:max-w-full"
        orientation="vertical"
      >
        <NavigationMenuList className="flex flex-col items-start gap-3 space-x-0">
          {recentConversations.map((conversation) => (
            <li className="w-full max-w-full flex-1">
              <NavigationMenuLink asChild>
                <Link
                  key={conversation.id}
                  className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 overflow-hidden truncate rounded-md px-2 py-3 text-sm leading-none no-underline outline-none transition-colors"
                  href={`/chat/${conversation.id}`}
                >
                  {conversation.name}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Link
        href="/chat"
        className="text-primary flex max-w-full items-center justify-start gap-2 p-2 text-sm"
      >
        <span>View all conversations</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ListItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a">) {
  return (
    <li className="w-full max-w-full flex-1">
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 overflow-hidden truncate rounded-md p-2 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          {children}
        </a>
      </NavigationMenuLink>
    </li>
  );
}
