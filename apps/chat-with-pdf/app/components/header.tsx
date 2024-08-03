import { Chat } from "@prisma/client";
import { DocumentSwitcher } from "./header/document-switcher/document-switcher";

type HeaderProps = {
  chats: Chat[];
};

export async function Header({ chats = [] }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-20 flex-row items-center justify-evenly px-4">
        <div className="col flex flex-col gap-1 text-sm">
          Chat with PDF
          <span className="text-muted-foreground text-right text-xs">
            by Makify ✨
          </span>
        </div>
        <div className="flex flex-1 justify-center">
          {!!chats.length && <DocumentSwitcher chats={chats} />}
        </div>
        <div></div>
      </div>
    </header>
  );
}
