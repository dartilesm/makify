import {
  loadingPdfFileMessages,
  loadingPdfLinkMessages,
} from "@/components/header/document-switcher/constants/loading-messages";

let currentActiveIndex = -1;
let loadingMessagesCopy = [] as
  | typeof loadingPdfFileMessages
  | typeof loadingPdfLinkMessages;

export function resetLoadingMessages() {
  currentActiveIndex = -1;
  loadingMessagesCopy = [];
}

type GetLoadingMessagesProps = {
  isViaLink: boolean;
  chatId: string | null;
  errorMessage?: string;
  friendlyError?: string;
};

export function getLoadingMessages({
  isViaLink,
  chatId,
  errorMessage,
  friendlyError = "",
}: GetLoadingMessagesProps) {
  if (errorMessage || friendlyError) {
    const isLoadingMessagesCopyEmpty = loadingMessagesCopy.length === 0;
    const loadingMessagesToClone = isLoadingMessagesCopyEmpty
      ? isViaLink
        ? loadingPdfLinkMessages
        : loadingPdfFileMessages
      : loadingMessagesCopy;
    const loadingMessagesNewCopy = structuredClone(loadingMessagesToClone);
    loadingMessagesNewCopy[currentActiveIndex]!.error =
      errorMessage || friendlyError;
    loadingMessagesNewCopy[currentActiveIndex]!.friendlyError = friendlyError;
    resetLoadingMessages();
    return loadingMessagesNewCopy;
  }

  currentActiveIndex = currentActiveIndex + 1;

  if (currentActiveIndex === 0) {
    loadingMessagesCopy = structuredClone(
      isViaLink ? loadingPdfLinkMessages : loadingPdfFileMessages,
    );
  }

  if (loadingMessagesCopy?.length === 0) return [];

  if (currentActiveIndex > 0) {
    loadingMessagesCopy[currentActiveIndex - 1]!.active = false;
    loadingMessagesCopy[currentActiveIndex - 1]!.completed = true;
  }

  if (currentActiveIndex === loadingMessagesCopy.length - 1) {
    const loadingMessagesNewCopy = structuredClone(loadingMessagesCopy);
    loadingMessagesNewCopy[currentActiveIndex]!.chatId = chatId as string;
    resetLoadingMessages();
    return loadingMessagesNewCopy;
  }

  loadingMessagesCopy[currentActiveIndex]!.active = true;
  return loadingMessagesCopy;
}
