import { ObjectId } from "mongodb";
import { getDb, SHOWS_COLLECTION } from "./mongodb";
import { deriveDisplayDate } from "./dates";

/* NOTE: this module imports the MongoDB driver, so it is server-only.
   Client components must import date helpers from "./dates" instead. */

/** A show as the UI consumes it: `_id` is a plain string, `rawDate` an ISO string. */
export interface Show {
  _id: string;
  date: string; // display date, e.g. "Sept 9"
  day: string; // display weekday, e.g. "Fri"
  venue: string;
  city: string;
  link: string;
  rawDate: string; // ISO — the field we actually sort on
}

export interface ShowInput {
  date: string;
  day: string;
  venue: string;
  city: string;
  link: string;
  rawDate: string;
}

/** Narrow and clean untrusted request bodies before they reach Mongo. */
export function parseShowInput(body: unknown): ShowInput | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Expected a JSON object." };
  }
  const b = body as Record<string, unknown>;

  const str = (key: string) => (typeof b[key] === "string" ? (b[key] as string).trim() : "");

  const rawDate = str("rawDate");
  const venue = str("venue");
  const city = str("city");

  if (!rawDate || Number.isNaN(new Date(rawDate).getTime())) {
    return { error: "A valid date is required." };
  }
  if (!venue) return { error: "Venue is required." };
  if (!city) return { error: "City is required." };

  const link = str("link");
  if (link && !/^https?:\/\//i.test(link)) {
    return { error: "Link must start with http:// or https://" };
  }

  const iso = new Date(rawDate).toISOString();
  // Display strings are always derived, never taken from the request, so they can
  // never disagree with rawDate. They're still written to Mongo for compatibility.
  const derived = deriveDisplayDate(iso);

  return { rawDate: iso, venue, city, link, date: derived.date, day: derived.day };
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

/* --- queries -------------------------------------------------------------- */

export async function listShows(): Promise<Show[]> {
  const db = await getDb();
  const docs = await db
    .collection(SHOWS_COLLECTION)
    .find({})
    .sort({ rawDate: 1 })
    .toArray();

  return docs.map((doc) => {
    const rawDate =
      doc.rawDate instanceof Date
        ? doc.rawDate.toISOString()
        : typeof doc.rawDate === "string"
          ? doc.rawDate
          : "";

    /* `date` and `day` are always derived from rawDate rather than read from the
       document. The stored strings were hand-typed and had drifted into two formats
       ("01.08.2026"/"Saturday" vs "Sept 9"/"Fri"), and one of them disagreed with its
       own rawDate. Deriving keeps every row consistent, old and new. */
    const derived = deriveDisplayDate(rawDate);

    return {
      _id: String(doc._id),
      date: derived.date,
      day: derived.day,
      venue: typeof doc.venue === "string" ? doc.venue : "",
      city: typeof doc.city === "string" ? doc.city : "",
      link: typeof doc.link === "string" ? doc.link : "",
      rawDate,
    };
  });
}

export async function createShow(input: ShowInput): Promise<Show> {
  const db = await getDb();
  const result = await db.collection(SHOWS_COLLECTION).insertOne({
    ...input,
    rawDate: new Date(input.rawDate), // stored as a BSON date, matching existing docs
  });
  return { ...input, _id: String(result.insertedId) };
}

export async function updateShow(id: string, input: ShowInput): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection(SHOWS_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...input, rawDate: new Date(input.rawDate) } },
    );
  return result.matchedCount > 0;
}

export async function deleteShow(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection(SHOWS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
