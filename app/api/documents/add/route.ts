import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
<<<<<<< HEAD
import Document from '@/lib/models/Document';
=======
import Document from '../../../../lib/models/document';
>>>>>>> 3720c41f7b6f9f816a147b70cea4b23939feb66f

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

<<<<<<< HEAD
    const userId = request.headers.get('x-user-id') || 'demo-user';
=======
    let userId = request.headers.get('x-user-id') || '';
    // Ensure userId is a valid ObjectId; if not, generate a demo ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      userId = new mongoose.Types.ObjectId().toString();
    }
>>>>>>> 3720c41f7b6f9f816a147b70cea4b23939feb66f
    const body = await request.json();

    const { title, category, image } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, message: 'Title dan gambar diperlukan' },
        { status: 400 }
      );
    }

<<<<<<< HEAD
    // Create new document
=======
    // Create new document (ensure userId is ObjectId string)
>>>>>>> 3720c41f7b6f9f816a147b70cea4b23939feb66f
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
