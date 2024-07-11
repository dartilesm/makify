import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "pdf-parse";

export async function getChunkedDocsFromPDF(pdfPath: string) {
  try {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
  
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 50,
      chunkOverlap: 1,
    });
  
    const chunkedDocs = splitter.splitDocuments(docs)
    return chunkedDocs;
  } catch (error) {
    console.error("Error loading PDF: ", error)
  }
}