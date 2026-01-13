import { AssistantResponse } from 'ai';
import { openai } from '@/lib/openai';
import { auth } from '@/auth';
import { checkRateLimit } from '@/lib/limits';

export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

    // Rate Limit Check
    // Rate Limit Check
    // Rate Limit Check
    const isGuest = session.user.email === "guest@grade-dash.demo";
    let newCookieValue: string | null = null;

    if (isGuest) {
        const { checkCookieRateLimit } = await import("@/lib/cookie-limits");
        const cookieStore = await import("next/headers").then(mod => mod.cookies());
        const usageCookie = cookieStore.get("guest-chat-usage");

        const result = checkCookieRateLimit(usageCookie?.value, 5);

        if (!result.success) {
            return new Response("Guest limit exceeded (5 free messages). Sign in for more.", { status: 429 });
        }
        newCookieValue = result.newCookie;
    } else {
        const limit = await checkRateLimit(session.user.id, 'chat', 30);
        if (!limit.success) {
            return new Response("Daily message limit exceeded (30/day). Please try again tomorrow.", { status: 429 });
        }
    }

    // Parse the request body
    const input = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
    });

    const response = AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream, sendDataMessage }) => {
            // Run the assistant on the thread
            const runStream = openai.beta.threads.runs.stream(threadId, {
                assistant_id: process.env.ASSISTANT_ID ?? (() => { throw new Error('ASSISTANT_ID is not set') })(),
            });

            // forward the run status and message deltas to the client
            const runResult = await forwardStream(runStream);
        },
    );

    if (newCookieValue) {
        response.headers.set(
            'Set-Cookie',
            `guest-chat-usage=${newCookieValue}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`
        );
    }

    return response;
}
