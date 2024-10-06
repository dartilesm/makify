import { deleteChat } from "@/app/actions/delete-chat";
import { INPUT_NAME } from "@/components/header/document-switcher/constants/input-names";
import { embedDocument, prepareDocument } from "@/lib/embed-document";
import { getLoadingMessages } from "@/lib/get-loading-messages";
import { getPdfData } from "@/lib/get-pdf-metadata";
import { rateLimitRequests } from "@/lib/rate-limit-requests";
import { createClient } from "@/lib/supabase/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PineconeRecord } from "@pinecone-database/pinecone";
import { Tables } from "database.types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Protect the route with rate limiting
  const { success, headers } = await rateLimitRequests(request);

  if (!success) {
    return new Response("Rate limit exceeded", {
      status: 429,
      headers,
    });
  }

  let stream;

  try {
    const formData = await request.formData();

    const documentUrl = formData.get(INPUT_NAME.LINK) as string;
    const documentFile = formData.get(INPUT_NAME.FILE) as File;

    stream = new ReadableStream({
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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message }), {
      status: 500,
    });
  }

  revalidateTag("chats");

  return new NextResponse(stream, {
    headers,
  });
}

async function* createNewChat({
  documentUrl,
  documentFile,
}: {
  documentUrl: string;
  documentFile?: File;
}) {
  const supabase = createClient();
  // Fetching PDF data and creating a new chat in the database
  yield getLoadingMessages({
    isViaLink: !!documentUrl,
    chatId: null,
  });
  // TODO: How to remove this delay?
  // It doesn't work well without it, the data seems to arrive appended to the fronted
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const pdfData = await getPdfData({ documentUrl, documentFile });
  // Insert the chat in the database
  const { data: chat, error: chatError } = await supabase
    .from("Chat")
    .insert({
      documentUrl,
      documentMetadata: pdfData?.metadata,
    })
    .select("id")
    .single();

  if (chatError && !chat) {
    console.error(chatError);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: null,
      errorMessage: chatError?.message || chatError,
    });
  }

  // Insert the document in the database
  const { data: document, error: documentError } = await supabase
    .from("Document")
    .insert({
      url: documentUrl,
      metadata: pdfData?.metadata,
      chatId: chat?.id,
    })
    .select("id")
    .single();

  if (documentError) {
    console.error(documentError);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: null,
      errorMessage: documentError?.message || documentError,
    });
  }

  if (!documentUrl) {
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${chat.id}.pdf`, documentFile!);
    if (error) {
      console.error(error);
      await deleteChat(chat.id, false);
      return getLoadingMessages({
        isViaLink: !!documentUrl,
        chatId: chat.id,
        errorMessage: error?.message,
      });
    }

    documentUrl = getPdfUrlFromSupabaseStorage(data!);
    const { error: chatUpdateError } = await supabase
      .from("Chat")
      .update({
        documentUrl,
      })
      .eq("chatId", chat.id);
    /*       await prisma.chat.update({
        where: { id: chat.id },
        data: { documentUrl },
      }); */
    if (chatUpdateError) {
      await deleteChat(chat.id, false);
      return getLoadingMessages({
        isViaLink: !!documentUrl,
        chatId: chat.id,
        errorMessage: chatUpdateError?.message || chatUpdateError,
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
    if (pages.length > 5) {
      await deleteChat(chat.id, false);
      return getLoadingMessages({
        isViaLink: !!documentUrl,
        chatId: chat.id,
        errorMessage: "The document is too large. Please upload a smaller one",
        friendlyError:
          "The document is too large. Please upload a smaller one. The maximum number of pages is 5",
      });
    }
  } catch (error: any) {
    console.error(error);
    await deleteChat(chat.id, false);
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
  } catch (error: any) {
    console.error(error);
    await deleteChat(chat.id, false);
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
    vectors = (await Promise.all(
      documents.flat().map(embedDocument),
    )) as PineconeRecord[];
  } catch (error: any) {
    console.error(error);
    await deleteChat(chat.id, false);
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

  const vectorsToInsert = vectors.map((vector) => ({
    chatId: chat.id,
    embedding: vector.values,
    text: vector.metadata?.text ? vector.metadata.text : null,
    textChunk: vector.metadata?.textChunk ? vector.metadata.textChunk : null,
    pageNumber: vector.metadata?.pageNumber ? vector.metadata.pageNumber : null,
    documentId: document.id,
  }));

  const { error: documentSectionsError } = await supabase
    .from("DocumentSections")
    .insert(vectorsToInsert);
  if (documentSectionsError) {
    await deleteChat(chat.id, false);
    return getLoadingMessages({
      isViaLink: !!documentUrl,
      chatId: chat.id,
      errorMessage: documentSectionsError?.message || documentSectionsError,
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
  } catch (error: any) {
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
