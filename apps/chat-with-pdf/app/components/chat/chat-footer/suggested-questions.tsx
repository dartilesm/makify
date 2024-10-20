"use client";

import { Button } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { motion } from "framer-motion";
import { useGlobalChat } from "hooks/use-global-chat";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  SparkleIcon,
  SparklesIcon,
} from "lucide-react";
import { forwardRef, useRef, useState } from "react";

const AnimatedButton = motion(Button);

export const SuggestedQuestions = forwardRef<
  HTMLDivElement,
  { questions: string[] }
>(({ questions }, ref) => {
  const questionsContainerRef = useRef<HTMLDivElement | null>(null);
  const [isSuggestedQuestionsOpen, setIsSuggestedQuestionsOpen] =
    useState(false);
  const [questionsContainer, setQuestionsContainer] = useState({
    onOpen: 0,
    onClose: 0,
  });

  const {
    useChatReturn: { append },
  } = useGlobalChat();

  function toggleHelpfulQuestions() {
    setIsSuggestedQuestionsOpen(!isSuggestedQuestionsOpen);
  }

  function getQuestionsContainerHeight() {
    const height = questionsContainerRef.current?.scrollHeight;
    const state = isSuggestedQuestionsOpen ? "onOpen" : "onClose";
    setQuestionsContainer((prev) => ({
      ...prev,
      [state]: height || 0,
    }));
  }

  function submitQuestion(question: string) {
    append({
      role: "user",
      content: question,
    });
  }

  return (
    <motion.div
      className="flex max-w-full flex-col gap-2"
      initial={{ maxHeight: 52 }}
      animate={{
        maxHeight: isSuggestedQuestionsOpen ? 200 : questionsContainer.onClose,
        height: isSuggestedQuestionsOpen
          ? questionsContainer.onOpen || 200
          : questionsContainer.onClose,
        overflow: isSuggestedQuestionsOpen ? "hidden" : "auto",
      }}
      exit={{ height: questionsContainer.onClose || "auto" }}
      onAnimationComplete={getQuestionsContainerHeight}
      transition={{ duration: 0.3, delay: isSuggestedQuestionsOpen ? 0.3 : 0 }}
      ref={(el) => {
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
        questionsContainerRef.current = el;
      }}
    >
      <button
        className="absolute left-1/2 top-2 z-10 mx-auto flex h-1.5 w-[100px] flex-shrink-0 -translate-x-1/2 justify-center rounded-full"
        onClick={toggleHelpfulQuestions}
      >
        {!isSuggestedQuestionsOpen && (
          <ChevronUpIcon className="text-muted-foreground -mt-1 h-4 w-4 flex-shrink-0" />
        )}
        {isSuggestedQuestionsOpen && (
          <ChevronDownIcon className="text-muted-foreground -mt-1 h-4 w-4 flex-shrink-0" />
        )}
      </button>
      <span className="text-muted-foreground inline-flex flex-row items-center gap-2 text-sm">
        Suggested questions <SparklesIcon className="h-3 w-3" />
      </span>
      <div
        className={cn("flex flex-row items-center gap-2", {
          "overflow-hidden": isSuggestedQuestionsOpen,
        })}
      >
        <motion.div
          className={cn("flex", {
            "space-x-2 overflow-x-auto pb-3": !isSuggestedQuestionsOpen,
            "max-h-full w-full overflow-auto": isSuggestedQuestionsOpen,
          })}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            flexDirection: isSuggestedQuestionsOpen ? "column" : "row",
            gap: isSuggestedQuestionsOpen ? "8px" : "0px",
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: !isSuggestedQuestionsOpen ? 0.3 : 0,
          }}
        >
          {questions.map((question) => (
            <AnimatedButton
              variant="outline"
              size="sm"
              animate={{
                whiteSpace: isSuggestedQuestionsOpen ? "pre-wrap" : "nowrap",
              }}
              transition={{
                duration: 0.3,
                delay: !isSuggestedQuestionsOpen ? 0.3 : 0,
              }}
              className={cn(
                "relative flex items-start justify-start gap-2 p-2 text-left",
                { "h-auto": isSuggestedQuestionsOpen },
              )}
              onClick={() => submitQuestion(question)}
            >
              <span className="relative mt-1 shrink-0">
                <SparkleIcon className="absolute -top-1 left-1 h-3 w-3" />
                <MessageSquareIcon className="h-3 w-3" />
              </span>
              <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {question}
              </span>
            </AnimatedButton>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});
