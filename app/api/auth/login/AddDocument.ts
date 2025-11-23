// pages/api/documents/add.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { category, image, createdAt } = req.body;

      // Connect to MongoDB
      const { db } = await connectToDatabase();

      // Insert the document into the MongoDB collection
      const result = await db.collection('documents').insertOne({
        category,
        image,
        createdAt,
      });

      res.status(200).json({ message: 'Dokumen berhasil disimpan', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Gagal menyimpan dokumen', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
