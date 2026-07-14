import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { deleteShow, isValidObjectId, parseShowInput, updateShow } from "@/lib/shows";

export const dynamic = "force-dynamic";

async function requireSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Unknown show." }, { status: 400 });
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
    const found = await updateShow(id, parsed);
    if (!found) {
      return NextResponse.json({ error: "That show no longer exists." }, { status: 404 });
    }
    return NextResponse.json({ ...parsed, _id: id });
  } catch (error) {
    console.error("PUT /api/shows/[id] failed:", error);
    return NextResponse.json({ error: "Could not update the show." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Unknown show." }, { status: 400 });
  }

  try {
    const found = await deleteShow(id);
    if (!found) {
      return NextResponse.json({ error: "That show no longer exists." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/shows/[id] failed:", error);
    return NextResponse.json({ error: "Could not delete the show." }, { status: 500 });
  }
}
