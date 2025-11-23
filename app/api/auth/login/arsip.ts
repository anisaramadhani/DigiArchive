// pages/api/documents/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();
      const documents = await db.collection("documents").find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(documents);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil dokumen", error: err });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
