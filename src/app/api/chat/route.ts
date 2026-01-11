import { AssistantResponse } from 'ai';
import { openai } from '@/lib/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
    // Parse the request body
    const input = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
    });

    return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream, sendDataMessage }) => {
            // Run the assistant on the thread
            const runStream = openai.beta.threads.runs.stream(threadId, {
                assistant_id: process.env.ASSISTANT_ID ?? (() => { throw new Error('ASSISTANT_ID is not set') })(),
            });

            // forward the run status and message deltas to the client
            let runResult = await forwardStream(runStream);
        },
    );
}
