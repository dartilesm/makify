import { Button } from "@makify/ui";
import { AnimatePresence, motion } from "framer-motion";
import { SadFaceIcon } from "icons/sad-face";
import { SparkleIcon } from "icons/sparkle";
import { CheckIcon, ClockIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  loadingPdfFileMessages,
  loadingPdfLinkMessages,
} from "../document-switcher/constants/loading-messages";

const SparkleIconAnimated = motion(SparkleIcon);
const SadFaceIconAnimated = motion(SadFaceIcon);
const ButtonAnimated = motion(Button);

type NewDocumentLoadingStateProps = {
  loadingMessages:
    | typeof loadingPdfLinkMessages
    | typeof loadingPdfFileMessages;
  onTryAgain: () => void;
};

export function NewDocumentLoadingState({
  loadingMessages,
  onTryAgain,
}: NewDocumentLoadingStateProps) {
  const loadingTextRefs = useRef<HTMLDivElement[] | null[]>([]);

  useEffect(handleLoadingMessageChanges, [loadingMessages]);

  const failedLoadingMessage = loadingMessages?.find((step) => step?.error);

  function handleLoadingMessageChanges() {
    /* Auto scroll to next loading message */
    const lastActiveIndex = loadingMessages.findIndex(
      (step) => !step.completed,
    );
    console.log(lastActiveIndex);
    if (loadingTextRefs.current[lastActiveIndex]) {
      loadingTextRefs.current[lastActiveIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function handleTryAgain() {
    if (onTryAgain && typeof onTryAgain === "function") {
      onTryAgain();
    }
  }

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center gap-4"
      layout
    >
      <div className="relative h-16 w-16">
        <AnimatePresence mode="popLayout">
          {failedLoadingMessage?.error && (
            <SadFaceIconAnimated
              className="h-full w-full"
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {!failedLoadingMessage?.error && (
            <>
              <SparkleIconAnimated
                className="text-primary absolute bottom-2 h-10 w-10"
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  repeatDelay: 0.5,
                  repeatType: "reverse",
                }}
              />
              <SparkleIconAnimated
                className="text-primary absolute bottom-0 right-0 h-6 w-6"
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{
                  delay: 0.25,
                  repeat: Infinity,
                  duration: 0.5,
                  repeatDelay: 0.5,
                  repeatType: "reverse",
                }}
              />
              <SparkleIconAnimated
                className="text-primary absolute right-2 top-2 h-5 w-5"
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{
                  delay: 0.5,
                  repeat: Infinity,
                  duration: 0.5,
                  repeatDelay: 0.5,
                  repeatType: "reverse",
                }}
              />
            </>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b to-transparent" />
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t to-transparent" />
        <div className="flex h-20 flex-col gap-[6px] overflow-hidden">
          {loadingMessages.map((step, index) => (
            <>
              {index === 0 && <div className="block min-h-5 w-full" />}
              <motion.div
                layout
                className="flex w-full justify-center space-x-4"
                animate={{
                  scale:
                    step.active ||
                    (index === loadingMessages.length - 1 && step.completed)
                      ? 1
                      : 0.75,
                  opacity:
                    step.active ||
                    (index === loadingMessages.length - 1 && step.completed)
                      ? 1
                      : 0.3,
                }}
                transition={{ duration: 0.5 }}
                initial={{
                  scale: index === 0 ? 1 : 0.75,
                  opacity: index === 0 ? 1 : 0.3,
                }}
                ref={(el) => {
                  loadingTextRefs.current[index] = el;
                }}
              >
                <div className="flex h-full items-center">
                  {step.completed && <CheckIcon className="h-5 w-5" />}
                  {step.active && !step.error && (
                    <LoaderCircleIcon className="h-5 w-5 animate-spin" />
                  )}
                  {step.error && <XIcon className="h-5 w-5" />}
                  {!step.completed && !step.active && (
                    <ClockIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{step.text}</h4>
                </div>
              </motion.div>
              {index === loadingMessages.length - 1 && (
                <div className="block min-h-5 w-full" />
              )}
            </>
          ))}
        </div>
      </div>
      {failedLoadingMessage?.error && (
        <motion.span
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground max-w-96 text-center text-sm"
        >
          {failedLoadingMessage.friendlyError}
        </motion.span>
      )}
      {failedLoadingMessage?.error && (
        <ButtonAnimated
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={handleTryAgain}
        >
          Try again
        </ButtonAnimated>
      )}
    </motion.div>
  );
}
