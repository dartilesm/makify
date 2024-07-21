import { INPUT_NAME } from "@/components/header/document-switcher/constants/input-names";
import { loadingPdfLinkMessages } from "@/components/header/document-switcher/constants/loading-messages";
import { chunkedUpsert } from "@/lib/chunked-upsert";
import { embedDocument, prepareDocument } from "@/lib/embed-document";
import { prisma } from "@/lib/prisma";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const pdfLink = formData.get(INPUT_NAME.LINK) as string;
  const pdfFile = formData.get(INPUT_NAME.FILE) as File;

  console.log({
    pdfLink,
    pdfFile,
  });

  if (pdfLink) {
    try {
      const stream = new ReadableStream({
        async start(controller) {
          for await (const message of createNewChatFromLink(pdfLink)) {
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
}

async function* createNewChatFromLink(documentUrl: string) {
  const loadingMessages = [...loadingPdfLinkMessages];

  // Create a new chat in the database
  loadingMessages[0]!.active = true;
  yield loadingMessages;
  const chat = await prisma.chat.create({
    data: {
      documentUrl: documentUrl,
    },
  });

  // Load the PDF
  loadingMessages[0]!.completed = true;
  loadingMessages[0]!.active = false;
  loadingMessages[1]!.active = true;
  yield loadingMessages;
  const response = await fetch(documentUrl);
  const blob = await response.blob();
  const loader = new WebPDFLoader(blob);
  const pages = await loader.load();

  // Split it into chunks
  loadingMessages[1]!.completed = true;
  loadingMessages[1]!.active = false;
  loadingMessages[2]!.active = true;
  yield loadingMessages;
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page, chat.id)),
  );

  // Vectorize the documents
  loadingMessages[2]!.completed = true;
  loadingMessages[2]!.active = false;
  loadingMessages[3]!.active = true;
  yield loadingMessages;
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // Store the vectors in Pinecone
  loadingMessages[3]!.completed = true;
  loadingMessages[3]!.active = false;
  loadingMessages[4]!.active = true;
  yield loadingMessages;
  await chunkedUpsert(vectors, chat.id);

  // Set as completed the last message
  loadingMessages[4]!.completed = true;
  loadingMessages[4]!.active = false;
  loadingMessages[5]!.chatId = chat.id;
  yield loadingMessages;
}
