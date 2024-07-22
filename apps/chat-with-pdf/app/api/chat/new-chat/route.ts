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

  try {
    const stream = new ReadableStream({
      async start(controller) {
        for await (const message of createNewChatMocked({
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
    // Fetching PDF data and creating a new chat in the database
    yield* getLoadingMessages(!!documentUrl, null);
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
    if (!documentUrl) {
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(`${chat.id}.pdf`, documentFile!);

      documentUrl = getPdfUrlFromSupabaseStorage(data!);

      await prisma.chat.update({
        where: { id: chat.id },
        data: { documentUrl },
      });
    }

    // Load the PDF
    yield* getLoadingMessages(!!documentUrl, null);
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const loader = new WebPDFLoader(pdfData?.pdfBlob as Blob);
    const pages = await loader.load();

    // Split it into chunks
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    );

    // Vectorize the documents
    yield* getLoadingMessages(!!documentUrl, null);
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // Store the vectors in Pinecone
    yield* getLoadingMessages(!!documentUrl, null);
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 10));
    await chunkedUpsert(vectors, chat.id);

    // Set as completed the last message
    yield* getLoadingMessages(!!documentUrl, chat.id);
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 0));
  } catch (error) {
    console.log(error);
    resetLoadingMessages();
  }
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
  try {
    // Fetching PDF data and creating a new chat in the database
    yield* getLoadingMessages(
      !!documentUrl,
      "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
    );
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
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 1000));
    /* const loader = new WebPDFLoader(pdfData?.pdfBlob as Blob);
    const pages = await loader.load(); */

    // Split it into chunks
    yield* getLoadingMessages(
      !!documentUrl,
      "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
    );
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 1000));
    /* const documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    ); */

    // Vectorize the documents
    yield* getLoadingMessages(
      !!documentUrl,
      "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
    );
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 1000));
    /* const vectors = await Promise.all(documents.flat().map(embedDocument)); */

    // Store the vectors in Pinecone
    yield* getLoadingMessages(
      !!documentUrl,
      "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
    );
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    await new Promise((resolve) => setTimeout(resolve, 2100));
    /* await chunkedUpsert(vectors, chat.id); */

    // Set as completed the last message
    yield* getLoadingMessages(
      !!documentUrl,
      "f7cd3ecc-3e94-43a4-a19d-cffbd35779a0",
    );
    // TODO: How to remove this delay?
    // It doesn't work well without it, the data seems to arrive appended to the fronted
    /* await new Promise((resolve) => setTimeout(resolve, 0)); */
  } catch (error) {
    console.log(error);
  }
}
