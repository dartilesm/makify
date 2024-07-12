import Markdown from "react-markdown";

export function AssistantMessage({ children: message }: { children: string }) {
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
          <ul className="list-inside list-disc pb-1">{children}</ul>
        ),
        li: ({ children }) => <li className="pb-1">{children}</li>,
      }}
    >
      {message}
    </Markdown>
  );
}
