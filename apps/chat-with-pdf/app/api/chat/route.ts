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

  const userMessage = parsedUserMessage(
    lastMessage,
    (lastMessage.data as Record<string, unknown>)?.quotedText as string,
  );

  const documentContext = lastMessage
    ? await getContext(userMessage, documentId)
    : { page1: "" };

  messages[messages.length - 1]!.content = userMessage;

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
    1. Apply underline styling to the AI's interpretation or paraphrase of the information using HTML <u> tags.
    2. Include two attributes in the <u> tag:
       - data-page: containing the page number where the information is found
       - data-based-text: containing the exact text from the DOCUMENT BLOCK that the AI used as a basis for its response
    3. The content inside the <u> tags can be the AI's own words, related to but not necessarily identical to the data-based-text.
    4. Immediately after the closing </u> tag, add the page reference as a superscript with the format <sup data-page="{page number}">{page number}</sup>.
    5. If information spans multiple pages or comes from different pages, use separate underline tags and superscript references for each.
    6. Always try to wrap entire paragraphs, sentences or meaningful phrases within the <u> tags.

    Example: "The document discusses language learning difficulty. <u data-page="3" data-based-text="English is widely considered one of the easiest languages to learn">It suggests that English is relatively simple for many learners to acquire</u><sup data-page="3">3</sup>. In contrast, <u data-page="5" data-based-text="Mandarin Chinese poses significant challenges for English speakers due to its tonal nature and complex writing system">Mandarin Chinese is described as particularly challenging for English speakers, largely due to its tonal aspects and intricate writing system</u><sup data-page="5">5</sup>."

    AI assistant must ensure that the data-based-text attribute contains the exact text extracted from the DOCUMENT BLOCK, while the content inside the <u> tags can be the AI's interpretation or paraphrase of that information.
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
