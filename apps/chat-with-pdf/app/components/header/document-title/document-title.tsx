"use client";

import { Button } from "@makify/ui/components/button";
import {
  Command,
  CommandItem,
  CommandList,
} from "@makify/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@makify/ui/components/popover";
import { cn } from "@makify/ui/lib/utils";
import { Tables } from "database.types";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDocumentByChatId } from "@/app/actions/get-document-by-chat-id";
import {
  EDIT_DOCUMENT_TAB,
  EditDocumentDialog,
} from "./edit-document-dialog/edit-document-dialog";

type DocumentTitleProps = {
  className?: string;
};

export function DocumentTitle({ className }: DocumentTitleProps) {
  const params = useParams();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [editDocumentDialogTab, setEditDocumentDialogTab] =
    useState<EDIT_DOCUMENT_TAB | null>(null);
  const [document, setDocument] = useState<Tables<"Document">>();

  useEffect(() => {
    getDocument();
  }, [params]);

  async function getDocument() {
    console.log("params", params);
    try {
      const document = await getDocumentByChatId(params.documentId as string);
      setDocument(document);
    } catch (error) {
      setDocument(undefined);
    }
  }

  function toggleEditDocumentDialog(isOpen: boolean) {
    setEditDocumentDialogTab(isOpen ? EDIT_DOCUMENT_TAB.EDIT : null);
  }

  function handleOpenEditDocumentDialog(tab: EDIT_DOCUMENT_TAB) {
    setEditDocumentDialogTab(tab);
  }

  if (!document) {
    return null;
  }

  return (
    <div className="flex w-fit max-w-sm flex-1 flex-row items-center justify-center gap-2 max-sm:max-w-full max-sm:justify-start">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            ref={buttonRef}
            aria-label="Select a team"
            className={cn("flex justify-between gap-2 truncate", className)}
          >
            <div className="flex flex-col truncate text-left">
              <span className="truncate">{document?.name}</span>
            </div>
            <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-fit p-1" side="bottom" align="end">
          <Command>
            <CommandList>
              <CommandItem
                className="flex h-8 cursor-pointer flex-row gap-2 text-sm"
                onSelect={() => {
                  handleOpenEditDocumentDialog(EDIT_DOCUMENT_TAB.EDIT);
                }}
              >
                <PencilIcon className="h-4 min-h-4 w-4 shrink-0 text-gray-500" />
                <span className="truncate">Rename title</span>
              </CommandItem>
              <CommandItem
                className="flex h-8 cursor-pointer flex-row gap-2 text-sm"
                onSelect={() => {
                  handleOpenEditDocumentDialog(EDIT_DOCUMENT_TAB.DELETE);
                }}
              >
                <TrashIcon className="h-4 min-h-4 w-4 shrink-0 text-gray-500" />
                <span className="truncate">Delete</span>
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {document && editDocumentDialogTab && (
        <EditDocumentDialog
          document={document}
          defaultTab={editDocumentDialogTab}
          isOpen
          onOpenChange={toggleEditDocumentDialog}
        />
      )}
    </div>
  );
}
