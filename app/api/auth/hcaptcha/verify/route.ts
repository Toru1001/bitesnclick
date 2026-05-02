import { NextResponse } from "next/server";

type VerifyRequestBody = {
  token?: string;
};

type HCaptchaVerifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
  hostname?: string;
  challenge_ts?: string;
  credit?: boolean;
  score?: number;
};

function getRemoteIp(req: Request): string | undefined {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return undefined;
}

export async function POST(req: Request) {
  const secret = process.env.HCAPTCHA_SECRET ?? process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        error: "HCAPTCHA_SECRET (or HCAPTCHA_SECRET_KEY) is not configured",
      },
      { status: 500 }
    );
  }

  let body: VerifyRequestBody = {};
  try {
    body = (await req.json()) as VerifyRequestBody;
  } catch {
    // ignore
  }

  const token = body.token;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);

  const remoteIp = getRemoteIp(req);
  if (remoteIp) params.set("remoteip", remoteIp);

  let verifyRes: Response;
  try {
    verifyRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach hCaptcha verify endpoint" },
      { status: 502 }
    );
  }

  let data: HCaptchaVerifyResponse | undefined;
  try {
    data = (await verifyRes.json()) as HCaptchaVerifyResponse;
  } catch {
    data = undefined;
  }

  const success = Boolean(data?.success);

  return NextResponse.json(
    {
      success,
      errorCodes: data?.["error-codes"] ?? [],
      hostname: data?.hostname,
    },
    { status: success ? 200 : 400 }
  );
}
