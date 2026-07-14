import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  getAdminCredentials,
} from "@/lib/auth";

/** Constant-time-ish string compare, so a wrong password can't be found byte by byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: Request) {
  const credentials = getAdminCredentials();

  if (!credentials) {
    // Production without ADMIN_USER / ADMIN_PASSWORD set: no login is possible at all.
    return NextResponse.json(
      { error: "The admin is not configured on this deployment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { username, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const ok =
    safeEqual(username, credentials.user) && safeEqual(password, credentials.password);

  if (!ok) {
    // Slow failures down a little so the endpoint isn't a fast brute-force oracle.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(username), SESSION_COOKIE_OPTIONS);
  return response;
}
