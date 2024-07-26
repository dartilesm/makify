import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { DownloadIcon, RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";
import { Resolution, usePDF } from "react-to-pdf";

export function ChatHeader() {
  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: "chat.pdf",
    resolution: Resolution.MEDIUM,
  });

  useEffect(() => {
    targetRef.current = document.querySelector("#chat-messages");
  }, []);

  return (
    <header className="flex items-center border-b-[1px] border-gray-100 p-2">
      <TooltipProvider delayDuration={0}>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex gap-2"
                variant="ghost"
                size="default"
                onClick={() => toPDF()}
              >
                <span className="sr-only">Reset chat</span>
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Delete the conversation and start a new one.
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex gap-2"
                variant="ghost"
                size="default"
                onClick={() => toPDF()}
              >
                <span>Download chat</span>
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Download the conversation as PDF.
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      {/* <Separator orientation="vertical" className="mx-2 h-6" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
          <DropdownMenuItem>Star thread</DropdownMenuItem>
          <DropdownMenuItem>Add label</DropdownMenuItem>
          <DropdownMenuItem>Mute thread</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </header>
  );
}
