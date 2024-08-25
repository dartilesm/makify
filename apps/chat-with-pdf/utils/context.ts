import { getPineconeClient } from "./pinecone.client";
import { getEmbeddings } from "./vector-store";

async function getMatchesFromEmbeddings(
  embeddings: number[],
  documentId: string,
) {
  const pineconeClient = await getPineconeClient(documentId);

  try {
    const queryResult = await pineconeClient.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, documentId: string) {
  // User query embeddings
  const userQueryEmbeddings = await getEmbeddings(query);

  // Get matches from Pinecone
  const matches = await getMatchesFromEmbeddings(
    userQueryEmbeddings,
    documentId,
  );

  const qualifiedMatches = matches.filter((match) => match?.score ?? 0 > 0.7);

  const textContent = qualifiedMatches.reduce((acc, match) => {
    const { metadata } = match;
    const pageNumber = metadata?.pageNumber;
    const text = metadata?.text;
    // Return the accumulator in this format:
    // START PAGE 1 BLOCK
    // Text extracted from page 1

    if (!acc.includes(`START PAGE ${pageNumber} BLOCK`)) {
      acc += `START PAGE ${pageNumber} BLOCK\n`;
    }
    acc += `${text}\n`;

    return acc;
  }, "");

  const docs = qualifiedMatches.map((match) => match.metadata?.text);
  const pageNumbers = qualifiedMatches
    .map((match) => match.metadata?.pageNumber)
    .filter((pageNumber, index, self) => self.indexOf(pageNumber) === index);

  const context = {
    text: docs.join("\n").substring(0, 3000),
    pageNumbers,
  };

  // Limit the block text to 3000 characters

  return textContent.substring(0, 3000);
}
