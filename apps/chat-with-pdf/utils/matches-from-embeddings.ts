import { getPineconeClient } from "./pinecode.client";


export async function getMatchesFromEmbeddings(
    embeddings: number[],
    topK: number
) {
    const pineconeClient = await getPineconeClient()

    try {
        const queryResult = await pineconeClient.query({
            vector: embeddings,
            topK,
            includeMetadata: true
        })

        return queryResult
    } catch (error) {
        console.log('Error in getMatchesFromEmbeddings', error)
        throw new Error(`Error in getMatchesFromEmbeddings: ${error}`)
    }
}