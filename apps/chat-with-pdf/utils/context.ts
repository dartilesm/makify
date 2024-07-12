import { getPineconeClient } from "./pinecone.client";
import { getEmbeddings } from "./vector-store";

export async function getMatchesFromEmbeddings(embeddings: number[], documentId: string) {
  const pineconeClient = await getPineconeClient(documentId);

  try {
    const queryResult = await pineconeClient.query({
        topK: 5,
        vector: embeddings,
        includeMetadata: true
    })

    return queryResult.matches || []
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error
  }
}

export async function getContext(query: string, documentId: string) {
    // User query embeddings
    const userQueryEmbeddings = await getEmbeddings(query)

    // Get matches from Pinecone
    const matches = await getMatchesFromEmbeddings(userQueryEmbeddings, documentId)

    const qualifiedMatches = matches.filter((match) => match.score > 0.7)

    const docs = qualifiedMatches.map((match) => match.metadata?.text)

    return docs.join('\n').substring(0, 3000)

}