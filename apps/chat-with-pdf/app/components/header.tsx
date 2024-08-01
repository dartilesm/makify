import { Chat } from "@prisma/client";
import { DocumentSwitcher } from "./header/document-switcher/document-switcher";
import { UserNav } from "./header/user-nav";

type HeaderProps = {
  chats: Chat[];
};

export async function Header({ chats = [] }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-20 flex-row items-center justify-evenly px-4">
        <div className="text-sm">Chat with PDF</div>
        <div className="flex flex-1 justify-center">
          {!!chats.length && <DocumentSwitcher chats={chats} />}
        </div>
        <div></div>
      </div>
    </header>
  );
}
