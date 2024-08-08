import { Pinecone } from '@pinecone-database/pinecone';

export async function getPineconeClient(namespace: string) {
    const pineconeInstance = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string
    })

    const index = pineconeInstance.index(process.env.PINECONE_INDEX_NAME!)

    const pineconeClient = await index.namespace(namespace)

    return pineconeClient
}