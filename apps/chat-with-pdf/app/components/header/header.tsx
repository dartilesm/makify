import { Tables } from "database.types";
import { Logo } from "../ui/logo";
import { DocumentSwitcher } from "./document-switcher/document-switcher";

type HeaderProps = {
  chats: Tables<"Document">[];
};

export async function Header({ chats = [] }: HeaderProps) {
  return (
    <header className="relative border-b">
      <div className="flex h-16 flex-row items-center justify-between gap-4 overflow-hidden px-4 max-sm:gap-4">
        <Logo className="z-30" />

        <div className="flex h-full flex-1 justify-center overflow-hidden">
          {!!chats.length && <DocumentSwitcher documents={chats} />}
        </div>
        <div className="flex flex-row items-center gap-2 max-sm:hidden"></div>
      </div>
    </header>
  );
}
