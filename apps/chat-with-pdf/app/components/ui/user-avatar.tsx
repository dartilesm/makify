import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@makify/ui/components/avatar";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@makify/ui/lib/utils";

interface UserAvatarProps {
  className?: string;
}

export async function UserAvatar({ className }: UserAvatarProps) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  function getAvatarFallback() {
    if (!user) return "";
    const userFullName =
      user.user_metadata?.full_name || user.user_metadata?.name;
    const userEmail = user.email;
    const userFallback = (userFullName || userEmail)?.toUpperCase();

    return userFallback
      ?.split(" ")
      .map((name: string) => name[0])
      .join("");
  }

  if (error) {
    console.error(error);
    return (
      <Avatar className={className}>
        <AvatarFallback>!</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src={user?.user_metadata?.avatar_url} />
      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
    </Avatar>
  );
}
