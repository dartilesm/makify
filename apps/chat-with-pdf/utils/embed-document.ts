import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { truncateStringByBytes } from "./truncate-string";
import { getEmbeddings } from "./vector-store";
import { md5 } from 'js-md5';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";


export async function prepareDocument(page) {
    // Get the content of the page
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");

    // Define the document splitter
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 50,
        chunkOverlap: 1,
    })

    // Split the documents using the provided splitter
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumer: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])

    return docs
}

export async function embedDocument(doc: Document<Record<string, any>>) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)


        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        }
    } catch (error) {
        
    }
}