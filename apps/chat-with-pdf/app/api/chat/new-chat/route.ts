import { INPUT_NAME } from "@/components/header/document-switcher/constants/input-names";
import { chunkedUpsert } from "@/lib/chunked-upsert";
import { embedDocument, prepareDocument } from "@/lib/embed-document";
import {
  getLoadingMessages,
  resetLoadingMessages,
} from "@/lib/get-loading-messages";
import { getPdfData } from "@/lib/get-pdf-metadata";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const documentUrl = formData.get(INPUT_NAME.LINK) as string;
  const documentFile = formData.get(INPUT_NAME.FILE) as File;

  const stream = new ReadableStream({
    async start(controller) {
      /* for await (const loadingMessages of createNewChatMocked({
        documentUrl,
        documentFile,
      })) {
        const messageArrayToString = JSON.stringify(loadingMessages);
        const encodedMessages = new TextEncoder().encode(messageArrayToString);
        controller.enqueue(encodedMessages);
      } */

      const loadingMessagesGenerator = createNewChat({
        documentUrl,
        documentFile,
      });
      async function retrieveLoadingMessages() {
        const { value: loadingMessages, done } =
          await loadingMessagesGenerator.next();

        const loadingMessagesToString = JSON.stringify(loadingMessages);
        const encodedLoadingMessages = new TextEncoder().encode(
          loadingMessagesToString,
        );
        controller.enqueue(encodedLoadingMessages);

        if (!done) return retrieveLoadingMessages();
      }
      await retrieveLoadingMessages();
      controller.close();
    },
  });
  return new NextResponse(stream);
}

async function* createNewChat({
  documentUrl,
  documentFile,
}: {
  documentUrl: string;
  documentFile?: File;
}) {
  // Fetching PDF data and creating a new chat in the database
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: null,
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let chat;
  try {
    const pdfData = await getPdfData({ documentUrl, documentFile });
    chat = await prisma.chat.create({
      data: {
        documentUrl: documentUrl,
        documentMetadata: pdfData?.metadata,
      },
    });
  } catch (error) {
    console.error(error);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: null,
      errorMessage: error?.message || error,
    });
  }

  if (!documentUrl) {
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${chat.id}.pdf`, documentFile!);
    if (error) {
      console.error(error);
      return getLoadingMessages({
        isViaLink: !!documentUrl,
        chatId: chat.id,
        errorMessage: error?.message,
      });
    }
    try {
      documentUrl = getPdfUrlFromSupabaseStorage(data!);

      await prisma.chat.update({
        where: { id: chat.id },
        data: { documentUrl },
      });
    } catch (error) {
      console.error(error);
      return getLoadingMessages({
        isViaLink: !!documentUrl,
        chatId: chat.id,
        errorMessage: error?.message || error,
      });
    }
  }

  // Load the PDF
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: chat.id,
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 10));
  let pages;
  try {
    const loader = new WebPDFLoader(pdfData?.pdfBlob as Blob);
    pages = await loader.load();
  } catch (error) {
    console.error(error);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: chat.id,
      errorMessage: error?.message || error,
    });
  }

  // Split it into chunks
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 10));
  let documents;
  try {
    documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    );
  } catch (error) {
    console.error(error);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: chat.id,
      errorMessage: error?.message || error,
    });
  }

  // Vectorize the documents
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: chat.id,
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 10));
  let vectors;
  try {
    vectors = await Promise.all(documents.flat().map(embedDocument));
  } catch (error) {
    console.error(error);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: chat.id,
      errorMessage: error?.message || error,
    });
  }

  // Store the vectors in Pinecone
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: chat.id,
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 10));
  try {
    await chunkedUpsert(vectors, chat.id);
  } catch (error) {
    console.error(error);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: chat.id,
      errorMessage: error?.message || error,
    });
  }

  // Set as completed the last message
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: chat.id,
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function getPdfUrlFromSupabaseStorage({ fullPath }: { fullPath: string }) {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${fullPath}`;
}

async function* createNewChatMocked({
  documentUrl,
  documentFile,
}: {
  documentUrl: string;
  documentFile?: File;
}) {
  // Fetching PDF data and creating a new chat in the database
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  try {
    await new Promise((resolve, reject) =>
      setTimeout(() => reject("weird error oh my god"), 1000),
    );
  } catch (error) {
    console.log("We got an error:");
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
      errorMessage: error?.message || error,
    });
  }
  /* const pdfData = await getPdfData({ link: documentUrl });
    const chat = await prisma.chat.create({
      data: {
        documentUrl: documentUrl,
        documentMetadata: pdfData?.metadata,
      },
    }); */
  // Load the PDF
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 1000));
  /* const loader = new WebPDFLoader(pdfData?.pdfBlob as Blob);
    const pages = await loader.load(); */

  // Split it into chunks
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 1000));
  /* const documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    ); */

  // Vectorize the documents
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 1000));
  /* const vectors = await Promise.all(documents.flat().map(embedDocument)); */

  // Store the vectors in Pinecone
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 2100));
  /* await chunkedUpsert(vectors, chat.id); */

  // Set as completed the last message
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  /* await new Promise((resolve) => setTimeout(resolve, 0)); */
}
