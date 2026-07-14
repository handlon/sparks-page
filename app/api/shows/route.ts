import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { createShow, listShows, parseShowInput } from "@/lib/shows";

export const dynamic = "force-dynamic";

/** Every mutating handler re-checks the session itself. Middleware is a convenience
    redirect for humans, never the only thing standing between the public and the DB. */
async function requireSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  try {
    return NextResponse.json(await listShows());
  } catch (error) {
    console.error("GET /api/shows failed:", error);
    return NextResponse.json({ error: "Could not load shows." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parseShowInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    return NextResponse.json(await createShow(parsed), { status: 201 });
  } catch (error) {
    console.error("POST /api/shows failed:", error);
    return NextResponse.json({ error: "Could not save the show." }, { status: 500 });
  }
}
