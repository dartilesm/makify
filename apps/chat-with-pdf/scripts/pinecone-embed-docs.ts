import { embedDocument, prepareDocument } from "@makify/chat-with-pdf/utils/embed-document";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { getPineconeClient } from "@makify/chat-with-pdf/utils/pinecode.client";

async function embedDocs() {
/*     try {
        const pineconeClient = await getPineconeClient() 

        console.log("Preparing chunks from PDF file")

        const docs = await getChunkedDocsFromPDF("apps/chat-with-pdf/phrasal-verbs.pdf")

        // const embedding = await getEmbeddings(docs[0]?.pageContent)
        // console.log(embedding)
        console.log(`Loading ${docs.length} chunks into Pinecone`)

        await embedAndStoreDocs(pineconeClient, docs)
        
        console.log("Data embedded and stored in Pinecone index")
    } catch (error) {
        console.error("Init client script failed: ", error)
    } */
    // Load the PDF
    console.log('Loading PDF')
    const loader = new PDFLoader('apps/chat-with-pdf/genesis-cv.pdf');
    const pages = await loader.load();

    // Split it into chunks
    console.log('Splitting documents')
    const documents = await Promise.all(pages.map(prepareDocument))

    // Vectorize the documents
    console.log('Embedding documents')
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // Store the vectors in Pinecone
    console.log('Storing vectors in Pinecone')
    console.log(vectors.map(v => v?.metadata?.text))
    const pineconeClient = await getPineconeClient()
    await pineconeClient.upsert(vectors)
}

embedDocs()