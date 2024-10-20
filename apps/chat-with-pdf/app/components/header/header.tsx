import {
  CommandShortcut,
  SidebarTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { DocumentTitle } from "./document-title/document-title";

export async function Header() {
  return (
    <header className="relative border-b">
      <div className="flex h-14 flex-row items-center justify-between gap-4 overflow-hidden pl-2 pr-4 max-sm:gap-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent side="right">
              Toogle sidebar <CommandShortcut>⌘B</CommandShortcut>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex h-full flex-1 justify-center overflow-hidden">
          <DocumentTitle />
        </div>
        <div className="flex flex-row items-center gap-2 max-sm:hidden"></div>
      </div>
    </header>
  );
}
