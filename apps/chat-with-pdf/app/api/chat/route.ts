import { google } from "@ai-sdk/google";
import { Chat } from "@prisma/client";
import { CoreMessage, Message, StreamData, streamText } from "ai";
import { getContext } from "utils/context";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type RequestBody = {
  messages: Message[];
  documentId: Chat["id"];
};

export async function POST(req: Request) {
  const { messages = [], documentId } = (await req.json()) as RequestBody;
  const lastMessage = messages.at(-1) as Message;

  const documentContext = lastMessage
    ? await getContext(lastMessage.content as string, documentId)
    : "";

  const messagesToAI = [
    ...messages.filter((message) => message?.role === "user"),
  ];

  const data = new StreamData();

  const result = await streamText({
    model: google("models/gemini-1.5-pro-latest"),
    messages: messagesToAI as CoreMessage[],
    system: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    START DOCUMENT BLOCK
    ${documentContext}
    END OF DOCUMENT BLOCK
    AI assistant will take into account any DOCUMENT BLOCK that is provided in a conversation.
    If the document does not provide the answer to question, will try to answer the question based on the document.
    AI assistant will not invent anything that is not drawn directly from the document.`,
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

  return result.toAIStreamResponse({ data });
}
