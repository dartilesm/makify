import { Button } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";

export function AssistantMessage({
  children: message,
  type,
}: {
  children: string;
  type: string;
}) {
  const params = useParams();

  const { append } = useChat({
    id: params.documentId as string,
  });

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
            className={cn("list-inside pb-1", {
              "list-disc": type !== "questions",
              "flex flex-col gap-2 py-2": type === "questions",
            })}
          >
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li
            className={cn({
              "pb-1": type !== "questions",
            })}
          >
            {type === "questions" ? (
              <button
                className="z-10 box-border inline rounded-2xl border-[1px] border-gray-300 bg-gray-50 p-2 text-left transition-colors hover:bg-gray-200"
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
