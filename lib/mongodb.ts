import { MongoClient, type Db } from "mongodb";

/* The old api/shows.js called client.connect() and client.close() on every request,
   which throws away the connection pool each time. In a serverless environment the
   module is reused across warm invocations, so we cache one client on globalThis
   instead and never close it. */

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

/* Connect lazily, inside getDb, rather than at module scope. A missing MONGODB_URI
   used to throw the moment this file was imported, which crashed `next build` during
   prerendering. Throwing from here instead means the failure lands inside the caller's
   try/catch, so the page still builds and just renders its "couldn't load" state. */
function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local and to Vercel.");
  }

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db("kapela_db");
}

export const SHOWS_COLLECTION = "koncerty";
