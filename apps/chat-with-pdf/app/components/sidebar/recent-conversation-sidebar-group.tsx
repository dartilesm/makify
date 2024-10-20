import { createClient } from "@/lib/supabase/client";
import {
  Button,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@makify/ui";
import { Tables } from "database.types";
import { ChevronRight, MessageSquareIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type RecentConversation = Record<
  "id" | "name",
  Tables<"Chat">["id"] | Tables<"Document">["name"]
>;

export default function RecentConversationsSidebarGroup() {
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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent conversations</SidebarGroupLabel>
      <SidebarMenu>
        {recentConversations.map((conversation) => (
          <SidebarMenuItem key={conversation.id}>
            <SidebarMenuButton asChild>
              <Link
                key={conversation.id}
                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 overflow-hidden truncate rounded-md px-2 py-3 text-sm leading-none no-underline outline-none transition-colors"
                href={`/chat/${conversation.id}`}
              >
                <MessageSquareIcon className="h-4 w-4" />
                {conversation.name}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70" asChild>
            <Button variant="link" asChild className="justify-start">
              <Link href="/chat">
                <ChevronRight className="text-sidebar-foreground/70" />
                <span>See all</span>
              </Link>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
