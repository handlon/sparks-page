import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { listShows, type Show } from "@/lib/shows";
import { ShowsManager } from "@/components/admin/ShowsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Young Sparks",
  robots: { index: false, follow: false }, // never let this page into search results
};

export default async function AdminPage() {
  /* Re-check the session here rather than trusting middleware alone. Middleware is a
     convenience redirect; this is the actual gate on the page. */
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  let shows: Show[] = [];
  let loadError: string | null = null;

  try {
    shows = await listShows();
  } catch (error) {
    console.error("Admin could not load shows:", error);
    loadError = "Could not reach the database.";
  }

  return (
    <ShowsManager
      initialShows={shows}
      loadError={loadError}
      username={session.u}
    />
  );
}
