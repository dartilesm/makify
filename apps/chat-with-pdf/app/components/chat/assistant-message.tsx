import { ChatContext } from "@/app/context/chat-context";
import { cn } from "@makify/ui/lib/utils";
import { useContext } from "react";
import Markdown from "react-markdown";
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
  } = useContext(ChatContext);

  function submitQuestion(question: string) {
    append({ role: "user", content: question });
  }

  return (
    <Markdown
      components={{
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
                className="z-10 box-border inline rounded-md border-[1px] border-gray-300 bg-gray-50 p-2 text-left transition-colors hover:bg-gray-200"
                onClick={() => submitQuestion(children?.toString() as string)}
              >
                {children}
              </button>
            ) : (
              children
            )}
          </li>
        ),
      }}
    >
      {message}
    </Markdown>
  );
}
// display: inline;
//     background-color: #ededed;
//     padding: 4px;
//     border-radius: 12px;
//     border: 1px solid #d8d8d8;
//     text-align: start;
