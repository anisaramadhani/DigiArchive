// pages/api/documents/add.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { category, image, title } = req.body;
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("documents").insertOne({
        title,
        category,
        image,
        createdAt: new Date(),
      });
      res.status(200).json({ message: "Dokumen berhasil disimpan", data: result });
    } catch (err) {
      res.status(500).json({ message: "Gagal menyimpan dokumen", error: err });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
