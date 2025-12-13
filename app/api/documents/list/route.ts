import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - List all arsip untuk user tertentu
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const npm = url.searchParams.get('npm');
    const search = url.searchParams.get('search') || '';
    const kategori = url.searchParams.get('kategori') || '';

    if (!npm) {
      return NextResponse.json({ error: 'NPM required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Build query
    const query: any = {
      npm: npm.toString(),
      deleted: { $ne: true }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (kategori) {
      query.category = kategori;
    }

    // Get arsip - pastikan collection exists
    let arsip = [];
    try {
      arsip = await db.collection('arsip')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    } catch (collectionErr) {
      // Collection mungkin belum dibuat, return empty array
      console.warn('Collection arsip not found or empty, returning empty array');
      return NextResponse.json({ arsip: [] }, { status: 200 });
    }

    // Format response
    const formattedArsip = arsip.map((item: any) => ({
      id: item._id.toString(),
      judul: item.title,
      kategori: item.category,
      file: item.fileName || 'document.jpg',
      file_asli: item.fileName || (item.title + '.jpg'),
      fileName: item.fileName, // Nama file asli dengan ekstensi
      fileType: item.fileType, // Tipe MIME file
      fileUrl: item.image, // base64 image/file
      tanggal_upload: new Date(item.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      sharedWith: item.sharedWith || [] // Include sharedWith array
    }));

    return NextResponse.json({ arsip: formattedArsip }, { status: 200 });

  } catch (err) {
    console.error('Get arsip error:', err);
    return NextResponse.json({ error: 'Gagal mengambil data arsip' }, { status: 500 });
  }
}
