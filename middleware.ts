import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/* Redirects signed-out humans away from /admin to the login page.
   This is UX, not the security boundary — /api/shows re-verifies the session on every
   mutating request, so a middleware bypass still can't write to the database. */
export async function middleware(request: NextRequest) {
  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // /admin only. /admin/login is excluded, otherwise it would redirect to itself.
  matcher: ["/admin"],
};
