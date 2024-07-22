import { INPUT_NAME } from "@/components/header/document-switcher/constants/input-names";
import { loadingPdfLinkMessages } from "@/components/header/document-switcher/constants/loading-messages";
import { chunkedUpsert } from "@/lib/chunked-upsert";
import { embedDocument, prepareDocument } from "@/lib/embed-document";
import { getPdfData } from "@/lib/get-pdf-metadata";
import { prisma } from "@/lib/prisma";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const documentUrl = formData.get(INPUT_NAME.LINK) as string;
  const documentFile = formData.get(INPUT_NAME.FILE) as File;

  try {
    const stream = new ReadableStream({
      async start(controller) {
        for await (const message of createNewChat({
          documentUrl,
          documentFile,
        })) {
          const messageArrayToString = JSON.stringify(message);
          const encodedMessages = new TextEncoder().encode(
            messageArrayToString,
          );
          controller.enqueue(encodedMessages);
        }
        controller.close();
      },
    });
    return new NextResponse(stream);
  } catch (error) {
    console.log(error);
  }
}

async function* createNewChat({
  documentUrl,
  documentFile,
}: {
  documentUrl: string;
  documentFile?: File;
}) {
  try {
    const loadingMessagesAsString = JSON.stringify(loadingPdfLinkMessages);
    const loadingMessages = JSON.parse(loadingMessagesAsString);

    // Fetching PDF data and creating a new chat in the database
    loadingMessages[0]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const pdfData = await getPdfData({ documentUrl, documentFile });
    const chat = await prisma.chat.create({
      data: {
        documentUrl: documentUrl,
        documentMetadata: pdfData?.metadata,
      },
    });

    // Load the PDF
    loadingMessages[0]!.completed = true;
    loadingMessages[0]!.active = false;
    loadingMessages[1]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const loader = new WebPDFLoader(pdfData?.pdfBlob as Blob);
    const pages = await loader.load();

    // Split it into chunks
    loadingMessages[1]!.completed = true;
    loadingMessages[1]!.active = false;
    loadingMessages[2]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    );

    // Vectorize the documents
    loadingMessages[2]!.completed = true;
    loadingMessages[2]!.active = false;
    loadingMessages[3]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // Store the vectors in Pinecone
    loadingMessages[3]!.completed = true;
    loadingMessages[3]!.active = false;
    loadingMessages[4]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    await chunkedUpsert(vectors, chat.id);

    // Set as completed the last message
    loadingMessages[4]!.completed = true;
    loadingMessages[4]!.active = false;
    loadingMessages[5]!.chatId = chat.id;
    /* loadingMessages[5]!.chatId = "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0"; */
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 0));
  } catch (error) {
    console.log(error);
  }
}

async function* createNewChatFromLinkMocked(documentUrl: string) {
  try {
    const loadingMessagesAsString = JSON.stringify(loadingPdfLinkMessages);
    const loadingMessages = JSON.parse(loadingMessagesAsString);

    // Fetching PDF data and creating a new chat in the database
    loadingMessages[0]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    /* const pdfData = await getPdfData({ link: documentUrl });
    const chat = await prisma.chat.create({
      data: {
        documentUrl: documentUrl,
        documentMetadata: pdfData?.metadata,
      },
    }); */

    // Load the PDF
    loadingMessages[0]!.completed = true;
    loadingMessages[0]!.active = false;
    loadingMessages[1]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    /* const loader = new WebPDFLoader(pdfData?.pdfBlob as Blob);
    const pages = await loader.load(); */

    // Split it into chunks
    loadingMessages[1]!.completed = true;
    loadingMessages[1]!.active = false;
    loadingMessages[2]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    /* const documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    ); */

    // Vectorize the documents
    loadingMessages[2]!.completed = true;
    loadingMessages[2]!.active = false;
    loadingMessages[3]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    /* const vectors = await Promise.all(documents.flat().map(embedDocument)); */

    // Store the vectors in Pinecone
    loadingMessages[3]!.completed = true;
    loadingMessages[3]!.active = false;
    loadingMessages[4]!.active = true;
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    /* await chunkedUpsert(vectors, chat.id); */

    // Set as completed the last message
    loadingMessages[4]!.completed = true;
    loadingMessages[4]!.active = false;
    /* loadingMessages[5]!.chatId = chat.id; */
    loadingMessages[5]!.chatId = "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0";
    yield loadingMessages;
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    /* await new Promise((resolve) => setTimeout(resolve, 0)); */
  } catch (error) {
    console.log(error);
  }
}
