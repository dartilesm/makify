import type { Index, PineconeRecord } from '@pinecone-database/pinecone';
import { getPineconeClient } from './pinecone.client';

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
};

export async function chunkedUpsert(
    vectors: Array<PineconeRecord>,
    namespace: string,
    chunkSize = 10
) {
  // Split the vectors into chunks
  const chunks = sliceIntoChunks<PineconeRecord>(vectors, chunkSize);

  try {
    // Upsert each chunk of vectors into the index
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        try {
          const pineconeClient = await getPineconeClient(namespace);
          await pineconeClient.upsert(chunk);
        } catch (e) {
          console.log('Error upserting chunk', e);
        }
      })
    );

    return true;
  } catch (e) {
    throw new Error(`Error upserting vectors into index: ${e}`);
  }
};