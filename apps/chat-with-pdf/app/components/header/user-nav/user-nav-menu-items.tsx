"use client";

import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  ToggleGroup,
  ToggleGroupItem,
} from "@makify/ui";
import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function UserNavMenuItems() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  console.log(theme);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer">
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          Theme
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
            <ToggleGroupItem value="light" className="aspect-square rounded-md">
              <SunIcon className="text-muted-foreground h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" className="aspect-square rounded-md">
              <MoonIcon className="text-muted-foreground h-3 w-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>{" "}
    </>
  );
}
