import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

let pineconeClient: Index<RecordMetadata> | null = null

export async function getPineconeClient(namespace: string) {
    if (pineconeClient) return pineconeClient

    const pineconeInstance = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string
    })

    const index = pineconeInstance.index(process.env.PINECONE_INDEX_NAME!)

    pineconeClient = await index.namespace(namespace)

    return pineconeClient
}