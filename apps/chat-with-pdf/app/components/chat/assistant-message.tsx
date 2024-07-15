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
  const { append } = useChat({ id: params.documentId as string });

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
            })}
          >
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="pb-1">
            {type === "questions" ? (
              <Button
                className="z-10"
                variant="outline"
                onClick={() => submitQuestion(children?.toString() as string)}
              >
                {children}
              </Button>
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
