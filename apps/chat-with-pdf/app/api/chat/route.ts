import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { StreamingTextResponse, streamText } from 'ai';
import { getContext } from '@/lib/context';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const context = await getContext(messages.at(-1).content);

  if (context) {
    messages.unshift({
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
      `
    });
  }

  const result = await streamText({
    model: google('models/gemini-pro'),
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}