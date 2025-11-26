import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Document from '@/lib/models/Document';

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();

    const { title, category, image } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, message: 'Title dan gambar diperlukan' },
        { status: 400 }
      );
    }

    // Create new document
    const newDocument = new Document({
      userId,
      title: title || 'Dokumen Tanpa Judul',
      category: category || 'Lainnya',
      imageData: image,
      fileName: `${Date.now()}.jpg`,
      fileSize: image.length,
    });

    await newDocument.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Dokumen berhasil disimpan!',
        data: newDocument,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menyimpan dokumen',
      },
      { status: 500 }
    );
  }
}
