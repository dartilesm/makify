import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
