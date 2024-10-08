import { Button, TooltipProvider } from "@makify/ui";
import { Chat } from "@prisma/client";
import { MessageSquareIcon } from "lucide-react";
import { DocumentSwitcher } from "./document-switcher/document-switcher";
import { FeedbackDialog } from "./feedback-dialog";
import { ThemeSwitcher } from "./theme-switcher";
import { AppTour } from "./app-tour";

type HeaderProps = {
  chats: Chat[];
};

export async function Header({ chats = [] }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-16 flex-row items-center justify-between gap-4 overflow-hidden px-4 max-sm:gap-4">
        {/*         <Breadcrumb className="max-w-full">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="col flex flex-shrink-0 flex-col gap-1 text-sm leading-none"
              >
                Chat with PDF
                <span className="text-muted-foreground text-right text-[8px] leading-none">
                  by Makify ✨
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {!!chats.length && (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon className="h-4 -rotate-[15] opacity-10" />
                </BreadcrumbSeparator>
                <BreadcrumbPage className="overflow-auto">
                  <DocumentSwitcher chats={chats} />
                </BreadcrumbPage>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className="col flex flex-shrink-0 flex-col gap-1 text-sm leading-none">
          Chat with PDF
          <span className="text-muted-foreground text-right text-[8px] leading-none">
            by Makify ✨
          </span>
        </div>

        <div className="flex h-full flex-1 justify-center overflow-hidden">
          {!!chats.length && <DocumentSwitcher chats={chats} />}
        </div>
        <div className="flex flex-row gap-2 max-sm:hidden">
          <TooltipProvider delayDuration={0}>
            <FeedbackDialog
              triggerEl={
                <Button variant="outline" className="flex flex-row gap-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  Feedback
                </Button>
              }
            />
            <AppTour />
            <ThemeSwitcher />
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
