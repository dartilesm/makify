import { getPineconeClient } from "./pinecode.client";
import { getEmbeddings } from "./vector-store";

export async function getMatchesFromEmbeddings(embeddings: number[]) {
  const pineconeClient = await getPineconeClient();

  try {
    const queryResult = await pineconeClient.query({
        topK: 5,
        vector: embeddings,
        includeValues: true
    })

    return queryResult.matches || []
  } catch (error) {
    console.log('Error querying Pinecone:', error)
    throw error
  }
}

export async function getContext(query: string) {
    // User query embeddings
    const userQueryEmbeddings = await getEmbeddings(query)

    // Get matches from Pinecone
    const matches = await getMatchesFromEmbeddings(userQueryEmbeddings)

    const qualifiedMatches = matches.filter((match) => match.score > 0.7)

    const docs = qualifiedMatches.map((match) => match.metadata?.text)

    return docs.join('\n').substring(0, 3000)

}