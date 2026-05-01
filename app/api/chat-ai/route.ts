export const dynamic = "force-dynamic";

interface ChatMessage {
    sender: "user" | "assistant";
    text: string;
}

const formatMessage = (message: ChatMessage) =>
    `${message.sender}: ${message.text}`;

const API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/`;
const MODEL_NAME = "@cf/mistralai/mistral-small-3.1-24b-instruct";

let cachedContext = "";

// Simple in-memory rate limiting map (IP -> timestamp array)
// Note: In a real production distributed environment (e.g., Vercel), use Redis (Upstash).
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting Check
        const ip = req.headers.get("x-forwarded-for") ?? "unknown";
        const now = Date.now();

        if (ip !== "unknown") {
            const userRequests = rateLimitMap.get(ip) ?? [];
            const windowRequests = userRequests.filter(
                (time) => now - time < RATE_LIMIT_WINDOW_MS,
            );

            if (windowRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
                return new Response(
                    JSON.stringify({
                        error: "Too many requests. Please try again later.",
                    }),
                    { status: 429 },
                );
            }

            windowRequests.push(now);
            rateLimitMap.set(ip, windowRequests);
        }

        const { messages }: { messages: ChatMessage[] } = await req.json();

        if (!messages || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "No messages provided" }),
                { status: 400 },
            );
        }

        const previousMessages = messages.slice(0, -1).map(formatMessage);
        const question = messages[messages.length - 1].text;

        // 2. Load context only once and cache it in memory
        if (!cachedContext) {
            try {
                const { PDFLoader } =
                    await import("@langchain/community/document_loaders/fs/pdf");
                const loader = new PDFLoader(
                    `${process.cwd()}/knowledge-base/For-AI-Training.pdf`,
                );
                const docs = await loader.load();
                cachedContext = docs.map((doc) => doc.pageContent).join("\n");
            } catch (err) {
                console.warn("PDFLoader failed, using empty context:", err);
                cachedContext = "";
            }
        }

        const fullPrompt = `
Answer the user's question using ONLY the context below.
If the answer is not in the context, reply politely that you don't have that information.

==============================
Context:
${cachedContext}
==============================

Conversation:
${previousMessages.join("\n")}

User: ${question}
Assistant:
`;

        const HEADERS = {
            Authorization: `Bearer ${process.env.CLOUDFLARE_AI_KEY}`,
            "Content-Type": "application/json",
        };
        let responseText = "No response from AI.";
        const MAX_RETRIES = 3;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const res = await fetch(API_BASE_URL + MODEL_NAME, {
                method: "POST",
                headers: HEADERS,
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [{ role: "user", content: fullPrompt }],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Cloudflare AI error:", data);
                throw new Error(`Cloudflare AI request failed: ${res.status}`);
            }

            const text = data.result?.response ?? "";

            if (text && !text.startsWith("I cannot")) {
                responseText = text;
                break;
            }
        }

        return new Response(JSON.stringify({ reply: responseText }), {
            status: 200,
        });
    } catch (e: any) {
        console.error("Error in /api/chat-ai:", e);
        return new Response(
            JSON.stringify({ error: e.message ?? "Unknown error" }),
            { status: 500 },
        );
    }
}
