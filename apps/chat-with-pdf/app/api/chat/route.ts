import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { StreamingTextResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('models/gemini-pro'),
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}