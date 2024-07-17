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
import { Input } from "@makify/ui/components/input";
import { Label } from "@makify/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@makify/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@makify/ui/components/select";
import { cn } from "@makify/ui/lib/utils";
import { Chat } from "@prisma/client";
import {
  FileTextIcon,
  PlusCircleIcon,
  ChevronsUpDownIcon,
  CheckIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const selectedDocument =
    chats.find((chat) => chat.id === params.documentId) || chats[0];

  useEffect(setPopoverWidth, []);

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
    <div className="flex w-3/4 max-w-96 flex-row items-center justify-center gap-2">
      <span className="text-muted-foreground text-sm">Chatting with:</span>
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
              <CommandInput placeholder="Search team..." />
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
                      <FileTextIcon className="h-4 min-h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">
                        {chat?.documentMetadata?.title}
                      </span>
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
                      className="h-10"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import new document</DialogTitle>
            <DialogDescription>
              Add a new document to chat with with.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team name</Label>
                <Input id="name" placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription plan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">
                      <span className="font-medium">Free</span> -{" "}
                      <span className="text-muted-foreground">
                        Trial for two weeks
                      </span>
                    </SelectItem>
                    <SelectItem value="pro">
                      <span className="font-medium">Pro</span> -{" "}
                      <span className="text-muted-foreground">
                        $9/month per user
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
