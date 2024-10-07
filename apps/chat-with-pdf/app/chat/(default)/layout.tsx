import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { UserInfo } from "@/components/sidebar/user-info";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header chats={[]} />
      <div className="flex flex-1 flex-row overflow-hidden">
        <Sidebar
          className="absolute bottom-0 left-0 z-20"
          userInfo={<UserInfo />}
          userAvatar={<UserAvatar />}
        />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
