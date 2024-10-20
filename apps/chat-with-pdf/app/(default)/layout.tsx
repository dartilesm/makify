import { Header } from "@/components/header/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { User } from "@supabase/supabase-js";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <SidebarProvider
      defaultOpen={false}
      className="flex h-screen w-screen max-w-[100vw] flex-row"
    >
      <AppSidebar userInfo={user as User} />
      <div
        className={cn([
          "flex h-screen flex-1 shrink-0 flex-col",
          // Calculate the remaining width for the main content
          // as the css is not able to calculate it
          "max-w-[calc(100%-(var(--sidebar-width-icon)))]",
        ])}
      >
        <Header />
        <main className="flex flex-1 flex-row overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
