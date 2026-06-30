// api/shows.js
import { MongoClient } from "mongodb";

// Adresu vytáhneme bezpečně z prostředí (přenastavíme ve Vercelu)
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  // Povolení přístupu z frontendu (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await client.connect();
    const db = client.db("kapela_db"); // název databáze
    const collection = db.collection("koncerty"); // název kolekce

    // 1. NAČTENÍ KONCERTŮ (Pro lidi na webu)
    if (req.method === "GET") {
      // V backendu při find() přidáš .sort()
      const shows = await db
        .collection("koncerty")
        .find({})
        .sort({ rawDate: 1 })
        .toArray();
      return res.status(200).json(shows);
    }

    // 2. PŘIDÁNÍ KONCERTU (Pro tebe do budoucí administrace)
    if (req.method === "POST") {
      const novýKoncert = req.body;

      // Základní ochrana: zkontrolujeme tajný token v hlavičce, aby ti tam nikdo nesypal fake koncerty
      if (req.headers["x-admin-token"] !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: "Nepovolený přístup" });
      }

      await collection.insertOne(novýKoncert);
      return res
        .status(201)
        .json({ success: true, message: "Koncert úspěšně přidán!" });
    }

    return res.status(405).json({ error: "Metoda nepovolena" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
