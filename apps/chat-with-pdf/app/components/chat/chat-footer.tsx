import { generateSuggestedQuestions } from "@/app/actions/generate-suggested-questions";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  ScrollArea,
  ScrollBar,
  Textarea,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useGlobalChat } from "hooks/use-global-chat";
import {
  MessageSquareIcon,
  SendIcon,
  SparkleIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const helpfulQuestions = [
  "What were the initial goals and challenges faced by Elon Musk's X.com in the online financial services sector?",
  "How did the merger with Confinity contribute to X.com's growth and the eventual creation of PayPal?",
  "What factors contributed to PayPal's rapid growth and success, and how did its integration with eBay impact its popularity?",
  "What were the key reasons behind eBay's acquisition of PayPal, and how did this acquisition affect PayPal's trajectory?",
  "What were the reasons behind Elon Musk's departure from PayPal, and what other ventures did he pursue after leaving the company?",
];

const AnimatedScrollArea = motion(ScrollArea);

export function ChatFooter() {
  const questionsContainerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isHelpfulQuestionsOpen, setIsHelpfulQuestionsOpen] = useState(false);
  const [hasTextareaGrown, setHasTextareaGrown] = useState(false);
  const [questionsContainerHeight, setQuestionsContainerHeight] = useState(0);

  const {
    globalContext: { extraData, setExtraData },
    useChatReturn: {
      input: inputValue,
      setInput,
      append,
      handleInputChange,
      isLoading,
    },
  } = useGlobalChat();

  useEffect(() => {
    /* getQuestions(); */
    getQuestionsContainerHeight();
  }, []);

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

    if (!hasGrown && hasGrown !== hasTextareaGrown) {
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

  async function getQuestions() {
    const questions = await generateSuggestedQuestions(
      extraData?.documentId as string,
    );

    console.log(questions);
  }

  function getQuestionsContainerHeight() {
    const height = questionsContainerRef.current?.scrollHeight;
    setQuestionsContainerHeight(height || 0);
  }

  function toggleHelpfulQuestions() {
    setIsHelpfulQuestionsOpen(!isHelpfulQuestionsOpen);
  }

  return (
    <div className="border-border relative z-10 flex flex-col gap-2 border-t p-3">
      <motion.div
        className={cn("flex flex-col gap-2")}
        initial={{ height: 0 }}
        animate={{
          height: isHelpfulQuestionsOpen
            ? "auto"
            : questionsContainerHeight || "auto",
          overflow: isHelpfulQuestionsOpen ? "hidden" : "auto",
        }}
        exit={{ height: questionsContainerHeight || "auto" }}
        transition={{ duration: 0.3 }}
        ref={questionsContainerRef}
      >
        <button
          className="bg-muted absolute left-1/2 top-2 z-10 mx-auto h-1.5 w-[100px] flex-shrink-0 -translate-x-1/2 rounded-full"
          onClick={toggleHelpfulQuestions}
        />
        <div className="mt-2 flex flex-row items-center gap-2">
          <ScrollArea>
            <motion.div
              className={cn({
                "flex space-x-2 overflow-x-auto pb-3": !isHelpfulQuestionsOpen,
                "flex flex-col gap-2": isHelpfulQuestionsOpen,
              })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {helpfulQuestions.map((question) => (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "relative flex justify-start gap-1.5 p-2 text-left",
                    {
                      "h-auto whitespace-pre-wrap": isHelpfulQuestionsOpen,
                      "whitespace-nowrap": !isHelpfulQuestionsOpen,
                    },
                  )}
                >
                  <span className="relative shrink-0">
                    <SparkleIcon className="absolute -top-1 left-1 h-3 w-3" />
                    <MessageSquareIcon className="h-3 w-3" />
                  </span>
                  {question}
                </Button>
              ))}
            </motion.div>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </ScrollArea>
        </div>
      </motion.div>
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

      <form
        className="flex flex-col gap-2"
        onSubmit={handleOnSubmit}
        ref={formRef}
      >
        <div
          className={cn(
            "bg-secondary relative flex flex-row justify-between gap-1 rounded-md p-2 pl-4 pr-3",
            {
              "items-center": !hasTextareaGrown,
              "items-end": hasTextareaGrown,
            },
          )}
        >
          <Textarea
            className="min-h-2 max-h-24 flex-1 resize-none border-0 border-none p-[2px] shadow-none focus:[box-shadow:none] focus:[outline:none] focus-visible:[box-shadow:none] focus-visible:[outline:none]"
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
        <p className="text-muted-foreground text-center text-sm">
          AI Assistant can make mistakes. Please check important information.
        </p>
      </form>
    </div>
  );
}
