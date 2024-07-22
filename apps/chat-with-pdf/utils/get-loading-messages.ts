export const loadingPdfLinkMessages = [
  {
    text: "Fetching PDF data",
    active: true,
    completed: false,
    chatId: "",
  },
  {
    text: "Processing your document",
    active: false,
    completed: false,
    chatId: "",
  },
  {
    text: "Learning from your document",
    active: false,
    completed: false,
    chatId: "",
  },
  {
    text: "Storing knowledge in the cloud",
    active: false,
    completed: false,
    chatId: "",
  },
  {
    text: null,
    active: null,
    completed: null,
    chatId: "",
  },
];

export const loadingPdfFileMessages = [
  {
    text: "Uploading PDF and fetching data",
    active: true,
    completed: false,
    chatId: "",
  },
  {
    text: "Processing your document",
    active: false,
    completed: false,
    chatId: "",
  },
  {
    text: "Learning from your document",
    active: false,
    completed: false,
    chatId: "",
  },
  {
    text: "Storing knowledge in the cloud",
    active: false,
    completed: false,
    chatId: "",
  },
  {
    text: null,
    active: null,
    completed: null,
    chatId: "",
  },
];

let currentActiveIndex = 0;
let loadingMessagesCopy = [] as
  | typeof loadingPdfFileMessages
  | typeof loadingPdfLinkMessages;

export function resetLoadingMessages() {
  currentActiveIndex = 0;
  loadingMessagesCopy = [];
}

export function* getLoadingMessages(isViaLink: boolean, chatId: string | null) {
  if (currentActiveIndex === 0) {
    const loadingMessagesStringified = JSON.stringify(
      isViaLink ? loadingPdfLinkMessages : loadingPdfFileMessages,
    );
    loadingMessagesCopy = JSON.parse(loadingMessagesStringified);
  }

  console.log(currentActiveIndex);
  if (loadingMessagesCopy?.length === 0) return [];

  if (currentActiveIndex > 0) {
    loadingMessagesCopy[currentActiveIndex - 1]!.active = false;
    loadingMessagesCopy[currentActiveIndex - 1]!.completed = true;
  }

  if (currentActiveIndex === loadingMessagesCopy.length - 1) {
    const loadingMessagesCopyStringified = JSON.stringify(loadingMessagesCopy);
    const loadingMessagesNewCopy = JSON.parse(loadingMessagesCopyStringified);
    loadingMessagesNewCopy[currentActiveIndex]!.chatId = chatId;
    resetLoadingMessages();
    yield loadingMessagesNewCopy;
  }

  loadingMessagesCopy[currentActiveIndex]!.active = true;
  currentActiveIndex = currentActiveIndex + 1;
  yield loadingMessagesCopy;
}
