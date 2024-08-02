"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { Button } from "@makify/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@makify/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@makify/ui/components/popover";
import { cn } from "@makify/ui/lib/utils";
import { Chat } from "@prisma/client";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  PencilIcon,
  PlusCircleIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditDocumentDialog } from "../edit-document-dialog/edit-document-dialog";
import { NewDocumentDialog } from "../new-document-dialog/new-document-dialog";

type DocumentSwitcherProps = {
  className?: string;
  chats: Chat[];
};

export function DocumentSwitcher({ className, chats }: DocumentSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [popoverDynamicStyles, setPopoverDynamicStyles] = useState({});
  const [open, setOpen] = useState(false);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const [showEditDocumentDialog, setShowEditDocumentDialog] = useState(false);

  useEffect(setPopoverWidth, []);

  const selectedDocument = useMemo(
    () => chats.find((chat) => chat.id === params.documentId),
    [params.documentId, chats],
  );

  function setPopoverWidth() {
    const buttonStyles = window.getComputedStyle(buttonRef.current as Element);
    const buttonMaxWidth = buttonStyles.getPropertyValue("max-width");
    const buttonWidth = buttonStyles.getPropertyValue("width");

    setPopoverDynamicStyles({
      maxWidth: buttonMaxWidth,
      width: buttonWidth,
    });
  }

  function toggleEditDocumentDialog() {
    setShowEditDocumentDialog((prev) => !prev);
  }

  return (
    <div className="flex w-3/4 max-w-96 flex-row items-center justify-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            ref={buttonRef}
            aria-label="Select a team"
            className={cn(
              "flex h-14 flex-1 justify-between gap-2 truncate",
              className,
            )}
          >
            <FileTextIcon className="h-4 min-h-4 w-4 shrink-0 text-gray-500" />
            <div className="flex flex-col truncate text-left">
              <span className="truncate">
                {
                  (selectedDocument?.documentMetadata as Record<string, any>)
                    ?.title
                }
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {
                  (selectedDocument?.documentMetadata as Record<string, any>)
                    ?.numPages
                }{" "}
                page
                {(selectedDocument?.documentMetadata as Record<string, any>)
                  ?.numPages > 1
                  ? "s"
                  : ""}{" "}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-10 w-2/4 max-w-96 p-0"
          style={popoverDynamicStyles}
        >
          <Command>
            <CommandInput placeholder="Search document..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {chats.map((chat) => (
                  <CommandItem
                    key={chat.id}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/chat/${chat.id}`);
                    }}
                    className="flex h-10 cursor-pointer flex-row gap-2 text-sm"
                  >
                    <div className="flex flex-1 flex-row items-center gap-2 truncate">
                      <FileTextIcon className="h-4 min-h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">
                        {(chat?.documentMetadata as Record<string, any>)?.title}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "h-4 min-h-4 w-4 shrink-0",
                        params.documentId === chat.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  className="h-10 cursor-pointer"
                  onSelect={() => {
                    setOpen(false);
                    setShowNewDocumentDialog(true);
                  }}
                >
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  Chat with new document
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedDocument && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleEditDocumentDialog}
                size="icon"
                variant="ghost"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Edit document</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <NewDocumentDialog
        isOpen={showNewDocumentDialog}
        onOpenChange={setShowNewDocumentDialog}
      />
      {selectedDocument && (
        <EditDocumentDialog
          chat={selectedDocument}
          isOpen={showEditDocumentDialog}
          onOpenChange={toggleEditDocumentDialog}
        />
      )}
    </div>
  );
}
