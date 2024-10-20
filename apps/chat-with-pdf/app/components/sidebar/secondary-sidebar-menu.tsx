import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  ToggleGroup,
  ToggleGroupItem,
  SidebarMenuAction,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import {
  LaptopMinimalIcon,
  MessageSquareIcon,
  MoonIcon,
  MoreHorizontal,
  Plus,
  Settings2Icon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { FeedbackDialog } from "../header/feedback-dialog";

const ThemeIconsMap = {
  system: LaptopMinimalIcon,
  light: SunIcon,
  dark: MoonIcon,
};

const themeIconList = Object.keys(ThemeIconsMap);

export function SecondarySidebarMenu() {
  const { theme, setTheme } = useTheme();

  const CurrentThemeIcon = ThemeIconsMap[theme as keyof typeof ThemeIconsMap];

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <FeedbackDialog
              triggerEl={
                <SidebarMenuButton>
                  <MessageSquareIcon className="h-4 w-4" />
                  Feedback
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <span className="flex items-center justify-start gap-2">
                    <CurrentThemeIcon className="h-4 w-4" />
                    Theme
                  </span>
                  <SidebarMenuAction>
                    <Settings2Icon className="h-4 w-4" />
                  </SidebarMenuAction>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end">
                {themeIconList.map((themeIcon) => {
                  const ThemeIcon =
                    ThemeIconsMap[themeIcon as keyof typeof ThemeIconsMap];
                  return (
                    <DropdownMenuItem
                      key={themeIcon}
                      className={cn("cursor-pointer", {
                        "bg-accent": theme === themeIcon,
                      })}
                      onClick={() => setTheme(themeIcon)}
                    >
                      <ThemeIcon className="h-4 w-4" />
                      {themeIcon}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
