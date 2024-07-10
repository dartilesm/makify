import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient: Pinecone | null = null

export function getPineconeClient() {
    if (pineconeClient) return pineconeClient

    pineconeClient = new Pinecone({
        apiKey: process.env.PINECODE_API_KEY as string
    })

    return pineconeClient
}