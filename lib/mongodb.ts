import { MongoClient, type Db } from "mongodb";

/* The old api/shows.js called client.connect() and client.close() on every request,
   which throws away the connection pool each time. In a serverless environment the
   module is reused across warm invocations, so we cache one client on globalThis
   instead and never close it. */

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.local (and to Vercel).");
}

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalForMongo._mongoClientPromise) {
  globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
}

const clientPromise = globalForMongo._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("kapela_db");
}

export const SHOWS_COLLECTION = "koncerty";
