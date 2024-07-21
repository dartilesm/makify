import { motion } from "framer-motion";
import { CheckIcon, ClockIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { loadingPdfLinkMessages } from "./constants/loading-messages";
import { SparkleIcon } from "icons/sparkle";

const SparkleIconAnimated = motion(SparkleIcon);

type NewDocumentLoadingStateProps = {
  loadingMessages: typeof loadingPdfLinkMessages;
};

export function NewDocumentLoadingState({
  loadingMessages,
}: NewDocumentLoadingStateProps) {
  const loadingTextRefs = useRef<HTMLDivElement[] | null[]>([]);

  useEffect(() => {
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
  }, [loadingMessages]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="relative h-16 w-16">
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
      </div>
      <div className="relative">
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b to-transparent" />
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t to-transparent" />
        <motion.div
          className="flex h-20 flex-col gap-[6px] overflow-hidden"
          layoutScroll
        >
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
                <div>
                  {step.completed ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
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
        </motion.div>
      </div>
    </div>
  );
}
