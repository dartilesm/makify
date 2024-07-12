"use server";

import { chunkedUpsert } from "@/lib/chunked-upsert";
import { embedDocument, prepareDocument } from "@/lib/embed-document";
import { getPineconeClient } from "@/lib/pinecone.client";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { Chat, PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createNewChat(formData: FormData) {
  let chat: Chat;

  try {
    // Get the document url from the form data
    const documentUrl = formData.get("document-url") as string;

    // Create a new chat in the database
    console.log("Creating new chat in the database");
    chat = await prisma.chat.create({
      data: {
        documentUrl: documentUrl,
      },
    });

    // Load the PDF
    console.log("Loading PDF");
    const response = await fetch(documentUrl);
    const blob = await response.blob();
    const loader = new WebPDFLoader(blob);
    const pages = await loader.load();

    // Split it into chunks
    console.log("Splitting documents");
    const documents = await Promise.all(
      pages.map((page) => prepareDocument(page, chat.id)),
    );

    // Vectorize the documents
    console.log("Embedding documents");
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // Store the vectors in Pinecone
    console.log("Storing vectors in Pinecone");
    await chunkedUpsert(vectors, chat.id)
  } catch (error) {
    console.log("Error creating new chat: ", error);
    throw new Error(`Error creating new chat ${error}`);
  }

  redirect(`/chat/${chat.id}`);
}
