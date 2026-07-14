/* Session auth for /admin.

   Deliberately dependency-free and Web Crypto based, so the exact same helpers run
   in the Edge runtime (middleware) and the Node runtime (route handlers).

   The session is a signed token: base64url(payload).base64url(HMAC-SHA256(payload)).
   It is not encrypted — it carries no secrets, only a username and an expiry — but it
   cannot be forged without SESSION_SECRET. */

export const SESSION_COOKIE = "ys_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h

const isProd = process.env.NODE_ENV === "production";

interface SessionPayload {
  u: string;
  exp: number;
}

/* --- config -------------------------------------------------------------- */

function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  // Never fall back to a known constant in production — that would make every
  // deployment forgeable by anyone who has read this file.
  return isProd ? null : "dev-only-insecure-secret";
}

/** Returns null when the admin is not configured, which disables login entirely. */
export function getAdminCredentials(): { user: string; password: string } | null {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (user && password) return { user, password };

  // Local convenience only: the user/pass login asked for, but never in production.
  if (!isProd) return { user: "user", password: "pass" };

  return null;
}

/** True when the deployment is missing the env vars the admin needs. */
export function adminIsConfigured(): boolean {
  return getAdminCredentials() !== null && getSecret() !== null;
}

/* --- crypto -------------------------------------------------------------- */

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Length-independent equality, so we don't leak the signature via timing. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/* --- session ------------------------------------------------------------- */

export async function createSessionToken(username: string): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET is not set");

  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await importKey(secret),
    encoder.encode(body),
  );

  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const secret = getSecret();
  if (!secret) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", await importKey(secret), encoder.encode(body)),
  );

  let provided: Uint8Array;
  try {
    provided = fromBase64Url(signature);
  } catch {
    return null;
  }

  if (!timingSafeEqual(expected, provided)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
    if (typeof payload?.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true, // JS in the page can never read it, so XSS can't steal the session
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
