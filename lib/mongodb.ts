// lib/mongodb.ts
import { MongoClient } from 'mongodb';

// Buat koneksi MongoDB tanpa opsi useNewUrlParser dan useUnifiedTopology
const client = new MongoClient(process.env.MONGODB_URI || "");

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  // Gunakan cache jika sudah terhubung
  if (cachedClient && cachedDb) {
    return { db: cachedDb, client: cachedClient };
  }

  // Buat koneksi baru jika belum ada
  await client.connect();  // Tidak perlu cek isConnected()

  cachedClient = client;
  cachedDb = client.db(process.env.MONGODB_DB);

  return { db: cachedDb, client: cachedClient };
}
