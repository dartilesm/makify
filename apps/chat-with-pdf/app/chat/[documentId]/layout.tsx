import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { UserInfo } from "@/components/sidebar/user-info";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getDocuments } from "supabase/queries/get-documents";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const documents = await getDocuments();

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col">
      <Header chats={documents} />
      <div className="flex flex-1 flex-row overflow-hidden">
        <Sidebar userInfo={<UserInfo />} userAvatar={<UserAvatar />} />
        {children}
      </div>
    </div>
  );
}
