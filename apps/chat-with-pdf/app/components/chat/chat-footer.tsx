import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Textarea,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { ChatRequestOptions } from "ai";
import { useGlobalChat } from "hooks/use-global-chat";
import { SendIcon, XIcon } from "lucide-react";
import { FormEvent, useRef, useState, useTransition } from "react";

export function ChatFooter() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [hasTextareaGrown, setHasTextareaGrown] = useState(false);

  const {
    globalContext: { quotedText, setQuotedText },
    useChatReturn: {
      input: inputValue,
      handleSubmit,
      handleInputChange,
      isLoading,
      messages,
    },
  } = useGlobalChat();

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

  function removeQuotedText() {
    setQuotedText(null);
  }

  function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
    handleSubmit(event, { data: { quotedText } });
  }

  console.log(messages);

  return (
    <div className="border-border z-10 flex flex-col gap-2 border-t-[1px] p-3">
      {quotedText && (
        <div>
          <Alert className="flex max-h-24 flex-row items-center justify-between gap-2">
            <div>
              <AlertTitle>Quoted text</AlertTitle>
              <AlertDescription className="line-clamp-3">
                {quotedText}
              </AlertDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={removeQuotedText}>
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </Alert>
        </div>
      )}
      <form onSubmit={handleOnSubmit} ref={formRef}>
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
            disabled={!inputValue || isLoading}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
