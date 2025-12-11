import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { documentLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const startTime = Date.now();
  let npm: string = '';
  let fileName: string = '';
  
  try {
    const body = await req.json();
    const { title, category, image, npm: userNpm, fileName: originalFileName, fileType } = body;
    npm = userNpm;
    fileName = originalFileName;

    documentLogger.info('Document upload started', { 
      npm, 
      fileName: originalFileName,
      category,
      fileType,
      fileSize: image ? `${(image.length / 1024).toFixed(2)}KB` : 'unknown'
    });

    // Validasi input
    if (!image) {
      documentLogger.warn('Document upload failed: Missing image data', { npm });
      return NextResponse.json(
        { message: 'Gambar dokumen harus diisi' },
        { status: 400 }
      );
    }

    if (!npm) {
      documentLogger.warn('Document upload failed: Missing NPM', { fileName: originalFileName });
      return NextResponse.json(
        { message: 'NPM user harus diisi' },
        { status: 400 }
      );
    }

    // Connect to database
    documentLogger.debug('Connecting to database for document insert', { npm, fileName: originalFileName });
    const { db } = await connectToDatabase();

    // Insert dokumen baru
    const result = await db.collection('arsip').insertOne({
      npm: npm.toString(),
      title: title || 'Dokumen tanpa judul',
      category: category || 'Lainnya',
      image: image, // Base64 image/file data
      fileName: originalFileName || 'file', // Nama file asli
      fileType: fileType || 'image/jpeg', // Tipe file asli
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const duration = Date.now() - startTime;
    documentLogger.info('Document uploaded successfully', {
      npm,
      documentId: result.insertedId,
      fileName: originalFileName,
      category,
      duration: `${duration}ms`
    });

    return NextResponse.json(
      {
        message: 'Dokumen berhasil disimpan',
        documentId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err: any) {
    const duration = Date.now() - startTime;
    documentLogger.error('Document upload failed', err, {
      npm,
      fileName,
      duration: `${duration}ms`,
      errorMessage: err?.message
    });
    return NextResponse.json(
      { message: 'Gagal menyimpan dokumen ke database' },
      { status: 500 }
    );
  }
}
