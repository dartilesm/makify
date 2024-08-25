import { supabase } from "./supabase";
import { getEmbeddings } from "./vector-store";

export async function getContext(query: string, documentId: string) {
  // User query embeddings
  const userQueryEmbeddings = await getEmbeddings(query);

  const { data: documentSections, error } = await supabase.rpc(
    "match_documents",
    {
      query_embedding: userQueryEmbeddings,
      match_threshold: 0.7,
      match_count: 200,
      document_id: documentId,
    },
  );

  const supabaseTextContent = documentSections.reduce((acc, match) => {
    const { pageNumber, textChunk } = match;
    // Return the accumulator in this format:
    // START PAGE 1 BLOCK
    // Text extracted from page 1

    if (!acc.includes(`START PAGE ${pageNumber} BLOCK`)) {
      acc += `START PAGE ${pageNumber} BLOCK\n`;
    }
    acc += `${textChunk}\n`;

    return acc;
  }, "");

  const textContentNormalized = supabaseTextContent.replace(/\n/g, " ");
  console.log(textContentNormalized);

  // Limit the block text to 3000 characters

  return textContentNormalized.substring(0, 3000);
}
