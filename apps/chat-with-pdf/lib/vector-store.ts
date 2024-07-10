/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { openai } from "@ai-sdk/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Index } from "@pinecone-database/pinecone";
import { embed } from "ai";
import { TaskType } from "@google/generative-ai";

// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io



export async function embedAndStoreDocs(pineconeIndex: Index, docs: any) {
    // const embeddings = new OpenAIEmbeddings()
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: 'embedding-001',
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: 'Document title',
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      });
}

export async function getEmbeddings(value: string) {
    try {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value
      })

      return embedding
    } catch (error) {
        console.error(error)
    }
}