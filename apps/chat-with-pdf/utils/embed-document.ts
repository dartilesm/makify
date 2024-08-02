import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { md5 } from "js-md5";
import { truncateStringByBytes } from "./truncate-string";
import { getEmbeddings } from "./vector-store";

export async function prepareDocument(
  page: Document<Record<string, any>>,
  chatId: string,
): Promise<Document<Record<string, any>>[]> {
  // Get the content of the page
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  // Define the document splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 1,
  });

  // Split the documents using the provided splitter
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        chatId,
        documentName: metadata.loc.title,
        pageNumer: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}

export async function embedDocument(doc: Document<Record<string, any>>) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        chatId: doc.metadata.chatId,
        documentName: doc.metadata.documentName,
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {}
}
