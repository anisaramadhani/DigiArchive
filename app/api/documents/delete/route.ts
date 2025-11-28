import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// DELETE - Soft delete (move to recycle bin)
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Soft delete - tandai sebagai deleted
    const result = await db.collection('arsip').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          deleted: true,
          deletedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Arsip tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Arsip berhasil dihapus' }, { status: 200 });

  } catch (err) {
    console.error('Delete arsip error:', err);
    return NextResponse.json({ error: 'Gagal menghapus arsip' }, { status: 500 });
  }
}
