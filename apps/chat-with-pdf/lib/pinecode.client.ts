import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

let pineconeClient: Index<RecordMetadata> | null = null

export async function getPineconeClient() {
    if (pineconeClient) return pineconeClient

    const pineconeInstance = new Pinecone({
        apiKey: process.env.PINECODE_API_KEY as string
    })

    const index = pineconeInstance.index(process.env.PINECODE_INDEX_NAME!)

    pineconeClient = await index.namespace('pdf-1')

    return pineconeClient
}