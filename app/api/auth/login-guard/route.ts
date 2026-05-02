export const dynamic = "force-dynamic";

type LoginGuardAction = "check" | "fail" | "success";

interface LoginGuardBody {
  email?: string;
  action?: LoginGuardAction;
}

interface RateLimitEntry {
  failCount: number;
  resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILS = 5;

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "unknown";
}

function getStore(): Map<string, RateLimitEntry> {
  const g = globalThis as unknown as {
    __bitesnclick_loginRateLimitStore?: Map<string, RateLimitEntry>;
  };

  if (!g.__bitesnclick_loginRateLimitStore) {
    g.__bitesnclick_loginRateLimitStore = new Map();
  }

  return g.__bitesnclick_loginRateLimitStore;
}

function makeKey(ip: string, email?: string): string {
  const normalizedEmail = (email ?? "").trim().toLowerCase();
  return `${ip}::${normalizedEmail}`;
}

function getRetryAfterSeconds(entry: RateLimitEntry, now: number): number {
  return Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginGuardBody;
    const action: LoginGuardAction = body.action ?? "check";
    const email = body.email;

    const ip = getClientIp(req);
    const key = makeKey(ip, email);
    const store = getStore();
    const now = Date.now();

    const existing = store.get(key);
    const entry: RateLimitEntry =
      existing && existing.resetAt > now
        ? existing
        : { failCount: 0, resetAt: now + WINDOW_MS };

    const isLimited = entry.failCount >= MAX_FAILS && entry.resetAt > now;

    if (action === "success") {
      store.delete(key);
      return Response.json({ allowed: true, remaining: MAX_FAILS }, { status: 200 });
    }

    if (action === "fail") {
      entry.failCount += 1;
      store.set(key, entry);

      const limitedNow = entry.failCount >= MAX_FAILS;
      if (limitedNow) {
        const retryAfterSeconds = getRetryAfterSeconds(entry, now);
        return Response.json(
          { allowed: false, retryAfterSeconds, remaining: 0 },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfterSeconds),
              "Cache-Control": "no-store",
            },
          }
        );
      }

      return Response.json(
        { allowed: true, remaining: Math.max(0, MAX_FAILS - entry.failCount) },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    // action === "check"
    if (isLimited) {
      const retryAfterSeconds = getRetryAfterSeconds(entry, now);
      return Response.json(
        { allowed: false, retryAfterSeconds, remaining: 0 },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    store.set(key, entry);
    return Response.json(
      { allowed: true, remaining: Math.max(0, MAX_FAILS - entry.failCount) },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { allowed: true },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
