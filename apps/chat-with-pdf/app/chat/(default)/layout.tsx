import { Header } from "@/components/header";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header chats={[]} />
      <div className="flex-1 space-y-4 p-4">{children}</div>
    </div>
  );
}
