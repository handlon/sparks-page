"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, LogOut, MapPin, Pencil, Plus, Ticket, Trash2, X } from "lucide-react";
// Type-only import is erased at compile time, so it does not pull in the Mongo driver.
import type { Show } from "@/lib/shows";
// Values must come from lib/dates, which has no database import. See lib/dates.ts.
import { dateInputToIso, deriveDisplayDate, isoToDateInput } from "@/lib/dates";
import { Button } from "@/components/ui";

/** Live preview of exactly how the public site will render the chosen date. */
function previewDisplay(value: string): { date: string; day: string } {
  const derived = deriveDisplayDate(dateInputToIso(value));
  return derived.date ? derived : { date: "—", day: "—" };
}

interface FormState {
  dateInput: string;
  venue: string;
  city: string;
  link: string;
}

const EMPTY_FORM: FormState = { dateInput: "", venue: "", city: "", link: "" };

const INPUT_CLASS =
  "h-12 w-full rounded-md border border-border bg-surface px-4 text-foreground " +
  "outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50";

export function ShowsManager({
  initialShows,
  loadError,
  username,
}: {
  initialShows: Show[];
  loadError: string | null;
  username: string;
}) {
  const router = useRouter();
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const preview = previewDisplay(form.dateInput);
  const isEditing = editingId !== null;

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
  }

  function startEdit(show: Show) {
    setEditingId(show._id);
    setForm({
      dateInput: isoToDateInput(show.rawDate),
      venue: show.venue,
      city: show.city,
      link: show.link,
    });
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const payload = {
      rawDate: dateInputToIso(form.dateInput),
      venue: form.venue,
      city: form.city,
      link: form.link,
    };

    const response = await fetch(
      isEditing ? `/api/shows/${editingId}` : "/api/shows",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    ).catch(() => null);

    if (!response) {
      setError("Network error — could not reach the server.");
      setBusy(false);
      return;
    }

    if (response.status === 401) {
      router.replace("/admin/login"); // session expired mid-edit
      return;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Something went wrong.");
      setBusy(false);
      return;
    }

    const saved = data as Show;
    setShows((current) =>
      (isEditing
        ? current.map((s) => (s._id === saved._id ? saved : s))
        : [...current, saved]
      ).sort((a, b) => a.rawDate.localeCompare(b.rawDate)),
    );

    setNotice(isEditing ? "Show updated." : "Show added.");
    resetForm();
    setBusy(false);
    router.refresh(); // rebuild the cached landing page
  }

  async function onDelete(id: string) {
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/shows/${id}`, { method: "DELETE" }).catch(
      () => null,
    );

    if (!response) {
      setError("Network error — could not reach the server.");
      setBusy(false);
      return;
    }

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not delete the show.");
      setBusy(false);
      return;
    }

    setShows((current) => current.filter((show) => show._id !== id));
    setConfirmingDelete(null);
    if (editingId === id) resetForm();
    setNotice("Show deleted.");
    setBusy(false);
    router.refresh();
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 flex items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl uppercase leading-none text-foreground">Shows</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <span className="text-primary">{username}</span>
          </p>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          <LogOut size={14} strokeWidth={2} />
          Sign out
        </Button>
      </header>

      {loadError && (
        <p role="alert" className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {/* ---------- form ---------- */}
      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-display text-2xl uppercase text-foreground">
          {isEditing ? "Edit show" : "Add a show"}
        </h2>

        <form onSubmit={onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="date" className="eyebrow mb-2 block text-muted-foreground">
              Date *
            </label>
            <input
              id="date"
              type="date"
              required
              value={form.dateInput}
              onChange={(e) => setForm({ ...form, dateInput: e.target.value })}
              className={INPUT_CLASS}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Will show on the site as{" "}
              <span className="text-primary">
                {preview.day} · {preview.date}
              </span>
            </p>
          </div>

          <div>
            <label htmlFor="venue" className="eyebrow mb-2 block text-muted-foreground">
              Venue *
            </label>
            <input
              id="venue"
              required
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="Divadlo Gong"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="city" className="eyebrow mb-2 block text-muted-foreground">
              City *
            </label>
            <input
              id="city"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Prague"
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="link" className="eyebrow mb-2 block text-muted-foreground">
              Ticket link
            </label>
            <input
              id="link"
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://goout.net/…"
              className={INPUT_CLASS}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Optional. Leave empty and the &ldquo;Tickets&rdquo; button is hidden.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive sm:col-span-2">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="flex items-center gap-2 text-sm text-primary sm:col-span-2">
              <Check size={14} strokeWidth={2} />
              {notice}
            </p>
          )}

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" variant="primary" disabled={busy}>
              {isEditing ? <Check size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
              {busy ? "Saving…" : isEditing ? "Save changes" : "Add show"}
            </Button>
            {isEditing && (
              <Button type="button" variant="ghost" onClick={resetForm} disabled={busy}>
                <X size={14} strokeWidth={2} />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </section>

      {/* ---------- list ---------- */}
      <section className="mt-12">
        <h2 className="mb-5 font-display text-2xl uppercase text-foreground">
          Scheduled ({shows.length})
        </h2>

        {shows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-muted-foreground">
            No shows yet. Add the first one above.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {shows.map((show) => (
              <li
                key={show._id}
                className={`rounded-lg border bg-surface p-5 transition-colors ${
                  editingId === show._id ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Calendar size={12} strokeWidth={2} />
                      <span className="eyebrow">
                        {show.day} · {show.date}
                      </span>
                    </div>
                    <div className="mt-1.5 font-display text-xl uppercase text-foreground">
                      {show.venue}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} strokeWidth={1.5} />
                        {show.city}
                      </span>
                      {show.link && (
                        <span className="flex items-center gap-1.5">
                          <Ticket size={12} strokeWidth={1.5} />
                          <a
                            href={show.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate underline underline-offset-2 hover:text-primary"
                          >
                            Ticket link
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => startEdit(show)}
                      disabled={busy}
                      aria-label={`Edit ${show.venue}`}
                    >
                      <Pencil size={14} strokeWidth={2} />
                      Edit
                    </Button>

                    {confirmingDelete === show._id ? (
                      <>
                        <Button
                          variant="danger"
                          onClick={() => onDelete(show._id)}
                          disabled={busy}
                        >
                          <Trash2 size={14} strokeWidth={2} />
                          Really delete
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setConfirmingDelete(null)}
                          disabled={busy}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={() => setConfirmingDelete(show._id)}
                        disabled={busy}
                        aria-label={`Delete ${show.venue}`}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
