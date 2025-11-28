import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - List deleted documents
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const npm = url.searchParams.get('npm');

    if (!npm) {
      return NextResponse.json({ error: 'NPM required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get deleted arsip (yang sudah dihapus)
    const deletedDocs = await db.collection('arsip')
      .find({
        npm: npm.toString(),
        deleted: true
      })
      .sort({ deletedAt: -1 })
      .toArray();

    // Format response
    const formattedDocs = deletedDocs.map((doc: any) => ({
      id: doc._id.toString(),
      judul: doc.title,
      title: doc.title,
      file: doc.title + '.jpg',
      deletedAt: doc.deletedAt ? new Date(doc.deletedAt).getTime() : Date.now()
    }));

    return NextResponse.json(formattedDocs, { status: 200 });

  } catch (err) {
    console.error('Get deleted docs error:', err);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// PUT - Restore document
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Restore document (set deleted = false)
    const result = await db.collection('arsip').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { deleted: false },
        $unset: { deletedAt: "" }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Dokumen berhasil dipulihkan' }, { status: 200 });

  } catch (err) {
    console.error('Restore doc error:', err);
    return NextResponse.json({ error: 'Gagal restore dokumen' }, { status: 500 });
  }
}

// DELETE - Permanent delete
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Permanent delete
    const result = await db.collection('arsip').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Dokumen berhasil dihapus permanen' }, { status: 200 });

  } catch (err) {
    console.error('Permanent delete error:', err);
    return NextResponse.json({ error: 'Gagal hapus permanen' }, { status: 500 });
  }
}
