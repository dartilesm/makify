import { Button } from "@makify/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@makify/ui/components/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserNavMenuItems } from "./user-nav-menu-items";
import { createClient } from "@/lib/supabase/server";

export async function UserNav() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userMetadata = user?.user_metadata;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="outline-border relative h-8 w-8 rounded-full shadow-sm outline outline-1 outline-offset-2"
        >
          <UserAvatar className="h-8 w-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userMetadata?.full_name || userMetadata?.name}
            </p>
            <p className="text-muted-foreground break-all text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserNavMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
