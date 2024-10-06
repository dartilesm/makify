import { createClient } from "@/lib/supabase/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@makify/ui/components/avatar";
import { Button } from "@makify/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@makify/ui/components/dropdown-menu";
import { UserNavMenuItems } from "./user-nav-menu-items";

export async function UserNav() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const userMetadata = data.user?.user_metadata;

  function getAvatarFallback() {
    const userFullName = userMetadata?.full_name || userMetadata?.name;
    const userEmail = userMetadata?.email;
    const userFallback = (userFullName || userEmail)?.toUpperCase();

    return userFallback
      ?.split(" ")
      .map((name: string) => name[0])
      .join("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="outline-border relative h-8 w-8 rounded-full shadow-sm outline outline-1 outline-offset-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userMetadata?.avatar_url} />
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userMetadata?.full_name || userMetadata?.name}
            </p>
            <p className="text-muted-foreground break-all text-xs leading-none">
              {userMetadata?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserNavMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
