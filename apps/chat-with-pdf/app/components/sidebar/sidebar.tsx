"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import {
  LaptopMinimalIcon,
  LogOut,
  MessageSquareIcon,
  MessageSquarePlusIcon,
  MoonIcon,
  PanelRightIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FeedbackDialog } from "../header/feedback-dialog";
import RecentConversations from "./recent-conversations";

type SidebarProps = {
  userInfo: React.ReactNode;
  userAvatar: React.ReactNode;
  className?: string;
};

export function Sidebar({ userAvatar, userInfo, className }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <div
          className={cn("flex items-end pb-2 pl-1", className)}
          onMouseEnter={() => setIsOpen(true)}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="outline-border relative h-8 w-8 rounded-full shadow-sm outline outline-1 outline-offset-2">
              {userAvatar}
            </div>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              <PanelRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="z-20 flex flex-col justify-between rounded-br-md rounded-tr-md px-1 pb-2 pt-14 sm:max-w-xs"
        hideCloseIcon
        onMouseLeave={() => setIsOpen(false)}
      >
        <SheetHeader>
          {/* Add list of chats here and a button to create a new chat */}
          <div className="flex flex-col gap-4">
            <Button variant="outline" className="justify-start gap-2">
              <MessageSquarePlusIcon className="h-4 w-4" />
              New conversation
            </Button>
            <Separator />
            <RecentConversations />
          </div>
        </SheetHeader>
        <SheetFooter className="flex gap-2 sm:flex-col sm:justify-start sm:space-x-0">
          <div className="flex flex-col gap-2">
            <FeedbackDialog
              triggerEl={
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  Feedback
                </Button>
              }
            />
            <Button
              variant="ghost"
              className="flex w-full justify-between gap-2"
            >
              <span className="flex items-center justify-start gap-2">
                <SunMoonIcon className="h-4 w-4" />
                Theme
              </span>
              <ToggleGroup
                type="single"
                size="sm"
                value={theme}
                onValueChange={(value) => setTheme(value)}
                onClick={(event) => event.stopPropagation()}
                className="border-border bg-background rounded-md border"
              >
                <ToggleGroupItem
                  value="system"
                  className="aspect-square rounded-md"
                >
                  <LaptopMinimalIcon className="text-muted-foreground h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="light"
                  className="aspect-square rounded-md"
                >
                  <SunIcon className="text-muted-foreground h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  className="aspect-square rounded-md"
                >
                  <MoonIcon className="text-muted-foreground h-3 w-3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </Button>
          </div>
          <Separator className="ml-0" />
          <div className="flex flex-col gap-1">
            {userInfo}
            <Button
              variant="ghost"
              className="flex justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
