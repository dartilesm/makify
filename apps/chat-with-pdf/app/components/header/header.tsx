import { Button } from "@makify/ui";
import { Chat } from "@prisma/client";
import { MessageSquareIcon } from "lucide-react";
import { DocumentSwitcher } from "./document-switcher/document-switcher";
import { FeedbackDialog } from "./feedback-dialog";
import { ThemeSwitcher } from "./theme-switcher";

type HeaderProps = {
  chats: Chat[];
};

export async function Header({ chats = [] }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-20 flex-row items-center justify-between overflow-hidden px-4 max-sm:gap-4">
        <div className="col flex flex-shrink-0 flex-col gap-1 text-sm">
          Chat with PDF
          <span className="text-muted-foreground text-right text-xs">
            by Makify ✨
          </span>
        </div>
        <div className="flex flex-1 justify-center overflow-hidden">
          {!!chats.length && <DocumentSwitcher chats={chats} />}
        </div>
        <div className="flex flex-row gap-2 max-sm:hidden">
          <FeedbackDialog
            triggerEl={
              <Button variant="outline" className="flex flex-row gap-2">
                <MessageSquareIcon className="h-4 w-4" />
                Feedback
              </Button>
            }
          />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
