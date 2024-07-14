import { google } from "@ai-sdk/google";
import { type CoreMessage, StreamingTextResponse, streamText } from "ai";
import { getContext } from "utils/context";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages = [], documentId, isInitialMessage = false } = await req.json();
  const documentContext =
  (await getContext(messages.at(-1).content, documentId)) || "";
  
  const messagesToAI = [
    ...(isInitialMessage
      ? [messages.at(0)]
      : messages.filter((message) => message?.role === "user")),
    ]
    console.log({messages, documentId, isInitialMessage, messagesToAI})

  const result = await streamText({
    model: google("models/gemini-pro"),
    messages: messagesToAI,
    system: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      START DOCUMENT BLOCK
      ${documentContext}
      END OF DOCUMENT BLOCK
      AI assistant will take into account any DOCUMENT BLOCK that is provided in a conversation.
      If the document does not provide the answer to question, the AI assistant will respond with a kind message along the lines of "The document does not provide the answer to that question."
      AI must not answer questions that are not based on the document.
      AI assistant will not invent anything that is not drawn directly from the document.
    `
  });

  // return result.toAIStreamResponse();
  return new StreamingTextResponse(result.toAIStream())
}
