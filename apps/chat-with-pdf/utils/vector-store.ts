/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function getEmbeddings(value: string) {
  try {
    // Embed the text using the Google Generative AI API
    const googleGenerativeAIEmbeddings = new GoogleGenerativeAIEmbeddings({
      model: "embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const embedding = await googleGenerativeAIEmbeddings.embedQuery(value);

    return embedding;
  } catch (error) {
    console.log("Error in getEmbeddings", error);
    throw new Error(`Error in getEmbeddings: ${error}`);
  }
}
