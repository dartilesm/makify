import { createClient } from "@/lib/supabase/server";
import { UserAvatar } from "../ui/user-avatar";

export async function UserInfo() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center gap-2 px-2">
      <div className="outline-border relative h-8 w-8 rounded-full shadow-sm outline outline-1 outline-offset-2">
        <UserAvatar />
      </div>
      <div className="flex flex-col overflow-hidden text-sm font-medium">
        <span>
          {user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            "Unknown User"}
        </span>
        <span className="text-muted-foreground truncate" title={user?.email}>
          {user?.email}
        </span>
      </div>
    </div>
  );
}
