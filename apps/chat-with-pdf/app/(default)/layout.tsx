import { Header } from "@/components/header/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { createClient } from "@/lib/supabase/server";
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
    <div className="flex h-screen w-screen max-w-[100vw] flex-row">
      <AppSidebar userInfo={user as User} />
      <div className="flex h-screen max-w-[inherit] flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-row overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
