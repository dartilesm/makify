import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export function Chat({ className }: { className?: string }) {
    return <div className={cn("h-full flex flex-col", className)}>
        <header className="flex h-[60px] items-center justify-between border-b px-6 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage alt="Recipient Avatar" src="/placeholder-avatar.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-sm font-medium">John Doe</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                </div>
            </div>
            <Button className="rounded-full" size="icon" variant="ghost">
                <DotsVerticalIcon className="h-5 w-5" />
            </Button>
        </header>
        <div className="flex-1 overflow-auto p-4">
            <div className="grid gap-4">
                <div className="flex justify-end">
                    <div className="max-w-[70%] space-y-1.5">
                        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                            <p>Hey there! How's it going?</p>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">3:45 PM</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="max-w-[70%] space-y-1.5">
                        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                            <p>I'm doing great, thanks for asking!</p>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">3:46 PM</div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="max-w-[70%] space-y-1.5">
                        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                            <p>Awesome, I'm glad to hear that. Did you catch the game last night?</p>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">3:47 PM</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="max-w-[70%] space-y-1.5">
                        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                            <p>No, I missed it. What happened?</p>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">3:48 PM</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="border-t bg-gray-100 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-2">
                <Input className="flex-1" placeholder="Type your message..." type="text" />
                <Button>
                    Submit
                </Button>
            </div>
        </div>
    </div>
}