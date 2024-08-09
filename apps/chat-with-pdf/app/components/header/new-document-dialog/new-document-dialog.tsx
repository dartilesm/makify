import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@makify/ui";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import {
  loadingPdfFileMessages,
  loadingPdfLinkMessages,
} from "../document-switcher/constants/loading-messages";
import { NewDocumentDialogContent } from "./new-document-dialog-content";
import { NewDocumentLoadingState } from "./new-document-loading-state";

type NewDocumentDialogProps = {
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function NewDocumentDialog({
  isOpen,
  onOpenChange = () => null,
}: NewDocumentDialogProps) {
  const router = useRouter();
  const [loadingMessages, setLoadingMessages] = useState<
    typeof loadingPdfLinkMessages | typeof loadingPdfFileMessages
  >([]);

  const methods = useForm({ mode: "all" });

  function handleDialogToggle(isOpen: boolean) {
    onOpenChange(isOpen);
    if (!isOpen) {
      setLoadingMessages([]);
    }
  }

  async function formAction(formInputValues: FieldValues = {}) {
    const formData = new FormData();

    // Filter out empty values
    Object.keys(formInputValues)
      .filter((key) => formInputValues[key])
      .forEach((key) => {
        formData.set(key, formInputValues[key]);
      });

    const response = await fetch("/api/chat/new-chat", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    setLoadingMessages(loadingPdfLinkMessages);

    const reader = await response.body?.getReader();
    const decoder = new TextDecoder();

    async function read() {
      const { done, value } = await (reader?.read() as Promise<
        ReadableStreamReadResult<Uint8Array>
      >);

      const chunk = decoder.decode(value, { stream: true });
      const parsedLoadingMessages = JSON.parse(chunk);

      const filteredLoadingMessages = parsedLoadingMessages.filter(
        (message: { text: any }) => message.text,
      );
      setLoadingMessages(filteredLoadingMessages);

      const lastLoadingMessage = parsedLoadingMessages.at(-1);

      if (lastLoadingMessage.chatId) {
        handleDialogToggle(false);
        methods.reset();
        setTimeout(
          () => router.push(`/chat/${lastLoadingMessage.chatId}`),
          1000,
        );
      }

      if (done) {
        console.log("it is done", value);
        return null;
      }

      return read();
    }

    read();

    // Upload the new document
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogToggle}>
      <DialogContent className="flex max-h-[600px] min-h-[400px] flex-col">
        <DialogHeader>
          <DialogTitle>Start chatting with a new document</DialogTitle>
          <DialogDescription>
            Add a new document to chat with.
          </DialogDescription>
        </DialogHeader>
        {!loadingMessages.length && (
          <div className="flex flex-1 flex-col gap-4">
            <Alert className="border-yellow-500 text-yellow-600">
              <AlertTitle>Hackathon notice</AlertTitle>
              <AlertDescription>
                <span>
                  At the moment, this app only processes text in PDF files (we
                  are working on processing other types of content). As a
                  demonstration, here are some examples for you to try:
                </span>
                <ul className="list-inside list-disc truncate break-words">
                  <li>
                    <a
                      href="https://www.uh.edu/ussc/launch/services/handouts/Handouts/Tips-On-Studying-A-Foreign-Language.pdf"
                      className="text-blue-600 underline"
                      target="_blank"
                    >
                      Tips on studying a foreign language
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://theorganicmarketing.com/wp-content/uploads/2023/08/Twitter-has-been-replaced-by-X.pdf"
                      className="text-blue-600 underline"
                      target="_blank"
                    >
                      Twitter has been replaced by X
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.onetz.de/sites/default/files/flipbook/insert/3138327/bavarian_times_november2020_klein__S35.pdf"
                      className="text-blue-600 underline"
                      target="_blank"
                    >
                      Twelve strange christmas traditions from around the world
                    </a>
                  </li>
                </ul>
                <span className="italic">
                  Copy and paste the link in the input field on the{" "}
                  <strong>import from link.</strong>
                </span>
              </AlertDescription>
            </Alert>
            <FormProvider {...methods}>
              <form
                className="flex flex-1 flex-col justify-between gap-2"
                onSubmit={methods.handleSubmit(formAction)}
              >
                <NewDocumentDialogContent />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handleDialogToggle(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !methods.formState.isValid ||
                      methods.formState.isSubmitting
                    }
                    className="flex flex-row gap-2"
                  >
                    {methods.formState.isSubmitting && (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    )}
                    Import
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </div>
        )}
        {!!loadingMessages.length && (
          <div className="flex flex-1 flex-col justify-between gap-2">
            <NewDocumentLoadingState
              loadingMessages={loadingMessages}
              onTryAgain={() => setLoadingMessages([])}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
