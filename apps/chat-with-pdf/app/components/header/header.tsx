import { Button } from "@makify/ui";
import { Tables } from "database.types";
import { MessageSquareIcon } from "lucide-react";
import { DocumentSwitcher } from "./document-switcher/document-switcher";
import { FeedbackDialog } from "./feedback-dialog";
import { ThemeSwitcher } from "./theme-switcher";
import { UserNav } from "./user-nav/user-nav";
import { AppTour } from "./app-tour";

type HeaderProps = {
  chats: Tables<"Chat">[];
};

export async function Header({ chats = [] }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-16 flex-row items-center justify-between gap-4 overflow-hidden px-4 max-sm:gap-4">
        <div className="col flex flex-shrink-0 flex-col gap-1 text-sm leading-none">
          Chat with PDF
          <span className="text-muted-foreground text-right text-[8px] leading-none">
            by Makify ✨
          </span>
        </div>

        <div className="flex h-full flex-1 justify-center overflow-hidden">
          {!!chats.length && <DocumentSwitcher chats={chats} />}
        </div>
        <div className="flex flex-row items-center gap-2 max-sm:hidden">
          <FeedbackDialog
            triggerEl={
              <Button variant="outline" className="flex flex-row gap-2">
                <MessageSquareIcon className="h-4 w-4" />
                Feedback
              </Button>
            }
          />
          <AppTour />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
