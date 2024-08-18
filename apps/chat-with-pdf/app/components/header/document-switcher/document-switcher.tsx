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
import { useMemo, useRef, useState } from "react";
import { EditDocumentDialog } from "./edit-document-dialog/edit-document-dialog";
import { NewDocumentDialog } from "./new-document-dialog/new-document-dialog";

type DocumentSwitcherProps = {
  className?: string;
  chats: Chat[];
};

export function DocumentSwitcher({ className, chats }: DocumentSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const [showEditDocumentDialog, setShowEditDocumentDialog] = useState(false);

  const selectedDocument = useMemo(
    () => chats.find((chat) => chat.id === params.documentId),
    [params.documentId, chats],
  );

  function toggleEditDocumentDialog(isOpen: boolean) {
    setShowEditDocumentDialog(isOpen);
  }

  return (
    <div className="flex max-w-lg flex-1 flex-row items-center justify-center gap-2 max-sm:max-w-full max-sm:justify-start sm:w-3/4">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex h-12 flex-1 items-center justify-between gap-2 truncate">
          <FileTextIcon className="min-h-4 h-4 w-4 shrink-0 text-gray-500" />
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
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              role="combobox"
              aria-expanded={open}
              ref={buttonRef}
              aria-label="Select a team"
              className={cn(className)}
            >
              <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="z-10 max-w-sm p-0 max-sm:max-w-full"
          align="end"
        >
          <Command>
            <CommandInput placeholder="Search document..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {chats.map((chat) => (
                  <CommandItem
                    value={chat.id}
                    key={chat.id}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/chat/${chat.id}`);
                    }}
                    className="flex h-10 cursor-pointer flex-row gap-2 text-sm"
                  >
                    <div className="flex flex-1 flex-row items-center gap-2 truncate">
                      <FileTextIcon className="min-h-4 h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">
                        {(chat?.documentMetadata as Record<string, any>)?.title}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "min-h-4 h-4 w-4 shrink-0",
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
              <TooltipProvider delayDuration={0}>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <CommandGroup>
                      <CommandItem
                        disabled={chats.length === 5}
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
                  </TooltipTrigger>
                  {chats.length === 5 && (
                    <TooltipContent>
                      You have reached the maximum number of documents.
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedDocument && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => toggleEditDocumentDialog(true)}
                size="icon"
                variant="ghost"
              >
                <PencilIcon className="stroke-muted-foreground h-4 w-4" />
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
