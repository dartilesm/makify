import { rateLimitRequests } from "@/lib/rate-limit-requests";
import { google } from "@ai-sdk/google";
import { Message, StreamData, convertToCoreMessages, streamText } from "ai";
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

  console.log({ lastMessage });

  const userMessage = parsedUserMessage(
    lastMessage,
    (lastMessage.data as Record<string, unknown>)?.quotedText as string,
  );

  const documentContext = lastMessage
    ? await getContext(userMessage, documentId)
    : { page1: "" };

  messages[messages.length - 1]!.content = userMessage;

  console.log({ convertToCoreMessages: convertToCoreMessages(messages) });

  const systemInstructions = `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    START DOCUMENT BLOCK
    ${documentContext}
    END OF DOCUMENT BLOCK
    AI assistant will take into account any DOCUMENT BLOCK that is provided in a conversation.
    When referencing information from the document, AI will use the following format:
    1. Apply underline styling to the specific information from a page using HTML <u> tags with a data-page attribute containing the page number.
    2. Immediately after the closing </u> tag, add the page reference as a superscript with the format <sup data-page="{page number}">{page number}</sup>.
    3. If information spans multiple pages or comes from different pages, use separate underline tags and superscript references for each.
    Example: "The document states that <u data-page="3">English is considered a relatively easy language to learn</u><sup data-page="3">3</sup>. However, it also mentions that <u data-page="5">Mandarin Chinese is often regarded as one of the most challenging languages for English speakers</u><sup data-page="5">5</sup>."
    AI assistant can format the response using either Markdown or HTML, but should not mix the two formats within the same response. For example:
    Correct (HTML): "<p>This is a paragraph.</p><ul><li>List item</li></ul>"
    Correct (Markdown): "This is a paragraph.\n\n- List item"
    Incorrect (Mixed): "<p>This is a **bold** paragraph.</p>"
    If the document does not provide the answer to a question, AI will try to answer based on the document's context without inventing information.
    AI assistant will not invent anything that is not drawn directly from the document.`;

  const data = new StreamData();
  data.append(messageData);

  const result = await streamText({
    model: google("models/gemini-1.5-pro-latest"),
    messages: convertToCoreMessages(messages),
    system: systemInstructions,
    maxTokens: 3000,
    onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      console.log({
        onFinish: {
          text,
          toolCalls,
          toolResults,
          usage,
          finishReason,
        },
      });
      data.close();
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse({ data, headers });
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
