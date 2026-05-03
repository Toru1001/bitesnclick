export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";

interface ForgotPasswordBody {
  email?: string;
  captchaToken?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3;

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  return "unknown";
}

function getStore(): Map<string, RateLimitEntry> {
  const g = globalThis as unknown as {
    __bitesnclick_forgotPasswordRateLimitStore?: Map<string, RateLimitEntry>;
  };

  if (!g.__bitesnclick_forgotPasswordRateLimitStore) {
    g.__bitesnclick_forgotPasswordRateLimitStore = new Map();
  }

  return g.__bitesnclick_forgotPasswordRateLimitStore;
}

function makeKey(ip: string, email: string): string {
  return `${ip}::${email.trim().toLowerCase()}`;
}

function getRetryAfterSeconds(entry: RateLimitEntry, now: number): number {
  return Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ForgotPasswordBody;
    const email = (body.email ?? "").trim();
    const captchaToken = (body.captchaToken ?? "").trim();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (!captchaToken) {
      return Response.json(
        { ok: false, error: "Captcha is required" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const ip = getClientIp(req);
    const key = makeKey(ip, email);
    const store = getStore();
    const now = Date.now();

    const existing = store.get(key);
    const entry: RateLimitEntry =
      existing && existing.resetAt > now
        ? existing
        : { count: 0, resetAt: now + WINDOW_MS };

    if (entry.count >= MAX_REQUESTS && entry.resetAt > now) {
      const retryAfterSeconds = getRetryAfterSeconds(entry, now);
      return Response.json(
        { ok: false, retryAfterSeconds },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    entry.count += 1;
    store.set(key, entry);

    const origin = req.headers.get("origin") || "";
    const redirectTo = origin ? `${origin}/auth/callback#reset-password` : undefined;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: "Server is not configured" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      ...(redirectTo ? { redirectTo } : {}),
      captchaToken,
    });

    // Always return a generic success response to avoid email enumeration.
    if (error) {
      const message = (error as { message?: string } | null)?.message ?? "";
      if (/captcha/i.test(message)) {
        return Response.json(
          { ok: false, error: "Captcha verification failed" },
          { status: 400, headers: { "Cache-Control": "no-store" } }
        );
      }
      return Response.json(
        { ok: true },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    return Response.json(
      { ok: true },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
