import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { useGlobalChat } from "hooks/use-global-chat";
import { HTMLAttributes, ReactNode } from "react";
import Markdown, { Components } from "react-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";
import { MESSAGE_TYPE } from "./constants/message-type";

export function AssistantMessage({
  children: message,
  type,
}: {
  children: string;
  type: string;
}) {
  const {
    useChatReturn: { append },
  } = useGlobalChat();

  function submitQuestion(question: string) {
    append({ role: "user", content: question });
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
      className="px-4 py-3"
      components={
        {
          p: ({ children }) => <p className="text-sm">{children}</p>,
          a: ({ children, href }) => (
            <a href={href} className="text-blue-500 hover:underline">
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul
              className={cn("list-outside py-1", {
                "list-disc pl-4": type !== MESSAGE_TYPE.SUGGESTION_MESSAGES,
                "flex flex-col gap-2 py-2":
                  type === MESSAGE_TYPE.SUGGESTION_MESSAGES,
              })}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className={cn("list-outside py-1", {
                "list-decimal pl-4": type !== MESSAGE_TYPE.SUGGESTION_MESSAGES,
                "flex flex-col gap-2 py-2":
                  type === MESSAGE_TYPE.SUGGESTION_MESSAGES,
              })}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className={cn({
                "pb-1 marker:font-semibold":
                  type !== MESSAGE_TYPE.SUGGESTION_MESSAGES,
              })}
            >
              {type === MESSAGE_TYPE.SUGGESTION_MESSAGES ? (
                <button
                  className={cn(
                    "z-10 box-border inline rounded-md border p-2 text-left transition-colors",
                    [
                      // Light mode
                      "bg-background hover:bg-gray-50",
                      // Dark mode
                      "dark:hover:border-boder dark:bg-gray-900 dark:hover:bg-gray-950",
                    ],
                  )}
                  onClick={() => submitQuestion(children?.toString() as string)}
                >
                  {children}
                </button>
              ) : (
                children
              )}
            </li>
          ),
          page: ({ children }: { children: ReactNode }) => (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <sup className="bg-background dark:border-muted-foreground top-0 mx-[2px] rounded-sm border-2 px-[6px] py-[1px] dark:border">
                    {children}
                  </sup>
                </TooltipTrigger>
                <TooltipContent>Based on the page {children}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        } as Partial<Components> & {
          // change the type of the page component to <sub> type of HTMLAttributes
          page: HTMLAttributes<HTMLElement>;
        }
      }
    >
      {message}
    </Markdown>
  );
}

function PageComponent({ children }: { children: string }) {
  return <div className="bg-purple-600 text-sm">{children}</div>;
}
