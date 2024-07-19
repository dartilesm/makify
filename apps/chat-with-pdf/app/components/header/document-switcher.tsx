"use client";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@makify/ui/components/dialog";
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
  PlusCircleIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NewDocumentDialogContent } from "./document-switcher/new-document-dialog-content";
import { FormProvider, useForm } from "react-hook-form";
import { uploadNewDocument } from "@/app/actions/upload-new-document";

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
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

  const methods = useForm({ mode: "onChange" });

  useEffect(setPopoverWidth, []);

  const selectedDocument =
    chats.find((chat) => chat.id === params.documentId) || chats[0];

  function setPopoverWidth() {
    const buttonStyles = window.getComputedStyle(buttonRef.current as Element);
    const buttonMaxWidth = buttonStyles.getPropertyValue("max-width");
    const buttonWidth = buttonStyles.getPropertyValue("width");

    setPopoverDynamicStyles({
      maxWidth: buttonMaxWidth,
      width: buttonWidth,
    });
  }

  return (
    <div className="flex w-3/4 max-w-96 flex-row items-center justify-center">
      <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
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
                  {selectedDocument?.documentMetadata?.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedDocument?.documentMetadata?.numPages} page
                  {selectedDocument?.documentMetadata?.numPages > 1
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
                      <div className="flex flex-1 flex-row items-center gap-2">
                        <FileTextIcon className="h-4 min-h-4 w-4 shrink-0 text-gray-500" />
                        <span className="truncate">
                          {chat?.documentMetadata?.title}
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
                  <DialogTrigger asChild>
                    <CommandItem
                      className="h-10 cursor-pointer"
                      onSelect={() => {
                        setOpen(false);
                        setShowNewTeamDialog(true);
                      }}
                    >
                      <PlusCircleIcon className="mr-2 h-5 w-5" />
                      Chat with new document
                    </CommandItem>
                  </DialogTrigger>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Start chatting with a new document</DialogTitle>
            <DialogDescription>
              Add a new document to chat with with.
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...methods}>
            <form className="flex flex-col gap-2" action={uploadNewDocument}>
              <NewDocumentDialogContent />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewTeamDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!methods.formState.isValid}>
                  Import
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
