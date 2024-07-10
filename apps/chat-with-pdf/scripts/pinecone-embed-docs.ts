import { getPineconeClient } from "@makify/chat-with-pdf/lib//pinecode.client";
import { embedAndStoreDocs, getEmbeddings } from "@makify/chat-with-pdf/lib//vector-store";
import { getChunkedDocsFromPDF } from "@makify/chat-with-pdf/lib/pdf-loader";

async function embedDocs() {
    try {
        const pineconeClient = getPineconeClient() 
        const pineconeIndexClient = pineconeClient.index("makify-chat-with-pdf").namespace('phrasal-verbs')

        console.log("Preparing chunks from PDF file")

        const docs = await getChunkedDocsFromPDF("apps/chat-with-pdf/phrasal-verbs.pdf")

        // const embedding = await getEmbeddings(docs[0]?.pageContent)
        // console.log(embedding)
        console.log(`Loading ${docs.length} chunks into Pinecone`)

        await embedAndStoreDocs(pineconeIndexClient, docs)
        
        console.log("Data embedded and stored in Pinecone index")
    } catch (error) {
        console.error("Init client script failed: ", error)
    }
}

embedDocs()