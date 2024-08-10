import { Skeleton } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";

export function ChatLoading() {
  const fakeMessagesLoading = Array.from({ length: 6 }, () => null);

  return (
    <div className="dark:bg-primary-foreground relative flex h-full flex-col bg-white">
      <div className="border-border flex h-[53px] items-center border-b-[1px] p-2" />
      <div className="relative flex-1 overflow-hidden" id="chat-messages">
        <div
          className="flex h-full overflow-hidden p-4"
          data-chat-messages-container
        >
          <div className="flex w-full flex-col gap-4">
            {fakeMessagesLoading.map((_, index) => (
              <div
                key={index}
                className={cn("flex w-full", {
                  "justify-end": index % 2 === 0,
                })}
              >
                {index % 2 !== 0 && (
                  <Skeleton
                    className={cn("w-[70%]", {
                      "h-20": index === 1,
                      "h-48": index === 3,
                      "h-72": index === 5,
                    })}
                  />
                )}
                {index % 2 === 0 && (
                  <Skeleton
                    className={cn("w-[70%]", {
                      "h-20": index === 0 || index === 2,
                      "h-10": index === 4,
                    })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-border z-10 flex h-20 flex-col gap-2 border-t-[1px] p-3" />
    </div>
  );
}
