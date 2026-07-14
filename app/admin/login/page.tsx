"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not sign in.");
        setSubmitting(false);
        return;
      }

      // The session lives in an httpOnly cookie, so there is nothing to store here.
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error — is the server running?");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-[clamp(2.2rem,7vw,3rem)] uppercase leading-none text-foreground">
          Young Sparks
        </h1>
        <p className="eyebrow mt-3 text-primary">Admin</p>

        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
          <div>
            <label htmlFor="username" className="eyebrow mb-2 block text-muted-foreground">
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 w-full rounded-md border border-border bg-surface px-4 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="eyebrow mb-2 block text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-md border border-border bg-surface px-4 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={submitting} className="mt-2">
            <LogIn size={15} strokeWidth={2} />
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-xs text-muted-foreground">
          Manage upcoming shows. Changes go live on the site within a minute.
        </p>
      </div>
    </main>
  );
}
