import { rateLimitRequests } from "@/lib/rate-limit-requests";
import { google } from "@ai-sdk/google";
import { CoreMessage, Message, StreamData, streamText } from "ai";
import { Tables } from "database.types";
import { getContext } from "utils/context";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type RequestBody = {
  messages: Message[];
  documentId: Tables<"Chat">["id"];
  data: {
    [key: string]: any;
  };
};

export async function POST(req: Request) {
  // Protect the route with rate limiting
  const { success, headers } = await rateLimitRequests(req);

  if (!success) {
    return new Response("Rate limit exceeded", {
      status: 429,
      headers,
    });
  }

  const {
    messages = [],
    documentId,
    data: messageData = {},
  } = (await req.json()) as RequestBody;
  const lastMessage = messages.at(-1) as Message;
  const userMessage = parsedUserMessage(
    lastMessage,
    (lastMessage.data as Record<string, unknown>)?.quotedText as string,
  );

  const documentContext = lastMessage
    ? await getContext(userMessage, documentId)
    : { page1: "" };

  const userMessages = messages.filter((message) => message?.role === "user");

  userMessages[userMessages.length - 1]!.content = userMessage;
  console.log(documentContext);
  const messagesToAI = [...userMessages];

  const systemInstructions = `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    START DOCUMENT BLOCK
    ${documentContext}
    END OF DOCUMENT BLOCK
    AI assistant will take into account any DOCUMENT BLOCK that is provided in a conversation.
    The DOCUMENT BLOCK includes a START PAGE {page number} BLOCK, AI will use the {page number} in the response to inform the user where the information was found, the page number should have this format :page[{page number}].
    If the document does not provide the answer to question, will try to answer the question based on the document.
    AI assistant will not invent anything that is not drawn directly from the document.`;

  const data = new StreamData();
  data.append(messageData);

  const result = await streamText({
    model: google("models/gemini-1.5-pro-latest"),
    messages: messagesToAI as CoreMessage[],
    system: systemInstructions,
    maxTokens: 3000,
    onFinish({
      text,
      toolCalls,
      toolResults,
      usage,
      finishReason,
      rawResponse,
    }) {
      console.log({
        onFinish: {
          text,
          toolCalls,
          toolResults,
          usage,
          finishReason,
          rawResponse,
        },
      });
      data.close();
    },
  });

  return result.toAIStreamResponse({ data: data, headers });
}

function parsedUserMessage(lastMessage: Message, quotedText: string) {
  if (quotedText) {
    return `Given this text extracted from the document: 
      "${quotedText}" 
    Answer this:
    ${lastMessage.content}`;
  }
  return lastMessage.content;
}
