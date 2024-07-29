import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Textarea,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useGlobalChat } from "hooks/use-global-chat";
import { SendIcon, XIcon } from "lucide-react";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";

export function ChatFooter() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [hasTextareaGrown, setHasTextareaGrown] = useState(false);

  const {
    globalContext: { extraData, setExtraData },
    useChatReturn: {
      input: inputValue,
      setInput,
      append,
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

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleOnSubmit(event);
    }
  }

  function removeQuotedText() {
    setExtraData({});
    setInput("");
  }

  function handleOnSubmit(
    event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>,
  ) {
    event.preventDefault();
    append({
      role: "user",
      content: inputValue,
      data: (extraData as Message["data"]) || {},
    });
    removeQuotedText();
  }

  return (
    <div className="border-border z-10 flex flex-col gap-2 border-t-[1px] p-3">
      <AnimatePresence>
        {(extraData?.quotedText as string) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert className="flex max-h-24 flex-row items-center justify-between gap-2">
              <div>
                <AlertTitle>
                  Quoted text from page {extraData?.page as string}
                </AlertTitle>
                <AlertDescription className="line-clamp-3">
                  {extraData?.quotedText as string}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeQuotedText}
                className="flex-shrink-0"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
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
