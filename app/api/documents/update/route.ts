import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Update arsip
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, category, image } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (image) updateData.image = image;

    // Update arsip
    const result = await db.collection('arsip').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Arsip tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Arsip berhasil diupdate' }, { status: 200 });

  } catch (err) {
    console.error('Update arsip error:', err);
    return NextResponse.json({ error: 'Gagal mengupdate arsip' }, { status: 500 });
  }
}
