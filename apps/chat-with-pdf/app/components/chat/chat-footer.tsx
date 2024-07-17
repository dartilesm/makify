import { Button, Textarea } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { useChat } from "ai/react";
import { SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export function ChatFooter() {
  const params = useParams();
  const [hasTextareaGrown, setHasTextareaGrown] = useState(false);
  const {
    input: inputValue,
    handleSubmit,
    handleInputChange,
  } = useChat({ id: params.documentId as string });

  function extractTextareaLineHeight(textarea: HTMLTextAreaElement) {
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = computedStyle.lineHeight;
    return parseFloat(lineHeight);
  }

  function resizeTextarea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    const textareaLineHeight = extractTextareaLineHeight(event.target);

    const hasGrown = textarea.scrollHeight > textareaLineHeight;

    if (hasGrown !== hasTextareaGrown) {
      setHasTextareaGrown(hasGrown);
    }
  }

  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    resizeTextarea(event);
    handleInputChange(event);
  }

  return (
    <div className="z-10 px-4 pb-3">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "bg-primary-foreground relative flex flex-row justify-between gap-1 rounded-md p-2 pl-4 pr-3",
            {
              "items-center": !hasTextareaGrown,
              "items-end": hasTextareaGrown,
            },
          )}
        >
          <Textarea
            className="max-h-24 min-h-2 flex-1 resize-none border-0 border-none p-0 shadow-none focus:[box-shadow:none] focus:[outline:none] focus-visible:[box-shadow:none] focus-visible:[outline:none]"
            placeholder={`Ask me anything about the document...`}
            rows={1}
            onChange={handleTextareaChange}
            value={inputValue}
          />
          <Button type="submit" variant="ghost" size="icon">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
