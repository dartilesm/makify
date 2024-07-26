import { Button, Textarea } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { useChat } from "ai/react";
import { SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export function ChatFooter() {
  const params = useParams();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [hasTextareaGrown, setHasTextareaGrown] = useState(false);
  const {
    input: inputValue,
    handleSubmit,
    handleInputChange,
  } = useChat({
    id: params.documentId as string,
    body: {
      documentId: params.documentId as string,
    },
  });

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

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="z-10 px-4 pb-3">
      <form onSubmit={handleSubmit} ref={formRef}>
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
            className="max-h-24 min-h-2 flex-1 resize-none border-0 border-none p-[2px] shadow-none focus:[box-shadow:none] focus:[outline:none] focus-visible:[box-shadow:none] focus-visible:[outline:none]"
            placeholder={`Ask me anything about the document...`}
            rows={1}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            value={inputValue}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!inputValue}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
