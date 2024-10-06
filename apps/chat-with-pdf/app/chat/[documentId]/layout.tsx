import { Header } from "@/components/header/header";
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
      {children}
    </div>
  );
}
