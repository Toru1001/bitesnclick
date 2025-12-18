export const dynamic = "force-dynamic";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

const formatMessage = (message: ChatMessage) => `${message.sender}: ${message.text}`;

const API_BASE_URL =
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/`;
const MODEL_NAME = "@cf/mistralai/mistral-small-3.1-24b-instruct";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400 });
    }

    const previousMessages = messages.slice(0, -1).map(formatMessage);
    const question = messages[messages.length - 1].text;
    let context = "";
    try {
      const { PDFLoader } = await import("@langchain/community/document_loaders/fs/pdf");
      const loader = new PDFLoader(`${process.cwd()}/knowledge-base/For-AI-Training.pdf`);
      const docs = await loader.load();
      context = docs.map((doc) => doc.pageContent).join("\n");
    } catch (err) {
      console.warn("PDFLoader failed, using empty context:", err);
      context = "";
    }
    const fullPrompt = `
Answer the user's question using ONLY the context below.
If the answer is not in the context, reply politely that you don't have that information and 
just contact us at https://www.facebook.com/homebitesdavao or https://www.instagram.com/homebitesdavao.

==============================
Context:
${context}
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

    return new Response(JSON.stringify({ reply: responseText }), { status: 200 });
  } catch (e: any) {
    console.error("Error in /api/chat-ai:", e);
    return new Response(JSON.stringify({ error: e.message ?? "Unknown error" }), { status: 500 });
  }
}
