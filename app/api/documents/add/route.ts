import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, image, npm, fileName, fileType } = body;

    // Validasi input
    if (!image) {
      return NextResponse.json(
        { message: 'Gambar dokumen harus diisi' },
        { status: 400 }
      );
    }

    if (!npm) {
      return NextResponse.json(
        { message: 'NPM user harus diisi' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Insert dokumen baru
    const result = await db.collection('arsip').insertOne({
      npm: npm.toString(),
      title: title || 'Dokumen tanpa judul',
      category: category || 'Lainnya',
      image: image, // Base64 image/file data
      fileName: fileName || 'file', // Nama file asli
      fileType: fileType || 'image/jpeg', // Tipe file asli
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Dokumen berhasil disimpan',
        documentId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Add document error:', err);
    return NextResponse.json(
      { message: 'Gagal menyimpan dokumen ke database' },
      { status: 500 }
    );
  }
}
